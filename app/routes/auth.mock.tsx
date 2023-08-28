import type { LoaderArgs } from '@remix-run/node'
import { routes } from '~/routes'
import { createAuthenticator } from '~/services/auth.server'

export async function loader({ request }: LoaderArgs) {
  let authenticator = createAuthenticator(request)
  return authenticator.authenticate('mock', request, {
    successRedirect: routes.items(),
  })
}
