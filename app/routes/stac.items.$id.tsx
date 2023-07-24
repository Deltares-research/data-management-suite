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
    SELECT ST_AsGeoJson(geometry) as geometry, "id", "createdAt", "properties"
    FROM "Item"
    WHERE "Item"."id" = ${id}
  `) as [Item & { geometry: string }]

  let stacItem = {
    type: 'Feature',
    stac_version: stacPackageJson.version,
    id: item.id,
    description: '',
    properties: {
      datetime: item.createdAt.toISOString(),
    },
    geometry: JSON.parse(item.geometry),
    bbox: [-180, -90, 180, 90],
    assets: {},
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
    return { errors: validate.errors, data: stacItem }
  }
})
