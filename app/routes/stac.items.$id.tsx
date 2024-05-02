import { db } from '~/utils/db.server'
import { withCors } from '~/utils/withCors'
import type { StacItem } from '~/utils/prismaToStac'
import { prismaToStacItem } from '~/utils/prismaToStac'
import { z } from 'zod'
import { zx } from 'zodix'
import { fetchItemsGeometries } from '~/utils/fetchGeometries'

export let itemRouteParams = { id: z.string() }

export let loader = withCors(async ({ request, params }) => {
  let { id } = zx.parseParams(params, itemRouteParams)

  let itemMeta = await db.item.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      assets: true,
    },
  })

  let [item] = await fetchItemsGeometries([itemMeta])

  let stacItem = prismaToStacItem({
    ...item,
    request,
  }) satisfies StacItem

  return stacItem
})
