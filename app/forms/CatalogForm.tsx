import type { Prisma } from '@prisma/client'
import type { ActionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { withZod } from '@remix-validated-form/with-zod'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'
import { H3 } from '~/components/typography'
import { Button } from '~/components/ui/button'
import { FormInput, FormTextarea } from '~/components/ui/form'
import { routes } from '~/routes'
import { db } from '~/utils/db.server'

let catalogSchema = z.object({
  title: z.string().nullish(),
  description: z.string(),
}) satisfies z.ZodType<Prisma.CatalogCreateInput>

let catalogValidator = withZod(catalogSchema)

export async function submitCatalogForm({
  request,
  id,
}: ActionArgs & { id?: string }) {
  let form = await catalogValidator.validate(await request.formData())

  if (form.error) {
    return validationError(form.error)
  }

  await db.catalog.upsert({
    where: {
      id: id ?? '',
    },
    create: form.data,
    update: form.data,
  })

  return redirect(routes.catalogs())
}

export function CatalogForm({
  defaultValues,
}: {
  defaultValues?: z.infer<typeof catalogSchema>
}) {
  return (
    <div className="py-12 w-full h-full flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        <H3>Create Catalog</H3>
        <ValidatedForm
          method="post"
          validator={catalogValidator}
          defaultValues={defaultValues}
        >
          <div className="mt-12 grid w-full items-center gap-8">
            <FormInput name="title" label="Title" />
            <FormTextarea name="description" label="Description" />
            <Button>Save</Button>
          </div>
        </ValidatedForm>
      </div>
    </div>
  )
}
