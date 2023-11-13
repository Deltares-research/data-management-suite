import { db } from '~/utils/db.server'
import { withCors } from '~/utils/withCors'
import type { Asset, Item } from '@prisma/client'
// import { getHost } from '~/routes'
import type { StacItem } from '~/utils/prismaToStac'
import { prismaToStacItem } from '~/utils/prismaToStac'
import { z } from 'zod'
import { zx } from 'zodix'

export let itemRouteParams = { id: z.string() }

export let loader = withCors(async ({ params }) => {
  let { id } = zx.parseParams(params, itemRouteParams)

  let [item] = (await db.$queryRaw`
    SELECT ST_AsGeoJson(geometry) as geometry, "id", "createdAt", "properties", "datetime", "start_datetime", "end_datetime", "collectionId",
    json_agg(json_build_object(
      'key', "Asset"."key",
      'href', "Asset"."href",
      'title', "Asset"."title",
      'description', "Asset"."description",
      'type', "Asset"."type",
      'roles', "Asset"."roles"
    )) as assets
    FROM "Item"
    LEFT JOIN "Asset" ON "Asset"."itemId" = "Item"."id"
    WHERE "Item"."id" = ${id}
    GROUP BY "Item"."id"
  `) as [Item & { geometry: string; assets: Asset[] }]

  let stacItem = prismaToStacItem({
    ...item,
    geometry: JSON.parse(item.geometry),
  }) satisfies StacItem

  return stacItem
})
