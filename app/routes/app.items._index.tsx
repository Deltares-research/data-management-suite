import type { LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTable } from '~/components/list-table/data-table'
import { DataTableColumnHeader } from '~/components/list-table/data-table-column-header'
import { DataTableRowActions } from '~/components/list-table/data-table-row-actions'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { db } from '~/utils/db.server'

export async function loader({ request }: LoaderArgs) {
  let url = new URL(request.url)
  let page = +(url.searchParams.get('page') ?? 0)

  return db.item.findMany({
    take: 20,
    skip: 20 * page,
    include: {
      owner: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  })
}

let columns: ColumnDef<Awaited<ReturnType<typeof loader>>[number]>[] = [
  {
    accessorKey: 'id',
    header: '#',
  },
  {
    id: 'owner',
    accessorFn(value) {
      return value.owner?.name
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="?" />
            <AvatarFallback>{row.original.owner?.name?.[0]}</AvatarFallback>
          </Avatar>
          <span>{row.original.owner?.name}</span>
        </div>
      )
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
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]

export default function ListPage() {
  let data = useLoaderData<typeof loader>()

  return (
    <div className="p-8">
      <DataTable data={data} columns={columns} />
    </div>
  )
}
