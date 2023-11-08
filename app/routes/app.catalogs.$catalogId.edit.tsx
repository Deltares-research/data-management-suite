import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import { CatalogForm, submitCatalogForm } from '~/forms/CatalogForm'
import { routes } from '~/routes'
import { requireAuthentication } from '~/services/auth.server'
import { db } from '~/utils/db.server'

export async function action(args: ActionArgs) {
  await requireAuthentication(args.request)

  let { catalogId } = zx.parseParams(args.params, { catalogId: z.string() })

  await submitCatalogForm({ ...args, id: catalogId })

  return redirect(routes.catalogs())
}

export async function loader({ request, params }: LoaderArgs) {
  await requireAuthentication(request)

  let { catalogId } = await zx.parseParams(params, {
    catalogId: z.string(),
  })

  let catalog = await db.catalog.findUniqueOrThrow({
    where: {
      id: catalogId,
    },
    include: {
      permissions: true,
    },
  })

  return {
    catalog,
  }
}

export default function CreateCatalogPage() {
  let { catalog } = useLoaderData<typeof loader>()

  return <CatalogForm defaultValues={catalog} />
}
