import { withCors } from '~/utils/withCors'
import { db } from '~/utils/db.server'
import stacPackageJson from 'stac-spec/package.json'
import { zx } from 'zodix'
import { z } from 'zod'
import type { Item } from '@prisma/client'
import { polygonsToBbox } from '~/utils/stacspec'
import { getHost } from '~/routes'

export let loader = withCors(async ({ request, params }) => {
  let { collectionId, catalogId } = zx.parseParams(params, {
    collectionId: z.string(),
    catalogId: z.string(),
  })

  let baseUrl = `${getHost(request)}/stac/catalogs/${catalogId}`

  let collection = await db.collection.findUniqueOrThrow({
    where: {
      id: collectionId,
    },
    include: {
      items: true,
    },
  })

  let items = (await db.$queryRaw`
    SELECT ST_AsGeoJson(geometry) as geometry, "id", "createdAt", "properties", "title", "description", "startTime", "dateTime", "endTime"
    FROM "Item"
    WHERE "Item"."collectionId" = ${collectionId}
  `) as (Item & { geometry: string })[]

  let features = items.map(item => ({
    type: 'Feature',
    stac_version: stacPackageJson.version,
    id: item.title,
    description: item.description,
    properties: {
      title: item.title,
      datetime: item.dateTime?.toISOString(),
      start_datetime: item.startTime?.toISOString(),
      end_datetime: item.endTime?.toISOString(),
    },
    geometry: JSON.parse(item.geometry),
    assets: {},
    links: [
      {
        rel: 'self',
        type: 'application/json',
        href: `${baseUrl}/items/${item.id}`,
      },
    ],
  }))

  let { page = 1 } = zx.parseQuery(request, { page: zx.IntAsString.optional() })

  let dates = features
    .flatMap(
      f =>
        f.properties.datetime ?? [
          f.properties.start_datetime,
          f.properties.end_datetime,
        ],
    )
    .filter(Boolean)
    .map(d => new Date(d!).getTime())

  let minTime = Math.min(...dates)
  let maxTime = Math.max(...dates)

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

  let bbox = [
    polygonsToBbox({
      features,
    }),
  ]

  let featureCollection = {
    type: 'FeatureCollection',
    stac_version: stacPackageJson.version,
    id: collection.id,
    description: '',
    license: 'MIT',
    extent: {
      spatial: {
        bbox,
      },
      temporal: {
        interval: [
          [new Date(minTime).toISOString(), new Date(maxTime).toISOString()],
        ],
      },
    },
    features,
    links: [...pagination],
  }

  return featureCollection
})
