import { withCors } from '~/utils/withCors'
import { db } from '~/utils/db.server'
import { zx } from 'zodix'
import { z } from 'zod'
import type { Item } from '@prisma/client'
import { getHost } from '~/routes'
import { prismaToStacItem } from '~/utils/prismaToStac'
import type { FeatureCollection } from 'geojson'
import type { StacLink } from 'stac-ts'

export let loader = withCors(async ({ request, params }) => {
  let { collectionId, catalogId } = zx.parseParams(params, {
    collectionId: z.string(),
    catalogId: z.string(),
  })

  let baseUrl = `${getHost(request)}/stac/catalogs/${catalogId}`

  let items = (await db.$queryRaw`
    SELECT ST_AsGeoJson(geometry) as geometry, "id", "createdAt", "properties", "title", "description", "startTime", "dateTime", "endTime", "collectionId"
    FROM "Item"
    WHERE "Item"."collectionId" = ${collectionId}
  `) as (Item & { geometry: string })[]

  let features = items.map(item =>
    prismaToStacItem({
      ...item,
      geometry: JSON.parse(item.geometry),
    }),
  )

  let { page = 1 } = zx.parseQuery(request, { page: zx.IntAsString.optional() })

  let pagination = []
  if (page < 9999) {
    pagination.push({
      rel: 'next',
      type: 'application/geo+json',
      href: `${baseUrl}/collections/${collectionId}/items?page=${page + 1}`,
    })
  }

  if (page > 1) {
    pagination.push({
      rel: 'prev',
      type: 'application/geo+json',
      href: `${baseUrl}/collections/${collectionId}/items?page=${page - 1}`,
    })
  }

  let featureCollection = {
    type: 'FeatureCollection',
    features,
    links: [...pagination],
  } satisfies FeatureCollection & {
    links: StacLink[]
  }

  return featureCollection
})
