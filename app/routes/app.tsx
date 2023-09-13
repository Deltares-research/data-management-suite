import { Role } from '@prisma/client'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import type { NavLinkProps } from '@remix-run/react'
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
import { createAuthenticator } from '~/services/auth.server'
import { db } from '~/utils/db.server'

export async function loader({ request }: LoaderArgs) {
  let authenticator = createAuthenticator(request)
  let user = await authenticator.isAuthenticated(request)

  return db.person.findUnique({
    where: {
      id: user?.id ?? '',
    },
    include: {
      memberOf: {
        include: {
          group: true,
        },
      },
    },
  })
}

export async function action({ request }: ActionArgs) {
  let authenticator = createAuthenticator(request)
  await authenticator.logout(request, { redirectTo: routes.login() })
}

export default function AppLayout() {
  let user = useLoaderData<typeof loader>()
  let [firstName, lastName] = (user?.name ?? '? ?').split(' ')

  let canWrite = user?.memberOf.some(
    member => member.role === Role.ADMIN || member.role === Role.CONTRIBUTOR,
  )
  let isAdmin = user?.memberOf.some(
    member => member.role === Role.ADMIN || member.role === Role.CONTRIBUTOR,
  )

  return (
    <div className="h-full flex flex-col">
      <div className="border-b flex-shrink-0 h-16 px-8 flex items-center justify-between">
        <div className="flex gap-5 items-center">
          <MenuItem to={routes.home()}>Home</MenuItem>
          <MenuItem to={routes.search()}>Search</MenuItem>

          {canWrite && (
            <>
              <Separator className="h-4" orientation="vertical" />
              <MenuItem to={routes.items()}>Datasets</MenuItem>
              <MenuItem to={routes.collections()}>Collections</MenuItem>
              <MenuItem to={routes.catalogs()}>Catalogs</MenuItem>
              <MenuItem to={routes.keywords()}>Keywords</MenuItem>
            </>
          )}

          {isAdmin && (
            <>
              <Separator className="h-4" orientation="vertical" />
              <MenuItem to={routes.externalCatalogs()}>
                External Catalogs
              </MenuItem>
              <Separator className="h-4" orientation="vertical" />

              <MenuItem to={routes.groups()}>Groups</MenuItem>
            </>
          )}
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
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}

function MenuItem(props: NavLinkProps) {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <NavLink
      className={({ isActive }) =>
        `text-sm font-medium transition-colors hover:text-primary ${
          isActive ? 'text-primary' : 'text-muted-foreground'
        }`
      }
      {...props}
    />
  )
}
