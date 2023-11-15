import { withCors } from '~/utils/withCors'
import { db } from '~/utils/db.server'
import { zx } from 'zodix'
import { z } from 'zod'
import type { Asset, Item } from '@prisma/client'
import { stacRoutes } from '~/routes'
import { prismaToStacItem } from '~/utils/prismaToStac'
import type { FeatureCollection } from 'geojson'
import type { StacLink } from 'stac-ts'

export let loader = withCors(async ({ request, params }) => {
  let { collectionId } = zx.parseParams(params, {
    collectionId: z.string(),
  })

  let { page = 1, limit = 12 } = zx.parseQuery(request, {
    page: zx.IntAsString.optional(),
    limit: zx.IntAsString.optional(),
  })

  let items = (await db.$queryRaw`
    SELECT ST_AsGeoJson(geometry) as geometry, "id", "createdAt", "properties", "datetime", "start_datetime", "end_datetime", "collectionId",
    json_agg(json_build_object(
      'key', "Asset"."key",
      'href', "Asset"."href",
      'title', "Asset"."title",
      'description', "Asset"."description",
      'type', "Asset"."type",
      'roles', "Asset"."roles"
    )) as assets
    FROM "Item"
    LEFT JOIN "Asset" ON "Asset"."itemId" = "Item"."id"
    WHERE "Item"."collectionId" = ${collectionId}
    GROUP BY "Item"."id"
    LIMIT ${limit} OFFSET ${limit * (page - 1)}
  `) as (Item & { geometry: string; assets: Asset[] })[]

  let features = items.map(item =>
    prismaToStacItem({
      ...item,
      geometry: JSON.parse(item.geometry),
      request,
    }),
  )

  let pagination = []
  if (items.length === limit) {
    pagination.push({
      rel: 'next',
      type: 'application/geo+json',
      href: stacRoutes(request).stacItems({
        collectionId,
        page: (page + 1).toString(),
      }),
    })
  }

  if (page > 1) {
    pagination.push({
      rel: 'prev',
      type: 'application/geo+json',
      href: stacRoutes(request).stacItems({
        collectionId,
        page: (page - 1).toString(),
      }),
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
