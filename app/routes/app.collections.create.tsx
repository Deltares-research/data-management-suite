import type { ActionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { CollectionForm, submitCollectionForm } from '~/forms/CollectionForm'
import { routes } from '~/routes'
import { db } from '~/utils/db.server'

export async function action(args: ActionArgs) {
  await submitCollectionForm(args)

  return redirect(routes.collections())
}

export async function loader() {
  let catalogs = await db.catalog.findMany()

  return { catalogs }
}

export default function CreateCollectionPage() {
  let { catalogs } = useLoaderData<typeof loader>()

  return <CollectionForm catalogs={catalogs} />
}
