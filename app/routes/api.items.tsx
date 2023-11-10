import type { ActionFunctionArgs } from '@remix-run/node'
import { submitItemForm } from '~/forms/items/ItemForm'

export { loader } from './app.items._index'

export async function action(args: ActionFunctionArgs) {
  return submitItemForm(args)
}
