import type { LoaderArgs } from '@remix-run/node'
import { routes } from '~/routes'
import { authenticator } from '~/services/auth.server'

export async function loader({ request }: LoaderArgs) {
  return authenticator.authenticate('mock', request, {
    successRedirect: routes.items(),
  })
}
