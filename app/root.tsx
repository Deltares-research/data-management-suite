import { cssBundleHref } from '@remix-run/css-bundle'
import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
} from '@remix-run/node'
import type { NavLinkProps } from '@remix-run/react'
import {
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'

import mapboxStyles from 'mapbox-gl/dist/mapbox-gl.css'
import mapboxDrawStyles from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import styles from './tailwind.css'
import { Logo } from './components/Logo'
import { routes } from './routes'
import { createAuthenticator } from './services/auth.server'
import { db } from './utils/db.server'
import { Avatar, AvatarFallback } from './components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './components/ui/tooltip'
import { HelpCircle } from 'lucide-react'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: mapboxStyles },
  { rel: 'stylesheet', href: mapboxDrawStyles },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export async function rootLoader({ request }: LoaderFunctionArgs) {
  let authenticator = createAuthenticator(request)
  let user = await authenticator.isAuthenticated(request)

  return db.person.findUnique({
    where: {
      id: user?.id ?? '',
    },
    include: {
      memberOf: true,
    },
  })
}

export let loader = rootLoader

export async function action({ request }: ActionFunctionArgs) {
  let authenticator = createAuthenticator(request)
  await authenticator.logout(request, { redirectTo: routes.login() })
}

export default function App() {
  let user = useLoaderData<typeof loader>()
  let [firstName, lastName] = (user?.name ?? '? ?').split(' ')

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col h-full">
        <div className="h-full flex flex-col">
          <div className="border-b flex-shrink-0 h-12 px-8 flex items-center gap-12">
            <Logo className="h-4" />
            <div className="flex gap-5 items-center py-2">
              <MenuItem to={routes.home()}>Home</MenuItem>
              <MenuItem to={routes.search()}>Search</MenuItem>
              <MenuItem to={routes.items()}>Register</MenuItem>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Link to={routes.readme()}>
                <HelpCircle className="w-4 h-4" />
              </Link>
              {user && (
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="ml-auto">
                        <AvatarFallback>
                          {firstName?.[0]}
                          {lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent align="end">
                      Logged in as {user?.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
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
