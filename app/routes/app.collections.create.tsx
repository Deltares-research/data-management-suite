import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { CollectionForm, submitCollectionForm } from '~/forms/CollectionForm'
import { requireAuthentication } from '~/services/auth.server'
import { whereUserCanWriteCatalog } from '~/utils/authQueries'
import { db } from '~/utils/db.server'

export async function action(args: ActionFunctionArgs) {
  return submitCollectionForm(args)
}

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await requireAuthentication(request)

  let catalogs = await db.catalog.findMany({
    where: whereUserCanWriteCatalog(user.id),
    include: {
      permissions: {
        include: {
          group: true,
        },
      },
    },
  })

  return { catalogs }
}

export default function CreateCollectionPage() {
  let { catalogs } = useLoaderData<typeof loader>()

  return <CollectionForm catalogs={catalogs} />
}
