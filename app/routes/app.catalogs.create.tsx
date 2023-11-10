import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { CatalogForm, submitCatalogForm } from '~/forms/CatalogForm'
import { routes } from '~/routes'
import { requireAuthentication } from '~/services/auth.server'

export async function action(args: ActionFunctionArgs) {
  await requireAuthentication(args.request)

  await submitCatalogForm(args)

  return redirect(routes.catalogs())
}

export default function CreateCatalogPage() {
  return <CatalogForm />
}
