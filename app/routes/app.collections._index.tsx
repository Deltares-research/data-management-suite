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
import { getDataTableFilters } from '~/utils/dataTableFilters'
import { db } from '~/utils/db.server'

export async function loader({ request }: LoaderArgs) {
  let filters = await getDataTableFilters(request)

  let [count, collections] = await db.$transaction([
    db.collection.count(),
    db.collection.findMany({
      ...filters,
      include: {
        _count: {
          select: { items: true },
        },
      },
    }),
  ])

  return { count, collections }
}

let columns: ColumnDef<SerializeFrom<typeof loader>['collections'][number]>[] =
  [
    {
      accessorKey: 'id',
      header: '#',
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
      id: 'itemCount',
      accessorFn(value) {
        return value._count.items
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="# Items" />
      ),
    },
    {
      id: 'updatedAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Updated" />
      ),
      accessorFn(value) {
        return Intl.DateTimeFormat('nl-NL', {
          dateStyle: 'medium',
        }).format(new Date(value.updatedAt))
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
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
              <Link to={routes.editCollection(row.original.id)}>Edit</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

export default function ListPage() {
  let { count, collections } = useLoaderData<typeof loader>()

  return (
    <div className="p-8 flex flex-col">
      <div className="flex justify-between items-center">
        <H3>Collections</H3>
        <Button asChild className="ml-auto" size="sm">
          <Link to={routes.createCollection()}>
            <Plus className="w-4 h-4 mr-1" /> Create New
          </Link>
        </Button>
      </div>
      <div className="pt-12">
        <DataTable count={count} data={collections} columns={columns} />
      </div>
    </div>
  )
}