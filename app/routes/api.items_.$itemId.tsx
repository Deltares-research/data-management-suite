import type { ActionFunctionArgs } from '@remix-run/node'
import { z } from 'zod'
import { zx } from 'zodix'
import { submitItemForm } from '~/forms/items/ItemForm'

export let itemRouteParams = { itemId: z.string() }

export async function action(args: ActionFunctionArgs) {
  let { itemId } = zx.parseParams(args.params, itemRouteParams)

  return submitItemForm({ ...args, id: itemId })
}
