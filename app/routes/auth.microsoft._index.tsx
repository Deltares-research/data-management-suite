// app/routes/auth/microsoft.tsx
import type { ActionFunctionArgs } from '@remix-run/node'
import { createAuthenticator } from '~/services/auth.server'
import { redirect } from '@remix-run/node'

export const loader = () => redirect('/login')

export const action = ({ request }: ActionFunctionArgs) => {
  let authenticator = createAuthenticator(request)
  return authenticator.authenticate('microsoft', request)
}
