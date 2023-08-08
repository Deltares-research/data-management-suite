import { type LoaderArgs } from '@remix-run/node'
import stacPackageJson from 'stac-spec/package.json'
import { withCors } from '~/utils/withCors'
import { conformsTo, getStacValidator } from '~/utils/stacspec'
import { db } from '~/utils/db.server'

export let loader = withCors(async ({ request }: LoaderArgs) => {
  let validate = await getStacValidator('Catalog')
  let url = new URL(request.url)

  let baseUrl = `${url.protocol}//${url.host}/stac`

  let externalCatalogs = await db.externalCatalog.findMany()

  let data = {
    type: 'Catalog',
    id: 'deltares-catalog',
    description:
      'Searchable spatiotemporal metadata catalog for all data within Deltares.',
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
        href: `${baseUrl}/search`,
        method: 'GET',
      },
      {
        rel: 'data',
        type: 'application/json',
        href: `${baseUrl}/collections`,
      },
      ...externalCatalogs.map(catalog => ({
        rel: 'child',
        type: 'application/json',
        href: catalog.url,
        title: catalog.title,
      })),
    ],
    conformsTo,
  }

  if (validate(data)) {
    return data
  } else {
    return { errors: validate.errors, data }
  }
})
