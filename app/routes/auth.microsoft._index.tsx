// app/routes/auth/microsoft.tsx
import type { ActionFunctionArgs } from '@remix-run/node'
import { createAuthenticator } from '~/services/auth.server'
import { redirect } from '@remix-run/node'

export const loader = () => redirect('/login')

export const action = async ({ request }: ActionFunctionArgs) => {
  let body = await request.formData()
  let redirectUrl = body.get('redirectUrl')?.toString()
  let authenticator = createAuthenticator(request, redirectUrl)
  return authenticator.authenticate('microsoft', request)
}
