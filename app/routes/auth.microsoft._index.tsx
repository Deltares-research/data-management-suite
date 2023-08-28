// app/routes/auth/microsoft.tsx
import type { ActionArgs } from '@remix-run/node'
import { createAuthenticator } from '~/services/auth.server'
import { redirect } from '@remix-run/node'

export const loader = () => redirect('/login')

export const action = ({ request }: ActionArgs) => {
  let authenticator = createAuthenticator(request)
  return authenticator.authenticate('microsoft', request)
}
