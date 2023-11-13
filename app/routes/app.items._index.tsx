import { Role } from '@prisma/client'
import {
  json,
  type ActionArgs,
  type LoaderArgs,
  type SerializeFrom,
} from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { type ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Plus } from 'lucide-react'
import { z } from 'zod'
import { zx } from 'zodix'
import { ID } from '~/components/ID'
import { DataTable } from '~/components/list-table/data-table'
import { DataTableColumnHeader } from '~/components/list-table/data-table-column-header'
import { H3 } from '~/components/typography'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { routes } from '~/routes'
import { requireAuthentication } from '~/services/auth.server'
import { getCollectionAuthReadWhere } from '~/utils/authQueries'
import { getDataTableFilters } from '~/utils/dataTableFilters'
import { db } from '~/utils/db.server'

export async function loader({ request }: LoaderArgs) {
  let user = await requireAuthentication(request)
  let filters = await getDataTableFilters(request)

  let whereCollection = getCollectionAuthReadWhere(user.id)

  let [count, rawItems] = await db.$transaction([
    db.item.count({
      where: {
        collection: whereCollection,
      },
    }),
    db.item.findMany({
      ...filters,
      where: {
        collection: whereCollection,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        collection: {
          select: {
            title: true,
            catalog: {
              select: {
                title: true,
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
            },
          },
        },
        owner: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    }),
  ])

  let items = rawItems.map(item => ({
    ...item,
    canEdit: item.collection.catalog.permissions.some(permission => {
      return (
        permission.group.members.some(member => member.personId === user.id) &&
        (permission.role === Role.CONTRIBUTOR || permission.role === Role.ADMIN)
      )
    }),
  }))

  return { count, items }
}

export async function action({ request }: ActionArgs) {
  let user = await requireAuthentication(request)
  let { id } = await zx.parseForm(request, { id: z.string() })

  await db.item.delete({
    where: {
      id,
      ownerId: user.id,
    },
  })

  return json({ success: true })
}

let columns: ColumnDef<SerializeFrom<typeof loader>['items'][number]>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell({ getValue }) {
      return <ID>{getValue<string>()}</ID>
    },
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
    accessorFn(value) {
      // @ts-expect-error
      return value.properties?.title
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    id: 'collection',
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Collection" />
    },
    accessorFn(value) {
      return value.collection
    },
    cell({ row }) {
      return (
        <div>
          <div className="text-muted-foreground text-xs">
            {row.original.collection.catalog.title}
          </div>
          <div className="font-medium">{row.original.collection.title}</div>
        </div>
      )
    },
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
              <Link to={routes.editItem(row.original.id)}>Edit</Link>
            </DropdownMenuItem>
            <Form
              method="DELETE"
              onSubmit={e => {
                if (
                  !confirm(
                    `Are you sure you want to delete ${
                      // @ts-expect-error
                      row.original.properties?.title ?? row.original.id
                    }?`,
                  )
                ) {
                  return e.preventDefault()
                }
              }}
            >
              <input type="hidden" name="id" value={row.original.id} />
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full text-left">
                  Delete
                </button>
              </DropdownMenuItem>
            </Form>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null,
  },
]

export default function ListPage() {
  let { items, count } = useLoaderData<typeof loader>()

  return (
    <div className="p-8 flex flex-col">
      <div className="flex justify-between items-center">
        <H3>Items</H3>
        <Button asChild className="ml-auto" size="sm">
          <Link to={routes.createItem()}>
            <Plus className="w-4 h-4 mr-1" /> Create New
          </Link>
        </Button>
      </div>
      <div className="pt-12">
        <DataTable count={count} data={items} columns={columns} />
      </div>
    </div>
  )
}
