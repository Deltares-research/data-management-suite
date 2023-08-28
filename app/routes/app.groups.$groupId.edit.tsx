import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import { GroupForm, submitGroupForm } from '~/forms/GroupForm'
import { routes } from '~/routes'
import { requireAuthentication } from '~/services/auth.server'
import { db } from '~/utils/db.server'

export async function action(args: ActionArgs) {
  await requireAuthentication(args.request)

  let { groupId } = zx.parseParams(args.params, { groupId: z.string() })

  await submitGroupForm({ ...args, id: groupId })

  return redirect(routes.groups())
}

export async function loader({ request, params }: LoaderArgs) {
  await requireAuthentication(request)

  let { groupId } = await zx.parseParams(params, {
    groupId: z.string(),
  })

  return db.group.findUniqueOrThrow({
    where: {
      id: groupId,
    },
  })
}

export default function EditGroupPage() {
  let defaultValues = useLoaderData<typeof loader>()

  return <GroupForm defaultValues={defaultValues} />
}
