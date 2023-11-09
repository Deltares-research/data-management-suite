import { Outlet, useRouteLoaderData } from '@remix-run/react'
import { Sidebar } from '~/components/Sidebar'
import type { rootLoader } from '~/root'

export default function AppLayout() {
  let user = useRouteLoaderData<typeof rootLoader>('root')

  return (
    <main className="grid grid-cols-5 h-full">
      <Sidebar user={user} />
      <div className="col-span-3 lg:col-span-4 lg:border-l">
        <Outlet />
      </div>
    </main>
  )
}
