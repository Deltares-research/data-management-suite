import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import { submitCatalogForm } from '~/forms/CatalogForm'
import { CollectionForm } from '~/forms/CollectionForm'
import { routes } from '~/routes'
import { requireAuthentication } from '~/services/auth.server'
import { getCollectionAuthReadWhere } from '~/utils/authQueries'
import { db } from '~/utils/db.server'

export async function action(args: ActionArgs) {
  await requireAuthentication(args.request)

  let { collectionId } = zx.parseParams(args.params, {
    collectionId: z.string(),
  })

  await submitCatalogForm({ ...args, id: collectionId })

  return redirect(routes.collections())
}

export async function loader({ params, request }: LoaderArgs) {
  let user = await requireAuthentication(request)

  let { collectionId } = zx.parseParams(params, {
    collectionId: z.string(),
  })
  let [defaultValues, catalogs] = await Promise.all([
    db.collection.findUniqueOrThrow({
      where: {
        id: collectionId,
      },
    }),
    db.catalog.findMany({
      where: getCollectionAuthReadWhere(user.id).catalog,
    }),
  ])

  return { defaultValues, catalogs }
}

export default function CreateCollectionPage() {
  let { catalogs, defaultValues } = useLoaderData<typeof loader>()

  return <CollectionForm catalogs={catalogs} defaultValues={defaultValues} />
}
