import { json, type ActionArgs, type LoaderArgs } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import { withZod } from '@remix-validated-form/with-zod'
import { formatDistanceToNow } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'
import { FormSubmit } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { requireAuthentication } from '~/services/auth.server'
import { db } from '~/utils/db.server'
import { createHash } from 'node:crypto'

export async function loader({ request }: LoaderArgs) {
  let user = await requireAuthentication(request)

  let apiKeys = await db.apiKey.findMany({
    where: {
      personId: user.id,
    },
  })

  return { apiKeys }
}

enum ActionTypes {
  CREATE = 'CREATE',
  DELETE = 'DELETE',
}

let idSchema = z.object({
  id: z.string(),
})

let idValidator = withZod(idSchema)

export async function action({ request }: ActionArgs) {
  let formData = await request.formData()
  let subaction = formData.get('subaction')?.toString()

  let user = await requireAuthentication(request)

  if (subaction === ActionTypes.CREATE) {
    let newKey = uuid()
    let hashedKey = createHash('sha256').update(newKey).digest('hex')

    let newKeyObject = await db.apiKey.create({
      data: {
        personId: user.id,
        key: hashedKey,
      },
      select: {
        id: true,
      },
    })

    return {
      ...newKeyObject,
      newKey,
    }
  }

  if (subaction === ActionTypes.DELETE) {
    let form = await idValidator.validate(formData)

    if (form.error) {
      throw validationError(form.error)
    }

    await db.apiKey.delete({
      where: {
        personId: user.id,
        id: form.data.id,
      },
    })

    return json(null, 200)
  }

  return json(null, 400)
}

export default function SettingsPage() {
  let { apiKeys } = useLoaderData<typeof loader>()
  let newKeyObject = useActionData<typeof action>()

  return (
    <div className="mx-auto max-w-2xl w-full px-8 py-12">
      <ValidatedForm
        subaction={ActionTypes.CREATE}
        method="POST"
        validator={withZod(z.any())}
      >
        <FormSubmit>Create new API Key</FormSubmit>
      </ValidatedForm>
      <div className="mt-8 grid grid-flow-row gap-2">
        {newKeyObject && 'newKey' in newKeyObject && (
          <Input value={newKeyObject.newKey} />
        )}

        {apiKeys.map(apiKey => (
          <ValidatedForm
            key={apiKey.id}
            validator={idValidator}
            subaction={ActionTypes.DELETE}
            method="DELETE"
            className="flex items-center gap-3"
          >
            <input type="hidden" name="id" value={apiKey.id} />
            <Input disabled key={apiKey.id} value={apiKey.id} />
            <div className="flex-shrink-0 text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(apiKey.createdAt), {
                addSuffix: true,
              })}
            </div>
            <FormSubmit variant="destructive" size="icon">
              <Trash2 className="w-4 h-4" />
            </FormSubmit>
          </ValidatedForm>
        ))}
      </div>
    </div>
  )
}
