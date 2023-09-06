import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { Form, NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Separator } from '~/components/ui/separator'
import { routes } from '~/routes'
import {
  createAuthenticator,
  requireAuthentication,
} from '~/services/auth.server'

export async function loader({ request }: LoaderArgs) {
  return requireAuthentication(request)
}

export async function action({ request }: ActionArgs) {
  let authenticator = createAuthenticator(request)
  await authenticator.logout(request, { redirectTo: routes.login() })
}

export default function AppLayout() {
  let user = useLoaderData<typeof loader>()
  let [firstName, lastName] = (user.name ?? '? ?').split(' ')

  return (
    <div className="h-full flex flex-col">
      <div className="border-b flex-shrink-0 h-16 px-8 flex items-center justify-between">
        <div className="flex gap-5 items-center">
          <NavLink
            to={routes.items()}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            Datasets
          </NavLink>

          <NavLink
            to={routes.collections()}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            Collections
          </NavLink>

          <NavLink
            to={routes.catalogs()}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            Catalogs
          </NavLink>

          <NavLink
            to={routes.keywords()}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            Keywords
          </NavLink>

          <Separator className="h-4" orientation="vertical" />

          <NavLink
            to={routes.externalCatalogs()}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            External Catalogs
          </NavLink>

          <Separator className="h-4" orientation="vertical" />

          <NavLink
            to={routes.groups()}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            Groups
          </NavLink>

          <Separator className="h-4" orientation="vertical" />

          <NavLink
            to={routes.home()}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            Home
          </NavLink>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarFallback>
                  {firstName?.[0]}
                  {lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Form method="post" action="/app">
                  <button>Logout</button>
                </Form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <main className="flex-1 flex flex-col h-full">
        <Outlet />
      </main>
    </div>
  )
}
