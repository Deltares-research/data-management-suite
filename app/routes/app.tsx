import type { LoaderArgs } from '@remix-run/node'
import { Outlet, useRouteLoaderData } from '@remix-run/react'
import { Sidebar } from '~/components/Sidebar'
import type { rootLoader } from '~/root'
import { requireAuthentication } from '~/services/auth.server'

export async function loader({ request }: LoaderArgs) {
  await requireAuthentication(request)

  return null
}

export default function AppLayout() {
  let user = useRouteLoaderData<typeof rootLoader>('root')

  return (
    <main className="grid grid-cols-5 h-full">
      <Sidebar user={user} />
      <div className="col-span-4 border-l">
        <Outlet />
      </div>
    </main>
  )
}
