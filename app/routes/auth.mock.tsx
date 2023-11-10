import type { ActionFunctionArgs } from '@remix-run/node'
import { routes } from '~/routes'
import { createAuthenticator } from '~/services/auth.server'

export async function action({ request }: ActionFunctionArgs) {
  let authenticator = createAuthenticator(request)
  return await authenticator.authenticate('form', request, {
    successRedirect: routes.items(),
    failureRedirect: '/auth/mock',
  })
}

export default function MockLogin() {
  return (
    <div>
      <h1>Mock Login</h1>
      <form method="post">
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
