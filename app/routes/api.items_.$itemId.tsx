import type { ActionArgs } from '@remix-run/node'
import { z } from 'zod'
import { zx } from 'zodix'
import { submitItemForm } from '~/forms/ItemForm'

export let itemRouteParams = { itemId: z.string() }

export async function action(args: ActionArgs) {
  let { itemId } = zx.parseParams(args.params, itemRouteParams)

  return submitItemForm({ ...args, id: itemId })
}
