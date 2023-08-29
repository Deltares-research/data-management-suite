import type { Person } from '@prisma/client'
import { Role } from '@prisma/client'
import { DialogProps } from '@radix-ui/react-dialog'
import type { ActionArgs, LoaderArgs, SerializeFrom } from '@remix-run/node'
import { useLoaderData, useNavigation } from '@remix-run/react'
import { withZod } from '@remix-validated-form/with-zod'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import React, { useTransition } from 'react'
import {
  ValidatedForm,
  useFormContext,
  validationError,
} from 'remix-validated-form'
import { z } from 'zod'
import { zx } from 'zodix'
import { PersonSelector } from '~/components/PersonSelector'
import { DataTable } from '~/components/list-table/data-table'
import { DataTableColumnHeader } from '~/components/list-table/data-table-column-header'
import { H3 } from '~/components/typography'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { FormSubmit } from '~/components/ui/form'
import { requireAuthentication } from '~/services/auth.server'
import { db } from '~/utils/db.server'

let addPeopleSchema = z.object({
  peopleIds: z.string().array(),
})

let addPeopleValidator = withZod(addPeopleSchema)

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

export async function action({ request, id }: ActionArgs & { id?: string }) {
  let form = await addPeopleValidator.validate(await request.formData())

  if (form.error) {
    return validationError(form.error)
  }

  return db.member.createMany({
    data: form.data.peopleIds.map(id => ({
      personId: id,
      role: Role.READER,
      groupId: id,
    })),
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
  let [open, setOpen] = React.useState(false)
  let navigation = useNavigation()

  React.useEffect(() => {
    if (navigation.state === 'idle') {
      setOpen(false)
    }
  }, [navigation.state])

  return (
    <div className="p-8 flex flex-col">
      <div className="flex justify-between items-center">
        <H3>Editing `{group.name}`</H3>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add people
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <ValidatedForm id="form" validator={addPeopleValidator}>
              <DialogHeader>
                <DialogTitle>Add people to `{group.name}`</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <PersonSelector
                  label="Find person"
                  name="peopleIds"
                  initialCache={group.members.reduce((acc, current) => {
                    acc[current.personId] = current.person

                    return acc
                  }, {} as Record<string, Person>)}
                />
              </div>
              <DialogFooter>
                <FormSubmit>Add</FormSubmit>
              </DialogFooter>
            </ValidatedForm>
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
