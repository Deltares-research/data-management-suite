import type { Catalog, Prisma } from '@prisma/client'
import type { ActionArgs, SerializeFrom } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { withZod } from '@remix-validated-form/with-zod'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'
import { CatalogSelector } from '~/components/CatalogSelector'
import { H3 } from '~/components/typography'
import { Button } from '~/components/ui/button'
import { FormInput, FormTextarea } from '~/components/ui/form'
import { routes } from '~/routes'
import { db } from '~/utils/db.server'

let collectionSchema = z.object({
  title: z.string(),
  description: z.string().nullish(),
  catalogId: z.string().nonempty({ message: 'Please select a catalog' }),
}) satisfies z.ZodType<Omit<Prisma.CollectionCreateInput, 'catalog'>>

let collectionValidator = withZod(collectionSchema)

export async function submitCollectionForm({
  request,
  id,
}: ActionArgs & { id?: string }) {
  let form = await collectionValidator.validate(await request.formData())

  if (form.error) {
    return validationError(form.error)
  }

  await db.collection.upsert({
    where: {
      id: id ?? '',
    },
    create: form.data,
    update: form.data,
  })

  return redirect(routes.collections())
}

export function CollectionForm({
  catalogs,
  defaultValues,
}: {
  catalogs: SerializeFrom<Catalog>[]
  defaultValues?: z.infer<typeof collectionSchema>
}) {
  return (
    <div className="py-12 w-full h-full flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        <H3>Create Collection</H3>
        <ValidatedForm
          method="post"
          validator={collectionValidator}
          defaultValues={defaultValues}
        >
          <div className="mt-12 grid w-full items-center gap-8">
            <CatalogSelector
              catalogs={catalogs}
              label="Catalog"
              name="catalogId"
            />
            <FormInput name="title" label="Title" />
            <FormTextarea name="description" label="Description" />
            <Button>Save</Button>
          </div>
        </ValidatedForm>
      </div>
    </div>
  )
}
