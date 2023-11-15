import type { LoaderFunctionArgs } from '@remix-run/node'
import { db } from '~/utils/db.server'
import { withCors } from '~/utils/withCors'
import { zx } from 'zodix'
import { z } from 'zod'
import { stacRoutes } from '~/routes'
import type { StacCollection } from 'stac-ts'
import { Access } from '@prisma/client'

export let loader = withCors(
  async ({ request, params }: LoaderFunctionArgs) => {
    let { catalogId } = zx.parseParams(params, { catalogId: z.string() })

    let collections = await db.collection.findMany({
      where: {
        catalogId,
        catalog: {
          access: Access.PUBLIC,
        },
      },
      include: {
        items: true,
      },
    })

    let stacCollections: StacCollection[] = collections.map(collection => ({
      type: 'Collection',
      stac_version: '1.0.0',
      id: collection.title,
      description: collection.description ?? '',
      license: 'MIT',
      extent: {
        spatial: {
          // TODO
          bbox: [[-180, -90, 180, 90]],
        },
        temporal: {
          interval: [
            [
              collection.startTime?.toISOString() ?? new Date().toISOString(),
              collection.endTime?.toISOString() ?? null,
            ],
          ],
        },
      },
      links: [
        {
          rel: 'self',
          type: 'application/json',
          href: stacRoutes(request).stacCollection(collection.id),
        },
      ],
    }))

    let data = {
      collections: stacCollections,
      links: [
        {
          rel: 'self',
          type: 'application/json',
          href: stacRoutes(request).stacCollections({ catalogId }),
        },
        {
          rel: 'root',
          type: 'application/json',
          href: stacRoutes(request).stacCatalog(catalogId),
        },
      ],
    }

    return data
  },
)
