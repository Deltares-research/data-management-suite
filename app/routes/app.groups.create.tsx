import type { ActionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { GroupForm, submitGroupForm } from '~/forms/GroupForm'
import { routes } from '~/routes'
import { requireAuthentication } from '~/services/auth.server'

export async function action(args: ActionArgs) {
  await requireAuthentication(args.request)

  await submitGroupForm(args)

  return redirect(routes.groups())
}

export default function CreateGroupPage() {
  return <GroupForm />
}
