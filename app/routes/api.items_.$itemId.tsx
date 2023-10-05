import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { z } from 'zod'
import { zx } from 'zodix'
import { submitItemForm } from '~/forms/ItemForm'
import type { AllowedGeometry } from '~/types'
import { db } from '~/utils/db.server'

export let itemRouteParams = { itemId: z.string() }

export async function loader({ params }: LoaderArgs) {
  // TODO TURN ON
  // await requireAuthentication(request)

  let { itemId } = await zx.parseParams(params, itemRouteParams)

  let item = await db.item.findUniqueOrThrow({
    where: {
      id: itemId,
    },
    include: {
      keywords: true,
    },
  })

  // Not optimal, but for now cleaner than a full raw query
  let [{ geometry }] = await db.$queryRaw<{ geometry: string }[]>`
      SELECT ST_AsGeoJson(geometry) as geometry
      FROM "Item"
      WHERE "Item"."id" = ${itemId}
    `

  return {
    ...item,
    geometry: JSON.parse(geometry) as AllowedGeometry,
  }
}

export async function action(args: ActionArgs) {
  let { itemId } = zx.parseParams(args.params, itemRouteParams)

  return submitItemForm({ ...args, id: itemId })
}
