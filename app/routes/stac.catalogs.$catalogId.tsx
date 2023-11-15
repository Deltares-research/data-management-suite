import { type LoaderFunctionArgs } from '@remix-run/node'
import { withCors } from '~/utils/withCors'
import { conformsTo } from '~/utils/stacspec'
import { zx } from 'zodix'
import { z } from 'zod'
import { db } from '~/utils/db.server'
import { getHost, stacRoutes } from '~/routes'
import type { StacCatalog } from 'stac-ts'
import { Access } from '@prisma/client'

export let loader = withCors(
  async ({ request, params }: LoaderFunctionArgs): Promise<StacCatalog> => {
    let { catalogId } = zx.parseParams(params, { catalogId: z.string() })

    let catalog = await db.catalog.findUniqueOrThrow({
      where: {
        id: catalogId,
        access: Access.PUBLIC,
      },
    })

    let baseUrl = `${getHost(request)}/stac`

    let stacCatalog: StacCatalog = {
      type: 'Catalog',
      id: catalog.title ?? catalog.id,
      description: catalog.description,
      stac_version: '1.0.0',
      links: [
        {
          rel: 'self',
          type: 'application/json',
          href: baseUrl,
        },
        {
          rel: 'search',
          type: 'application/geo+json',
          title: 'STAC Search',
          href: stacRoutes(request).stacSearch(),
          method: 'GET',
        },
        {
          rel: 'data',
          type: 'application/json',
          href: stacRoutes(request).stacCollections({ catalogId: catalog.id }),
        },
      ],
      conformsTo,
    }

    return stacCatalog
  },
)
