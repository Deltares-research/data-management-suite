import { db } from '~/utils/db.server'
import { withCors } from '~/utils/withCors'
import { zx } from 'zodix'
import { z } from 'zod'
import { stacRoutes } from '~/routes'
import type { StacCollection } from 'stac-ts'
import { Access } from '@prisma/client'

export let loader = withCors(async ({ request, params }) => {
  let { collectionId } = zx.parseParams(params, {
    collectionId: z.string(),
  })

  let collection = await db.collection.findUniqueOrThrow({
    where: {
      id: collectionId,
      catalog: {
        access: Access.PUBLIC,
      },
    },
  })

  let stacCollection: StacCollection = {
    type: 'Collection',
    stac_version: '1.0.0',
    id: collection.title,
    description: collection.description ?? '',
    license: 'MIT',
    extent: {
      spatial: {
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
        rel: 'items',
        type: 'application/geo+json',
        href: stacRoutes(request).stacItems({ collectionId: collection.id }),
      },
      {
        rel: 'self',
        type: 'application/json',
        href: stacRoutes(request).stacCollection(collection.id),
      },
      {
        rel: 'catalog',
        type: 'application/json',
        href: stacRoutes(request).stacCatalog(collection.catalogId),
      },
    ],
  }

  return stacCollection
})
