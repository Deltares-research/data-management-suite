import { Role } from '@prisma/client'
import type { LoaderArgs, SerializeFrom } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { DataTable } from '~/components/list-table/data-table'
import { DataTableColumnHeader } from '~/components/list-table/data-table-column-header'
import { H3 } from '~/components/typography'
import { Button } from '~/components/ui/button'
import { routes } from '~/routes'
import { requireAuthentication } from '~/services/auth.server'
import { db } from '~/utils/db.server'

export async function loader({ request }: LoaderArgs) {
  let user = await requireAuthentication(request)

  return db.group.findMany({
    where: {
      members: {
        some: {
          personId: user.id,
          role: Role.ADMIN,
        },
      },
    },
    include: {
      _count: {
        select: { members: true },
      },
    },
  })
}

let columns: ColumnDef<SerializeFrom<typeof loader>[number]>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell({ row }) {
      return <Link to={routes.group(row.original.id)}>{row.original.name}</Link>
    },
  },
  {
    id: 'member count',
    accessorFn(value) {
      return value._count.members
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="# Members" />
    ),
  },
]

export default function GroupsPage() {
  let groups = useLoaderData<typeof loader>()

  return (
    <div className="p-8 flex flex-col">
      <div className="flex justify-between items-center">
        <H3>Groups</H3>
        <Button asChild className="ml-auto" size="sm">
          <Link to={routes.createGroup()}>
            <Plus className="w-4 h-4 mr-1" /> Create New
          </Link>
        </Button>
      </div>
      <div className="pt-12">
        <DataTable count={groups.length} data={groups} columns={columns} />
      </div>
    </div>
  )
}
