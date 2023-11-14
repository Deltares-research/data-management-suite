import { type LoaderFunctionArgs } from '@remix-run/node'
import { withCors } from '~/utils/withCors'
import { conformsTo } from '~/utils/stacspec'
import { db } from '~/utils/db.server'
import { stacRoutes } from '~/routes'
import { Access } from '@prisma/client'
import type { StacCatalog } from 'stac-ts'

export let loader = withCors(async ({ request }: LoaderFunctionArgs) => {
  let [catalogs, externalCatalogs] = await Promise.all([
    db.catalog.findMany({
      where: {
        access: Access.PUBLIC,
      },
    }),
    db.externalCatalog.findMany(),
  ])

  let data: StacCatalog = {
    type: 'Catalog',
    id: 'deltares-catalog',
    description:
      'Searchable spatiotemporal metadata catalog for all data within Deltares.',
    stac_version: '1.0.0',
    links: [
      {
        rel: 'self',
        type: 'application/json',
        href: stacRoutes(request).stacAPIRoot(),
      },
      {
        rel: 'search',
        type: 'application/geo+json',
        href: stacRoutes(request).stacSearch(),
        method: 'POST',
      },
      {
        rel: 'search',
        type: 'application/geo+json',
        href: stacRoutes(request).stacSearch(),
        method: 'GET',
      },
      {
        title: 'Queryables',
        href: stacRoutes(request).stacQueryables(),
        rel: 'http://www.opengis.net/def/rel/ogc/1.0/queryables',
        type: 'application/schema+json',
      },
      ...catalogs.map(catalog => ({
        rel: 'child',
        type: 'application/json',
        href: stacRoutes(request).stacCatalog(catalog.id),
        title: catalog.title ?? undefined,
      })),
      ...externalCatalogs.map(catalog => ({
        rel: 'child',
        type: 'application/json',
        href: catalog.url,
        title: catalog.title ?? undefined,
      })),
    ],
    conformsTo,
  }

  return data
})
