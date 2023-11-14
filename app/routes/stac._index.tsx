import { type LoaderFunctionArgs } from '@remix-run/node'
import stacPackageJson from 'stac-spec/package.json'
import { withCors } from '~/utils/withCors'
import { conformsTo, getStacValidator } from '~/utils/stacspec'
import { db } from '~/utils/db.server'
import { getHost } from '~/routes'

export let loader = withCors(async ({ request }: LoaderFunctionArgs) => {
  let validate = await getStacValidator('Catalog')

  let baseUrl = `${getHost(request)}/stac`

  let [catalogs, externalCatalogs] = await Promise.all([
    db.catalog.findMany(),
    db.externalCatalog.findMany(),
  ])

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
        method: 'POST',
      },
      {
        rel: 'search',
        type: 'application/geo+json',
        href: `${baseUrl}/search`,
        method: 'GET',
      },
      {
        title: 'Queryables',
        href: `${baseUrl}/queryables`,
        rel: 'http://www.opengis.net/def/rel/ogc/1.0/queryables',
        type: 'application/schema+json',
      },
      // {
      //   rel: 'data',
      //   type: 'application/json',
      //   href: `${baseUrl}/collections`,
      // },
      ...catalogs.map(catalog => ({
        rel: 'child',
        type: 'application/json',
        href: `${baseUrl}/catalogs/${catalog.id}`,
        title: catalog.title,
      })),
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
