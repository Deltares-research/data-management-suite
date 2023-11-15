import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData, useLocation } from '@remix-run/react'
import { Plus, Users } from 'lucide-react'
import { H3, Muted } from '~/components/typography'
import { Button } from '~/components/ui/button'
import { CatalogForm, submitCatalogForm } from '~/forms/CatalogForm'
import { routes } from '~/routes'
import { requireAuthentication } from '~/services/auth.server'
import { db } from '~/utils/db.server'

export async function action(args: ActionFunctionArgs) {
  await requireAuthentication(args.request)

  return submitCatalogForm(args)
}

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await requireAuthentication(request)

  return db.group.count({
    where: {
      members: {
        some: {
          personId: user.id,
        },
      },
    },
  })
}

export default function CreateCatalogPage() {
  let groupCount = useLoaderData<typeof loader>()
  let location = useLocation()

  if (groupCount <= 0) {
    return (
      <div className="px-8 max-w-xl w-full h-full mx-auto py-12">
        <div className="w-full h-full items-center flex flex-col justify-center text-center gap-1.5">
          <div className="bg-muted w-12 h-12 flex items-center justify-center rounded-full mb-3">
            <Users />
          </div>
          <H3>No eligible groups</H3>
          <Muted>
            You're not a member of any groups. Ask your group admin to add you
            or create your own group.
          </Muted>
          <Button asChild className="mt-6">
            <Link
              to={routes.createGroup({
                redirectUrl: location.pathname + location.search,
              })}
            >
              <Plus className="w-4 h-4 mr-1.5" /> Create New Group
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return <CatalogForm />
}
