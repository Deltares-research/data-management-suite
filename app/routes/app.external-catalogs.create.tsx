import type { Prisma } from '@prisma/client'
import type { ActionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { withZod } from '@remix-validated-form/with-zod'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'
import { H3 } from '~/components/typography'
import { Button } from '~/components/ui/button'
import { FormInput } from '~/components/ui/form'
import { routes } from '~/routes'
import { db } from '~/utils/db.server'

let externalCatalogSchema = z.object({
  title: z.string(),
  url: z.string(),
}) satisfies z.ZodType<Prisma.ExternalCatalogCreateInput>

let externalCatalogValidator = withZod(externalCatalogSchema)

export async function action({ request }: ActionArgs) {
  let form = await externalCatalogValidator.validate(await request.formData())

  if (form.error) {
    return validationError(form.error)
  }

  await db.externalCatalog.create({
    data: form.data,
  })

  return redirect(routes.externalCatalogs())
}

export default function AddExternalCatalogPage() {
  return (
    <div className="py-12 w-full h-full flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        <H3>Add External Catalog</H3>
        <ValidatedForm method="post" validator={externalCatalogValidator}>
          <div className="mt-12 grid w-full items-center gap-8">
            <FormInput name="title" label="Title" />
            <FormInput name="url" label="URL" />
            <Button>Save</Button>
          </div>
        </ValidatedForm>
      </div>
    </div>
  )
}
