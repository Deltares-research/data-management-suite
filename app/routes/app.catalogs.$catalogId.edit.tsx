import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import { CatalogForm, submitCatalogForm } from '~/forms/CatalogForm'
import { routes } from '~/routes'
import { authenticator } from '~/services/auth.server'
import { db } from '~/utils/db.server'

export async function action(args: ActionArgs) {
  await authenticator.isAuthenticated(args.request)

  let { catalogId } = zx.parseParams(args.params, { catalogId: z.string() })

  await submitCatalogForm({ ...args, id: catalogId })

  return redirect(routes.catalogs())
}

export async function loader({ request, params }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: routes.login(),
  })

  let { catalogId } = await zx.parseParams(params, {
    catalogId: z.string(),
  })

  return db.catalog.findUniqueOrThrow({
    where: {
      id: catalogId,
    },
  })
}

export default function CreateCatalogPage() {
  let defaultValues = useLoaderData<typeof loader>()

  return <CatalogForm defaultValues={defaultValues} />
}
