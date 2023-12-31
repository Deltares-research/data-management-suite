import { useLoaderData } from '@remix-run/react'

import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { requireAuthentication } from '~/services/auth.server'
import { routes } from '~/routes'

import { redirect } from '@remix-run/node'

import { db } from '~/utils/db.server'
import { ItemForm, submitItemForm } from '~/forms/items/ItemForm'
import { getCollectionAuthContributeWhere } from '~/utils/authQueries'

export const meta: MetaFunction = () => {
  return [{ title: 'Register metadata' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await requireAuthentication(request)

  let collections = await db.collection.findMany({
    include: {
      catalog: {
        select: {
          title: true,
        },
      },
    },
    where: getCollectionAuthContributeWhere(user.id),
  })

  return { collections }
}

export async function action(args: ActionFunctionArgs) {
  await submitItemForm(args)

  return redirect(routes.items())
}

export default function CreatePage() {
  let { collections } = useLoaderData<typeof loader>()

  return <ItemForm collections={collections} />
}
