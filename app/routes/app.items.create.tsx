import { Link, Outlet, useParams } from '@remix-run/react'

import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'

import { requireAuthentication } from '~/services/auth.server'
import { routes } from '~/routes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'
import { H3, Muted } from '~/components/typography'

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Register metadata' }]
}

export async function loader({ request }: LoaderArgs) {
  await requireAuthentication(request)

  return null
}

export default function CreatePage() {
  let params = useParams()

  return (
    <div className="py-12 w-full flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        <H3>Register metadata record</H3>
        <Muted>Values can be edited later</Muted>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline">
              {params.type ?? 'Select Form Type'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Link to={routes.createItemType('numerical')}>
                Numerical Models
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Outlet />
      </div>
    </div>
  )
}
