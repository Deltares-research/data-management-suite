import { Role } from '@prisma/client'
import type { LoaderArgs, SerializeFrom } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { type ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Plus } from 'lucide-react'
import { ID } from '~/components/ID'
import { DataTable } from '~/components/list-table/data-table'
import { DataTableColumnHeader } from '~/components/list-table/data-table-column-header'
import { H3 } from '~/components/typography'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { routes } from '~/routes'
import { requireAuthentication } from '~/services/auth.server'
import { getDataTableFilters } from '~/utils/dataTableFilters'
import { db } from '~/utils/db.server'

export async function loader({ request }: LoaderArgs) {
  let user = await requireAuthentication(request)
  let filters = await getDataTableFilters(request)

  let [count, rawCatalogs] = await db.$transaction([
    db.catalog.count(),
    db.catalog.findMany({
      ...filters,
      include: {
        _count: {
          select: { collections: true },
        },
        permissions: {
          select: {
            role: true,
            group: {
              select: {
                members: {
                  where: {
                    personId: user.id,
                  },
                },
              },
            },
          },
        },
      },
    }),
  ])

  let catalogs = rawCatalogs.map(catalog => ({
    ...catalog,
    canEdit: catalog.permissions.some(permission => {
      return (
        permission.group.members.some(member => member.personId === user.id) &&
        (permission.role === Role.CONTRIBUTOR || permission.role === Role.ADMIN)
      )
    }),
  }))

  return { count, catalogs }
}

let columns: ColumnDef<SerializeFrom<typeof loader>['catalogs'][number]>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell({ getValue }) {
      return <ID>{getValue<string>()}</ID>
    },
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    id: 'Collection Count',
    accessorFn(value) {
      return value._count.collections
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="# Collections" />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) =>
      row.original.canEdit ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem asChild>
              <Link to={routes.editCatalog(row.original.id)}>Edit</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null,
  },
]

export default function ListPage() {
  let { count, catalogs } = useLoaderData<typeof loader>()

  return (
    <div className="p-8 flex flex-col">
      <div className="flex justify-between items-center">
        <H3>Catalogs</H3>
        <Button asChild className="ml-auto" size="sm">
          <Link to={routes.createCatalog()}>
            <Plus className="w-4 h-4 mr-1" /> Create New
          </Link>
        </Button>
      </div>
      <div className="pt-12">
        <DataTable count={count} data={catalogs} columns={columns} />
      </div>
    </div>
  )
}
