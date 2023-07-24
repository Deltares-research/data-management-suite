import type { LoaderArgs } from '@remix-run/node'
import stacPackageJson from 'stac-spec/package.json'
import { db } from '~/utils/db.server'
import { withCors } from '~/utils/withCors'
import { getStacValidator } from '~/utils/stacspec'

export let loader = withCors(async ({ request }: LoaderArgs) => {
  let validate = await getStacValidator('Collection')

  let url = new URL(request.url)

  let baseUrl = `${url.protocol}//${url.host}/stac`

  let collections = await db.collection.findMany({
    include: {
      items: true,
    },
  })
  let stacCollections = collections.map(collection => ({
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
  }))

  let errors = stacCollections
    .map(c => {
      validate(c)
      return validate.errors
    })
    .filter(Boolean)

  let data = {
    collections: stacCollections,
    links: [
      {
        rel: 'self',
        type: 'application/json',
        href: `${baseUrl}/collections`,
      },
      {
        rel: 'root',
        type: 'application/json',
        href: `${baseUrl}`,
      },
    ],
  }

  if (errors.length) {
    return { errors, data }
  } else {
    return data
  }
})
