import type { ActionFunctionArgs } from '@remix-run/node'
import { GroupForm, submitGroupForm } from '~/forms/GroupForm'
import { requireAuthentication } from '~/services/auth.server'

export async function action(args: ActionFunctionArgs) {
  await requireAuthentication(args.request)

  return await submitGroupForm(args)
}

export default function CreateGroupPage() {
  return <GroupForm />
}
