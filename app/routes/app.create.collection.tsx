import type { Prisma } from '@prisma/client'
import type { ActionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { withZod } from '@remix-validated-form/with-zod'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { FormInput } from '~/components/ui/form'
import { Sheet, SheetContent } from '~/components/ui/sheet'
import { db } from '~/utils/db.server'

let collectionSchema = z.object({
  title: z.string(),
  description: z.string(),
}) satisfies z.ZodType<Omit<Prisma.CollectionCreateInput, 'catalog'>>

let collectionValidator = withZod(collectionSchema)

export async function action({ request }: ActionArgs) {
  let form = await collectionValidator.validate(await request.formData())

  if (form.error) {
    return validationError(form.error)
  }

  let catalog = await db.catalog.findFirstOrThrow()

  let collection = await db.collection.create({
    data: {
      ...form.data,
      catalogId: catalog.id,
    },
  })

  return redirect(`../?collectionId=${collection.id}`)
}

export default function CreateCollectionPage() {
  return (
    <Sheet open>
      <SheetContent>
        <ValidatedForm method="post" validator={collectionValidator}>
          <FormInput name="title" label="Title" />
          <FormInput name="description" label="Description" />
          <Button>Save</Button>
        </ValidatedForm>
      </SheetContent>
    </Sheet>
  )
}
