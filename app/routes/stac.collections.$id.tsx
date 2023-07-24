import { db } from '~/utils/db.server'
import { withCors } from '~/utils/withCors'
import stacPackageJson from 'stac-spec/package.json'
import { getStacValidator } from '~/utils/stacspec'

export let loader = withCors(async ({ request, params }) => {
  let validate = await getStacValidator('Collection')

  let url = new URL(request.url)
  let { id } = params
  if (!id) throw new Response(null, { status: 400 })

  let baseUrl = `${url.protocol}//${url.host}/stac`

  let collection = await db.collection.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      items: true,
    },
  })
  let stacCollection = {
    type: 'Collection',
    stac_version: stacPackageJson.version,
    id: collection.id,
    description: collection.description ?? '',
    license: 'MIT',
    extent: {
      spatial: {
        bbox: [[-180, -90, 180, 90]],
      },
      temporal: {
        interval: [
          [collection.startTime.toISOString(), collection.endTime ?? null],
        ],
      },
    },
    links: [
      ...collection.items.map(item => ({
        rel: 'child',
        href: `${baseUrl}/items/${item.id}`,
        type: 'application/geo+json',
      })),
      {
        rel: 'self',
        type: 'application/json',
        href: `${baseUrl}/collections/${collection.id}`,
      },
    ],
  }

  if (validate(stacCollection)) {
    return stacCollection
  } else {
    return { errors: validate.errors, data: stacCollection }
  }
})
