import type { ActionArgs } from '@remix-run/node'
import { submitItemForm } from '~/forms/ItemForm'

export { loader } from './app.items._index'

export async function action(args: ActionArgs) {
  return submitItemForm(args)
}
