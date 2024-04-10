import type { LoaderFunctionArgs } from '@remix-run/node'
import { requireAuthentication } from '~/services/auth.server'
import { withCors } from '~/utils/withCors'

export let loader = withCors(
  async ({ request }: LoaderFunctionArgs) => {
    try {
      let person = await requireAuthentication(request)
      return person
    } catch (error) {
      return new Response('Unauthorized', { status: 401 })
    }
  },
  { allowOrigin: 'http://localhost:8080' },
)
