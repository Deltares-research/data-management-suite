import { db } from '~/utils/db.server'
import { withCors } from '~/utils/withCors'
import type { Item } from '@prisma/client'
// import { getHost } from '~/routes'
import type { StacItem } from '~/utils/prismaToStac'
import { prismaToStacItem } from '~/utils/prismaToStac'
import { z } from 'zod'
import { zx } from 'zodix'

export let itemRouteParams = { id: z.string() }

export let loader = withCors(async ({ params }) => {
  let { id } = zx.parseParams(params, itemRouteParams)

  let [item] = (await db.$queryRaw`
    SELECT ST_AsGeoJson(geometry) as geometry, "id", "createdAt", "properties", "datetime", "start_datetime", "end_datetime", "collectionId"
    FROM "Item"
    WHERE "Item"."id" = ${id}
  `) as [Item & { geometry: string }]

  let stacItem = prismaToStacItem({
    ...item,
    geometry: JSON.parse(item.geometry),
  }) satisfies StacItem

  return stacItem
})
