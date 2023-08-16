import { useLoaderData } from '@remix-run/react'

import { redirect } from '@remix-run/node'
import type { LoaderArgs, ActionArgs } from '@remix-run/node'

import { db } from '~/utils/db.server'
import { authenticator } from '~/services/auth.server'
import { ItemForm, submitItemForm } from '~/forms/ItemForm'
import { routes } from '~/routes'

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request)

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
