import type { Person } from '@prisma/client'
import { Role } from '@prisma/client'
import { Label } from '@radix-ui/react-label'
import type { LoaderArgs, SerializeFrom } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { z } from 'zod'
import { zx } from 'zodix'
import { Combobox } from '~/components/Combobox'
import { PersonSelector } from '~/components/PersonSelector'
import { DataTable } from '~/components/list-table/data-table'
import { DataTableColumnHeader } from '~/components/list-table/data-table-column-header'
import { H3 } from '~/components/typography'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { routes } from '~/routes'
import { requireAuthentication } from '~/services/auth.server'
import { db } from '~/utils/db.server'

export async function loader({ request, params }: LoaderArgs) {
  let user = await requireAuthentication(request)

  let { groupId } = zx.parseParams(params, { groupId: z.string() })

  return db.group.findUniqueOrThrow({
    where: {
      id: groupId,
      members: {
        some: {
          personId: user.id,
          role: Role.ADMIN,
        },
      },
    },
    include: {
      members: {
        include: {
          person: true,
        },
      },
    },
  })
}

let columns: ColumnDef<SerializeFrom<typeof loader>['members'][number]>[] = [
  {
    id: 'name',
    accessorFn(row) {
      return row.person.name
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    id: 'email',
    accessorFn(row) {
      return row.person.email
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    id: 'role',
    accessorFn(row) {
      return row.role
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell({ row }) {
      return <Badge>{row.original.role}</Badge>
    },
  },
]

export default function GroupPage() {
  let group = useLoaderData<typeof loader>()

  return (
    <div className="p-8 flex flex-col">
      <div className="flex justify-between items-center">
        <H3>Editing `{group.name}`</H3>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add people
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add people</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <PersonSelector
                label="Person"
                name="people"
                initialCache={group.members.reduce((acc, current) => {
                  acc[current.personId] = current.person

                  return acc
                }, {} as Record<string, Person>)}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="pt-12">
        <DataTable
          count={group.members.length}
          data={group.members}
          columns={columns}
        />
      </div>
    </div>
  )
}
