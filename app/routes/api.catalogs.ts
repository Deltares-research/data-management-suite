import type { LoaderFunctionArgs } from '@remix-run/node'
import { requireAuthentication } from '~/services/auth.server'
import {
  getCollectionAuthReadWhere,
  getCollectionAuthContributeWhere,
} from '~/utils/authQueries'
import { db } from '~/utils/db.server'

export async function catalogApiLoader({ request }: LoaderFunctionArgs) {
  let user = await requireAuthentication(request)

  let url = new URL(request.url)
  let search = url.searchParams.get('q') ?? ''
  let accessType = url.searchParams.get('accessType') ?? 'contribute'
  let authCheck =
    accessType === 'contribute'
      ? getCollectionAuthContributeWhere(user.id)
      : getCollectionAuthReadWhere(user.id)

  let catalogs = await db.catalog.findMany({
    where: {
      ...authCheck.catalog,
      title: {
        contains: search,
        mode: 'insensitive',
      },
    },
    take: 10,
  })

  return catalogs
}

export let loader = catalogApiLoader
