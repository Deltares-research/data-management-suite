import { withCors } from '~/utils/withCors'
import { db } from '~/utils/db.server'
import stacPackageJson from 'stac-spec/package.json'
import { zx } from 'zodix'
import { z } from 'zod'
import type { Item } from '@prisma/client'
import { getHost } from '~/routes'
import { prismaToStacItem } from '~/utils/prismaToStac'

// function maybeDate(dateString?: string | Date | null) {
//   return dateString ? new Date(dateString)?.toISOString() : undefined
// }

const ITEMS_PER_PAGE = 20

export let loader = withCors(async ({ request, params }) => {
  let {
    q = '',
    page = 0,
    // collections: collectionsString,
    bbox: bboxString,
  } = zx.parseQuery(request, {
    q: z.string().optional(),
    page: zx.IntAsString.optional(),
    // collections: z.string().optional(),
    bbox: z.string().optional(),
  })

  let url = new URL(request.url)

  let bbox = bboxString ? JSON.parse(bboxString) : [-180, -90, 180, 90]

  let baseUrl = `${getHost(request)}/stac/search`

  let items = (await db.$queryRaw`
    SELECT ST_AsGeoJson(geometry) as geometry, "id", "createdAt", "properties", "title", "description", "startTime", "dateTime", "endTime", "collectionId"
    FROM "Item"
    WHERE ST_Intersects(geometry, ST_MakeEnvelope(${
      bbox[0]
    }::double precision, ${bbox[1]}::double precision, ${
    bbox[2]
  }::double precision, ${bbox[3]}::double precision, 4326))
    AND
      ("Item"."title" LIKE ${'%' + q + '%'} OR "Item"."description" LIKE ${
    '%' + q + '%'
  })

    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${ITEMS_PER_PAGE * page}
  `) as (Item & { geometry: string })[]

  let features = items.map(item =>
    prismaToStacItem({
      ...item,
      geometry: JSON.parse(item.geometry),
    }),
  )

  // let dates = features
  //   .flatMap(
  //     f =>
  //       f.properties.datetime ?? [
  //         f.properties.start_datetime,
  //         f.properties.end_datetime,
  //       ],
  //   )
  //   .filter(Boolean)
  //   .map(d => new Date(d!).getTime())

  // let minTime = Math.min(...dates)
  // let maxTime = Math.max(...dates)

  let pagination = []
  if (page < 9999) {
    url.searchParams.set('page', (page + 1).toString())
    pagination.push({
      rel: 'next',
      type: 'application/geo+json',
      href: `${baseUrl}?${url.searchParams.toString()}`,
    })
  }

  if (page > 1) {
    url.searchParams.set('page', (page - 1).toString())
    pagination.push({
      rel: 'prev',
      type: 'application/geo+json',
      href: `${baseUrl}?page=${page - 1}`,
    })
  }

  let featureCollection = {
    type: 'FeatureCollection',
    stac_version: stacPackageJson.version,
    description: '',
    license: 'MIT',
    extent: {
      spatial: {
        bbox,
      },
      temporal: {
        interval: [
          // TODO: Fix
          // [new Date(minTime).toISOString(), new Date(maxTime).toISOString()],
        ],
      },
    },
    features,
    links: [...pagination],
  }

  return featureCollection
})
