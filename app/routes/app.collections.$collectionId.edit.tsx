import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import { CollectionForm, submitCollectionForm } from '~/forms/CollectionForm'
import { requireAuthentication } from '~/services/auth.server'
import { getCollectionAuthReadWhere } from '~/utils/authQueries'
import { db } from '~/utils/db.server'

export async function action(args: ActionFunctionArgs) {
  await requireAuthentication(args.request)

  let { collectionId } = zx.parseParams(args.params, {
    collectionId: z.string(),
  })

  return submitCollectionForm({ ...args, id: collectionId })
}

export async function loader({ params, request }: LoaderFunctionArgs) {
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
