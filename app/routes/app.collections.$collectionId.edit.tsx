import type { Prisma } from '@prisma/client'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { withZod } from '@remix-validated-form/with-zod'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'
import { zx } from 'zodix'
import { Button } from '~/components/ui/button'
import { FormInput } from '~/components/ui/form'
import { routes } from '~/routes'
import { authenticator } from '~/services/auth.server'
import { db } from '~/utils/db.server'

let collectionSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
}) satisfies z.ZodType<Omit<Prisma.CollectionCreateInput, 'catalog'>>

let collectionValidator = withZod(collectionSchema)

export async function loader({ request, params }: LoaderArgs) {
  // Check has access to edit this collectione
  await authenticator.isAuthenticated(request, {
    failureRedirect: routes.login(),
  })

  let { collectionId } = await zx.parseParams(params, {
    collectionId: z.string(),
  })

  return db.collection.findUniqueOrThrow({
    where: {
      id: collectionId,
    },
  })
}

export async function action({ request, params }: ActionArgs) {
  // TODO: Check editing rights

  let form = await collectionValidator.validate(await request.formData())

  if (form.error) {
    return validationError(form.error)
  }

  let catalog = await db.catalog.findFirstOrThrow()

  let { collectionId } = await zx.parseParams(params, {
    collectionId: z.string(),
  })

  let collection = await db.collection.update({
    where: {
      id: collectionId,
    },
    data: {
      ...form.data,
      catalogId: catalog.id,
    },
  })

  return collection
}

export default function EditCollectionPage() {
  let defaultValues = useLoaderData<typeof loader>()

  return (
    <ValidatedForm
      method="post"
      validator={collectionValidator}
      defaultValues={defaultValues}
    >
      <FormInput name="title" label="Title" />
      <FormInput name="description" label="Description" />
      <Button>Save</Button>
    </ValidatedForm>
  )
}
