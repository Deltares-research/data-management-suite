import { useLoaderData } from '@remix-run/react'

import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { requireAuthentication } from '~/services/auth.server'
import { routes } from '~/routes'

import { redirect } from '@remix-run/node'

import { db } from '~/utils/db.server'
import { ItemForm, submitItemForm } from '~/forms/items/ItemForm'

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Register metadata' }]
}

export async function loader({ request }: LoaderArgs) {
  await requireAuthentication(request)

  let collections = await db.collection.findMany({
    include: {
      catalog: {
        select: {
          title: true,
        },
      },
    },
  })

  return { collections }
}

export async function action(args: ActionArgs) {
  await submitItemForm(args)

  return redirect(routes.items())
}

export default function CreatePage() {
  let { collections } = useLoaderData<typeof loader>()

  return <ItemForm collections={collections} />
}
