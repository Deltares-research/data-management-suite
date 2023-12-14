import type { LoaderFunctionArgs } from '@remix-run/node'
import { requireAuthentication } from '~/services/auth.server'
import {
  getCollectionAuthReadWhere,
  getCollectionAuthContributeWhere,
} from '~/utils/authQueries'
import { db } from '~/utils/db.server'

export async function collectionApiLoader({ request }: LoaderFunctionArgs) {
  let user = await requireAuthentication(request)

  let url = new URL(request.url)
  let search = url.searchParams.get('q') ?? ''
  let accessType = url.searchParams.get('accessType') ?? 'contribute'
  let authCheck =
    accessType === 'contribute'
      ? getCollectionAuthContributeWhere(user.id)
      : getCollectionAuthReadWhere(user.id)

  let collection = await db.collection.findMany({
    where: {
      ...authCheck,
      title: {
        contains: search,
        mode: 'insensitive',
      },
    },
    include: {
      catalog: true,
    },
    take: 10,
  })

  return collection
}

export let loader = collectionApiLoader
