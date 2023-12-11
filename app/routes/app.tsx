import type { LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useRouteLoaderData } from '@remix-run/react'
import { Sidebar } from '~/components/Sidebar'
import type { rootLoader } from '~/root'
import { requireAuthentication } from '~/services/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuthentication(request)

  return null
}

export default function AppLayout() {
  let user = useRouteLoaderData<typeof rootLoader>('root')

  return (
    <main className="flex h-full">
      <Sidebar user={user} />
      <div className="border-l flex-1">
        <Outlet />
      </div>
    </main>
  )
}
