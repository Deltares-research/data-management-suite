import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { GroupForm, submitGroupForm } from '~/forms/GroupForm'
import { routes } from '~/routes'
import { requireAuthentication } from '~/services/auth.server'

export async function action(args: ActionFunctionArgs) {
  await requireAuthentication(args.request)

  await submitGroupForm(args)

  return redirect(routes.groups())
}

export default function CreateGroupPage() {
  return <GroupForm />
}
