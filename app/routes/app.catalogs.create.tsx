import type { ActionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { CatalogForm, submitCatalogForm } from '~/forms/CatalogForm'
import { routes } from '~/routes'
import { requireAuthentication } from '~/services/auth.server'

export async function action(args: ActionArgs) {
  await requireAuthentication(args.request)

  await submitCatalogForm(args)

  return redirect(routes.catalogs())
}

export default function CreateCatalogPage() {
  return <CatalogForm />
}