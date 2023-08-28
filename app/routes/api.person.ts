import type { LoaderArgs } from '@remix-run/node'
import { requireAuthentication } from '~/services/auth.server'
import { db } from '~/utils/db.server'

export async function loader({ request }: LoaderArgs) {
  await requireAuthentication(request)

  let url = new URL(request.url)
  let search = url.searchParams.get('q') ?? ''

  let people = await db.person.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            equals: search,
            mode: 'insensitive',
          },
        },
      ],
    },
    take: 10,
  })

  return people
}
