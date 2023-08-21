import { db } from '~/utils/db.server'
import { withCors } from '~/utils/withCors'
import stacPackageJson from 'stac-spec/package.json'
import type { Item } from '@prisma/client'
import { getStacValidator } from '~/utils/stacspec'

export let loader = withCors(async ({ request, params }) => {
  let validate = await getStacValidator('Item')

  let url = new URL(request.url)
  let { id } = params
  if (!id) throw new Response(null, { status: 400 })

  let baseUrl = `${url.protocol}//${url.host}/stac`

  let [item] = (await db.$queryRaw`
    SELECT ST_AsGeoJson(geometry) as geometry, "id", "createdAt", "properties", "dateTime", "title", "startTime", "endTime", "location"
    FROM "Item"
    WHERE "Item"."id" = ${id}
  `) as [Item & { geometry: string }]

  let stacItem = {
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
    assets: {
      data: {
        href: item.location,
        title: `${item.title} Data`,
        roles: ['data'],
      },
    },
    links: [
      {
        rel: 'self',
        type: 'application/json',
        href: `${baseUrl}/items/${item.id}`,
      },
    ],
  }

  if (validate(stacItem)) {
    return stacItem
  } else {
    // return { errors: validate.errors, data: stacItem }
    return stacItem
  }
})
