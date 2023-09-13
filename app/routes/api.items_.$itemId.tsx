import type { ActionArgs } from '@remix-run/node'
import { z } from 'zod'
import { zx } from 'zodix'
import { submitItemForm } from '~/forms/ItemForm'

// TODO: Remove collections, only fetch item
export { loader } from './app.items.$itemId.edit'

export async function action(args: ActionArgs) {
  let { itemId } = zx.parseParams(args.params, { itemId: z.string() })

  return submitItemForm({ ...args, id: itemId })
}
