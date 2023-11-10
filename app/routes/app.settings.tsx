import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import { withZod } from '@remix-validated-form/with-zod'
import { formatDistanceToNow } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'
import { FormInput, FormSubmit } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { requireAuthentication } from '~/services/auth.server'
import { db } from '~/utils/db.server'
import { encodeToken } from '~/utils/apiKey'
import { H3 } from '~/components/typography'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

export async function loader({ request }: LoaderFunctionArgs) {
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

let newApiKeySchema = z.object({
  name: z.string(),
})

let newApiKeyValidator = withZod(newApiKeySchema)

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData()
  let subaction = formData.get('subaction')?.toString()

  let user = await requireAuthentication(request)

  if (subaction === ActionTypes.CREATE) {
    let form = await newApiKeyValidator.validate(formData)

    if (form.error) {
      throw validationError(form.error)
    }

    let newKey = uuid()
    let hashedKey = encodeToken(newKey)

    let newKeyObject = await db.apiKey.create({
      data: {
        name: form.data.name,
        personId: user.id,
        key: hashedKey,
      },
      select: {
        id: true,
        name: true,
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
      <H3>Settings</H3>

      <ValidatedForm
        subaction={ActionTypes.CREATE}
        method="POST"
        validator={newApiKeyValidator}
        className="mt-12 w-full flex items-end gap-3"
      >
        <div className="flex-1">
          <FormInput name="name" label="Name" />
        </div>
        <FormSubmit>Create new API Key</FormSubmit>
      </ValidatedForm>
      <div className="mt-8 grid grid-flow-row gap-2">
        {newKeyObject && 'newKey' in newKeyObject && (
          <Card className="my-5">
            <CardHeader>
              <CardTitle>{newKeyObject.name}</CardTitle>
              <CardDescription>
                Your new API Key. Copy it somewhere safe as it won't be
                displayed again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input value={newKeyObject.newKey} />
            </CardContent>
          </Card>
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
            <div>{apiKey.name}</div>
            <div className="ml-auto flex-shrink-0 text-sm text-muted-foreground">
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
