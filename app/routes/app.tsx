import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { Form, NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { routes } from '~/routes'
import { authenticator } from '~/services/auth.server'

export async function loader({ request }: LoaderArgs) {
  return authenticator.isAuthenticated(request, { failureRedirect: '/login' })
}

export async function action({ request }: ActionArgs) {
  await authenticator.logout(request, { redirectTo: routes.login() })
}

export default function AppLayout() {
  let user = useLoaderData<typeof loader>()
  let [firstName, lastName] = (user.name ?? '? ?').split(' ')

  return (
    <div>
      <div className="border-b h-16 px-8 flex items-center justify-between">
        <NavLink
          to="/app/list"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors hover:text-primary ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`
          }
        >
          Datasets
        </NavLink>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarFallback>
                  {firstName[0]}
                  {lastName[0]}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Form method="post">
                  <button>Logout</button>
                </Form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
