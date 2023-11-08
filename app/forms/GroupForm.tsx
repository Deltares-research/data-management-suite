import { MemberRole, type Prisma } from '@prisma/client'
import type { ActionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { withZod } from '@remix-validated-form/with-zod'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'
import { H3 } from '~/components/typography'
import { Button } from '~/components/ui/button'
import { FormInput } from '~/components/ui/form'
import { routes } from '~/routes'
import { requireAuthentication } from '~/services/auth.server'
import { db } from '~/utils/db.server'

let groupSchema = z.object({
  name: z.string(),
}) satisfies z.ZodType<Prisma.GroupCreateInput>

let groupValidator = withZod(groupSchema)

export async function submitGroupForm({
  request,
  id,
}: ActionArgs & { id?: string }) {
  let user = await requireAuthentication(request)
  let form = await groupValidator.validate(await request.formData())

  if (form.error) {
    return validationError(form.error)
  }

  if (id) {
    let foundGroup = await db.group.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        members: {
          where: {
            personId: user.id,
          },
        },
      },
    })

    if (
      foundGroup.members.some(
        member =>
          member.personId === user.id && member.role === MemberRole.ADMIN,
      )
    ) {
      await db.group.update({
        where: {
          id,
        },
        data: form.data,
      })
    }
  } else {
    await db.group.create({
      data: {
        ...form.data,
        members: {
          create: {
            role: MemberRole.ADMIN,
            personId: user.id,
          },
        },
      },
    })
  }

  return redirect(routes.groups())
}

export function GroupForm({
  defaultValues,
}: {
  defaultValues?: z.infer<typeof groupSchema>
}) {
  return (
    <div className="py-12 w-full h-full flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        <H3>Create Group</H3>
        <ValidatedForm
          method="post"
          validator={groupValidator}
          defaultValues={defaultValues}
        >
          <div className="mt-12 grid w-full items-center gap-8">
            <FormInput name="name" label="Name" />
            <Button>Save</Button>
          </div>
        </ValidatedForm>
      </div>
    </div>
  )
}
