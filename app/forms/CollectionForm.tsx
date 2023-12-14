import type { Catalog, Prisma } from '@prisma/client'
import type { ActionFunctionArgs, SerializeFrom } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Link, useLocation } from '@remix-run/react'
import { withZod } from '@remix-validated-form/with-zod'
import { Library, Plus } from 'lucide-react'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'
import { zx } from 'zodix'
import { CatalogSelector } from '~/components/CatalogSelector'
import { ID } from '~/components/ID'
import { H3, Muted } from '~/components/typography'
import { Button } from '~/components/ui/button'
import { FormInput, FormTextarea } from '~/components/ui/form'
import { routes } from '~/routes'
import { db } from '~/utils/db.server'

let collectionSchema = z.object({
  title: z.string(),
  description: z.string().nullish(),
  catalogId: z.string().min(1, { message: 'Please select a catalog' }),
}) satisfies z.ZodType<Omit<Prisma.CollectionCreateInput, 'catalog'>>

let collectionValidator = withZod(collectionSchema)

export async function submitCollectionForm({
  request,
  id,
}: ActionFunctionArgs & { id?: string }) {
  let { redirectUrl } = zx.parseQuery(request, {
    redirectUrl: z.string().optional(),
  })

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

  return redirect(redirectUrl ?? routes.collections())
}

export function CollectionForm({
  catalogs,
  defaultValues,
}: {
  catalogs: SerializeFrom<Catalog>[]
  defaultValues?: z.infer<typeof collectionSchema> & { id: string }
}) {
  let location = useLocation()

  if (catalogs.length <= 0) {
    return (
      <div className="px-8 max-w-xl w-full h-full mx-auto py-12">
        <div className="w-full h-full items-center flex flex-col justify-center text-center gap-1.5">
          <div className="bg-muted w-12 h-12 flex items-center justify-center rounded-full mb-3">
            <Library />
          </div>
          <H3>No eligible catalogs</H3>
          <Muted>
            There are no catalogs in which you can create collections. Ask an
            admin to join a group or create your own catalog.
          </Muted>
          <Button asChild className="mt-6">
            <Link
              to={routes.createCatalog({
                redirectUrl: location.pathname + location.search,
              })}
            >
              <Plus className="w-4 h-4 mr-1.5" /> Create New Catalog
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 w-full h-full flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        <H3>{defaultValues ? 'Edit' : 'Create'} Collection</H3>
        {defaultValues && (
          <div className="pt-3">
            <ID>{defaultValues.id}</ID>
          </div>
        )}
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
