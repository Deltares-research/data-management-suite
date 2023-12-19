import type { LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useRouteLoaderData } from '@remix-run/react'
import { Sidebar } from '~/components/Sidebar'
import type { rootLoader } from '~/root'
import { requireAuthentication } from '~/services/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuthentication(request)

  return null
}

export default function DocsLayout() {
  let user = useRouteLoaderData<typeof rootLoader>('root')

  return (
    <main className="flex h-full">
      <Sidebar user={user} />
      <div className="border-l flex-1">
        <div className="prose mx-auto px-8 py-12 max-w-3xl">
          <Outlet />
        </div>
      </div>
    </main>
  )
}
