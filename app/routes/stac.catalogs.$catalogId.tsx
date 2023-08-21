import { type LoaderArgs } from '@remix-run/node'
import stacPackageJson from 'stac-spec/package.json'
import { withCors } from '~/utils/withCors'
import { conformsTo, getStacValidator } from '~/utils/stacspec'
import { zx } from 'zodix'
import { z } from 'zod'
import { db } from '~/utils/db.server'

export let loader = withCors(async ({ request, params }: LoaderArgs) => {
  let { catalogId } = zx.parseParams(params, { catalogId: z.string() })

  let validate = await getStacValidator('Catalog')
  let url = new URL(request.url)

  let catalog = await db.catalog.findUniqueOrThrow({
    where: {
      id: catalogId,
    },
  })

  let baseUrl = `${url.protocol}//${url.host}/stac/catalogs/${catalogId}`

  let data = {
    type: 'Catalog',
    id: catalog.title,
    description: catalog.description,
    stac_version: stacPackageJson.version,
    links: [
      {
        rel: 'self',
        type: 'application/json',
        href: `${baseUrl}`,
      },
      {
        rel: 'search',
        type: 'application/geo+json',
        title: 'STAC Search',
        href: `${baseUrl}/search`,
        method: 'GET',
      },
      {
        rel: 'data',
        type: 'application/json',
        href: `${baseUrl}/collections`,
      },
    ],
    conformsTo,
  }

  if (validate(data)) {
    return data
  } else {
    return { errors: validate.errors, data }
  }
})
