import { MemberRole, type Person } from '@prisma/client'
import type { ActionArgs, LoaderArgs, SerializeFrom } from '@remix-run/node'
import {
  Form,
  useLoaderData,
  useNavigation,
  useRouteLoaderData,
} from '@remix-run/react'
import { withZod } from '@remix-validated-form/with-zod'
import type { ColumnDef } from '@tanstack/react-table'
import { Crown, MoreHorizontal, Plus, Trash } from 'lucide-react'
import React from 'react'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'
import { zx } from 'zodix'
import { PersonSelector } from '~/components/PersonSelector'
import { DataTable } from '~/components/list-table/data-table'
import { H3 } from '~/components/typography'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { FormSubmit } from '~/components/ui/form'
import { requireAuthentication } from '~/services/auth.server'
import { db } from '~/utils/db.server'
import type { appLoader } from './app'

let addPeopleSchema = z.object({
  peopleIds: z.string().array(),
})

let personSchema = z.object({
  id: z.string(),
})

let addPeopleValidator = withZod(addPeopleSchema)
let personValidator = withZod(personSchema)

export async function loader({ request, params }: LoaderArgs) {
  let user = await requireAuthentication(request)

  let { groupId } = zx.parseParams(params, { groupId: z.string() })

  return db.group.findUniqueOrThrow({
    where: {
      id: groupId,
      members: {
        some: {
          personId: user.id,
        },
      },
    },
    include: {
      members: {
        include: {
          person: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  })
}

enum Action {
  TOGGLE_ADMIN = 'toggle-admin',
  DELETE_MEMBER = 'delete-member',
  ADD_MEMBERS = 'add-members',
}

async function toggleAdmin({
  request,
  params,
  formData,
}: ActionArgs & { formData: FormData }) {
  let user = await requireAuthentication(request)
  let { groupId } = zx.parseParams(params, { groupId: z.string() })

  let form = await personValidator.validate(formData)

  if (form.error) {
    return validationError(form.error)
  }

  let member = await db.member.findUniqueOrThrow({
    where: {
      personId_groupId: {
        groupId,
        personId: form.data.id,
      },
    },
  })

  return db.member.update({
    where: {
      personId_groupId: {
        groupId,
        personId: form.data.id,
      },
      group: {
        members: {
          some: {
            personId: user.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    },
    data: {
      role:
        member.role === MemberRole.ADMIN ? MemberRole.MEMBER : MemberRole.ADMIN,
    },
  })
}

async function deleteMember({
  request,
  params,
  formData,
}: ActionArgs & { formData: FormData }) {
  let user = await requireAuthentication(request)
  let { groupId } = zx.parseParams(params, { groupId: z.string() })

  let form = await personValidator.validate(formData)

  if (form.error) {
    return validationError(form.error)
  }

  return db.member.delete({
    where: {
      personId_groupId: {
        groupId,
        personId: form.data.id,
      },
      group: {
        members: {
          some: {
            personId: user.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    },
  })
}

async function addMembers({
  request,
  params,
  formData,
}: ActionArgs & { formData: FormData }) {
  let user = await requireAuthentication(request)
  let { groupId } = zx.parseParams(params, { groupId: z.string() })

  let form = await addPeopleValidator.validate(formData)

  if (form.error) {
    return validationError(form.error)
  }

  return db.group.update({
    where: {
      id: groupId,
      members: {
        some: {
          personId: user.id,
        },
      },
    },
    data: {
      members: {
        create: form.data.peopleIds.map(id => ({
          personId: id,
          role: MemberRole.MEMBER,
        })),
      },
    },
  })
}

export async function action(args: ActionArgs) {
  let formData = await args.request.formData()

  switch (formData.get('subaction') as Action) {
    case Action.TOGGLE_ADMIN:
      return toggleAdmin({ ...args, formData })
    case Action.DELETE_MEMBER:
      return deleteMember({ ...args, formData })
    case Action.ADD_MEMBERS:
      return addMembers({ ...args, formData })
    default:
      throw new Error('Invalid action')
  }
}

function createColumns(
  userRole: MemberRole,
): ColumnDef<SerializeFrom<typeof loader>['members'][number]>[] {
  return [
    {
      id: 'name',
      accessorFn(row) {
        return row.person.name
      },
      header: 'Name',
      cell({ row }) {
        return (
          <span className="flex items-center gap-1.5">
            {row.original.role === MemberRole.ADMIN && (
              <Crown className="w-4 h-4" />
            )}
            {row.original.person.name}
          </span>
        )
      },
    },
    {
      id: 'email',
      accessorFn(row) {
        return row.person.email
      },
      header: 'Email',
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: 'Actions',
      cell({ row }) {
        if (userRole === MemberRole.ADMIN) {
          return (
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
                <Form
                  method="POST"
                  onSubmit={e => {
                    if (
                      !confirm(
                        `Make ${row.original.person.name} ${
                          row.original.role === MemberRole.ADMIN
                            ? 'Member'
                            : 'Admin'
                        }?`,
                      )
                    ) {
                      return e.preventDefault()
                    }
                  }}
                >
                  <input
                    type="hidden"
                    name="subaction"
                    value={Action.TOGGLE_ADMIN}
                  />
                  <input
                    type="hidden"
                    name="id"
                    value={row.original.personId}
                  />
                  <DropdownMenuItem asChild>
                    <button type="submit" className="w-full text-left">
                      <Crown className="w-4 h-4 mr-1.5" /> Make{' '}
                      {row.original.role === MemberRole.ADMIN
                        ? 'Member'
                        : 'Admin'}
                    </button>
                  </DropdownMenuItem>
                </Form>

                <Form
                  method="DELETE"
                  onSubmit={e => {
                    if (
                      !confirm(
                        `Are you sure you want to remove ${row.original.person.name} from the group?`,
                      )
                    ) {
                      return e.preventDefault()
                    }
                  }}
                >
                  <input
                    type="hidden"
                    name="subaction"
                    value={Action.DELETE_MEMBER}
                  />
                  <input
                    type="hidden"
                    name="id"
                    value={row.original.personId}
                  />
                  <DropdownMenuItem asChild>
                    <button type="submit" className="w-full text-left">
                      <Trash className="w-4 h-4 mr-1.5" /> Delete
                    </button>
                  </DropdownMenuItem>
                </Form>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
      },
    },
  ]
}

export default function GroupPage() {
  let group = useLoaderData<typeof loader>()
  let user = useRouteLoaderData<typeof appLoader>('routes/app')
  let [open, setOpen] = React.useState(false)
  let navigation = useNavigation()

  React.useEffect(() => {
    if (navigation.state === 'idle') {
      setOpen(false)
    }
  }, [navigation.state])

  let columns = React.useMemo(() => {
    let member = user?.memberOf.find(member => member.groupId === group.id)

    if (!member?.role) return []

    return createColumns(member?.role)
  }, [group.id, user?.memberOf])

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
            <ValidatedForm
              method="post"
              validator={addPeopleValidator}
              subaction={Action.ADD_MEMBERS}
            >
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
