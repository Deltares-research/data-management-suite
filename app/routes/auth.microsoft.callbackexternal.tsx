// app/routes/auth/microsoft/callback.tsx
import type { LoaderFunctionArgs } from '@remix-run/node'
import { routes } from '~/routes'
import { createAuthenticator } from '~/services/auth.server'

export const loader = ({ request }: LoaderFunctionArgs) => {
  let authenticator = createAuthenticator(request)
  return authenticator.authenticate('microsoft', request, {
    successRedirect: 'http://localhost:8080/Experiments',
    failureRedirect: routes.login(),
  })
}
