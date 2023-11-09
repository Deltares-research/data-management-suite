import { cn } from '~/utils'
import { Button } from '~/components/ui/button'
import { Form, NavLink } from '@remix-run/react'
import { routes } from '~/routes'
import {
  Book,
  File,
  FileCode2,
  Library,
  LinkIcon,
  LogOut,
  Settings,
  Users,
} from 'lucide-react'
import { Avatar, AvatarFallback } from './ui/avatar'
import type { rootLoader } from '~/root'

export function Sidebar({
  className,
  user,
}: {
  className?: string
  user?: Awaited<ReturnType<typeof rootLoader>>
}) {
  let [firstName, lastName] = (user?.name ?? '? ?').split(' ')

  return (
    <div className={cn('h-full relative', className)}>
      <div className="py-4 flex flex-col h-full gap-y-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            STAC
          </h2>
          <div className="space-y-1">
            <NavLink to={routes.items()}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <File className="mr-2 w-4 h-4" />
                  Items
                </Button>
              )}
            </NavLink>

            <NavLink to={routes.collections()}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <Book className="mr-2 w-4 h-4" />
                  Collections
                </Button>
              )}
            </NavLink>

            <NavLink to={routes.catalogs()}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <Library className="mr-2 w-4 h-4" />
                  Catalogs
                </Button>
              )}
            </NavLink>

            <NavLink to={routes.externalCatalogs()}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <LinkIcon className="mr-2 w-4 h-4" />
                  External catalogs
                </Button>
              )}
            </NavLink>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Manage
          </h2>
          <div className="space-y-1">
            <NavLink to={routes.groups()}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <Users className="mr-2 w-4 h-4" />
                  Groups
                </Button>
              )}
            </NavLink>
            <NavLink to={routes.docs()}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <FileCode2 className="mr-2 w-4 h-4" />
                  API Documentation
                </Button>
              )}
            </NavLink>
          </div>
        </div>

        <div className="px-3 py-2 mt-auto">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            You
          </h2>
          <div className="space-y-1">
            <NavLink to={routes.settings()}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <Settings className="mr-2 w-4 h-4" />
                  Settings
                </Button>
              )}
            </NavLink>
            <Form method="post" action="/">
              <Button variant="ghost" className="w-full justify-start">
                <LogOut className="mr-2 w-4 h-4" />
                Logout
              </Button>
            </Form>

            <div className="px-3 pt-5 flex items-center gap-x-4 w-full">
              <Avatar>
                <AvatarFallback>
                  {firstName?.[0]}
                  {lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-left min-w-0">
                <div className="text-sm font-medium leading-none whitespace-nowrap text-ellipsis overflow-hidden">
                  {user?.name}
                </div>
                <div className="text-sm text-muted-foreground text-ellipsis overflow-hidden">
                  {user?.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
