import type { LoaderFunctionArgs } from '@remix-run/node'
import { requireAuthentication } from '~/services/auth.server'
import { db } from '~/utils/db.server'

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await requireAuthentication(request)

  let url = new URL(request.url)
  let search = url.searchParams.get('q') ?? ''

  let groups = await db.group.findMany({
    where: {
      name: {
        contains: search,
        mode: 'insensitive',
      },
      members: {
        some: {
          personId: user.id,
        },
      },
    },
    take: 10,
  })

  return groups
}
