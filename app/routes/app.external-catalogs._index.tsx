import type { LoaderFunctionArgs, SerializeFrom } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { type ColumnDef } from '@tanstack/react-table'
import { ExternalLink, MoreHorizontal, Plus } from 'lucide-react'
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

export async function loader({ request }: LoaderFunctionArgs) {
  let filters = await getDataTableFilters(request)

  let [count, catalogs] = await db.$transaction([
    db.externalCatalog.count(),
    db.externalCatalog.findMany({
      ...filters,
    }),
  ])

  return { count, catalogs }
}

let columns: ColumnDef<SerializeFrom<typeof loader>['catalogs'][number]>[] = [
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    id: 'url',
    accessorKey: 'url',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="URL" />
    ),
    cell({ row }) {
      let value = row.original.url
      let url = new URL(value)

      return (
        <a
          href={value}
          target="_blank"
          className="flex items-center gap-1.5"
          rel="noreferrer"
        >
          <ExternalLink className="w-4 h-4" /> {url.hostname}
          {url.pathname}
        </a>
      )
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
            <a
              target="_blank"
              href={`https://radiantearth.github.io/stac-browser/#/${row.original.url}`}
              rel="noreferrer"
            >
              Open in STAC Browser
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default function ListPage() {
  let { count, catalogs } = useLoaderData<typeof loader>()

  return (
    <div className="p-8 flex flex-col">
      <div className="flex justify-between items-center">
        <H3>External Catalogs</H3>
        <Button asChild className="ml-auto" size="sm">
          <Link to={routes.createExternalCatalog()}>
            <Plus className="w-4 h-4 mr-1" /> Add Catalog
          </Link>
        </Button>
      </div>
      <div className="pt-12">
        <DataTable count={count} data={catalogs} columns={columns} />
      </div>
    </div>
  )
}
