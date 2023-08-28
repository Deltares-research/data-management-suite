import { redirect } from '@remix-run/node'
import { routes } from '~/routes'

export async function loader() {
  return redirect(routes.items())
}
