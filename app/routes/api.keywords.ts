import type { LoaderArgs } from '@remix-run/node'
import { db } from '~/utils/db.server'

export async function loader({ request }: LoaderArgs) {
  let url = new URL(request.url)
  let search = url.searchParams.get('q') ?? ''

  let keywords = await db.keyword.findMany({
    where: {
      OR: [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          id: {
            equals: search,
          },
        },
      ],
    },
    orderBy: {
      items: {
        _count: 'desc',
      },
    },
    take: 10,
    include: {
      parent: {
        select: {
          title: true,
        },
      },
    },
  })

  return keywords
}
