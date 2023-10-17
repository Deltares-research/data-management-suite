import { Link, useSearchParams } from '@remix-run/react'
import { H3 } from '~/components/typography'
import { Button } from '~/components/ui/button'
import { z } from 'zod'
import type { ActionArgs, SerializeFrom } from '@remix-run/node'
import { db } from '~/utils/db.server'
import { updateGeometry } from '~/services/item.server'
import {
  ValidatedForm,
  useFormContext,
  validationError,
} from 'remix-validated-form'
import { withZod } from '@remix-validated-form/with-zod'
import { FormSubmit } from '~/components/ui/form'
import { zfd } from 'zod-form-data'
import { CollectionSelector } from '~/components/CollectionSelector'
import { Separator } from '~/components/ui/separator'
import type { Collection, Prisma } from '@prisma/client'
import type { AllowedGeometry } from '~/types'
import { BoundsSelector } from '~/components/BoundsSelector/BoundsSelector'
import { DateRangePicker } from '~/components/DateRangePicker'
import { requestJsonOrFormData } from '~/utils/requestJsonOrFormdata'
import { requireAuthentication } from '~/services/auth.server'
import { prismaToStacItem } from '~/utils/prismaToStac'
import * as numerical from './NumericalModelItemForm'
import { zx } from 'zodix'

let formTypes = {
  numerical,
}

let geometrySchema = z.object({
  coordinates: zfd.numeric().array().length(2).array().array(),
  type: z.literal('Polygon'),
}) satisfies z.ZodType<AllowedGeometry>

export function createItemFormSchema<TProperties extends z.ZodTypeAny>(
  properties?: TProperties,
) {
  return z.object({
    collectionId: z.string().min(1, { message: 'Please select a collection' }),
    geometry: geometrySchema,
    properties:
      properties ??
      z
        .record(z.string(), z.any())
        .optional()
        .describe(
          'Properties can be a record of arbitrary JSON objects or primitives for whatever metadata is relevant to your item. E.g. { "timeScale": { "step": 1, "unit": "day" } }',
        ),
    datetime: z.string().nullish(),
    start_datetime: z.string().nullish(),
    end_datetime: z.string().nullish(),
  }) satisfies z.ZodType<Prisma.ItemUncheckedCreateInput>
}

export async function submitItemForm({
  request,
  id,
  params,
}: ActionArgs & { id?: string }) {
  await requireAuthentication(request)

  let { type } = zx.parseParams(params, { type: z.string() })

  let formType = formTypes[type as keyof typeof formTypes]
  let itemValidator = withZod(createItemFormSchema(formType.propertiesSchema))

  let form = await itemValidator.validate(await requestJsonOrFormData(request))

  if (form.error) {
    throw validationError(form.error)
  }

  let { geometry, datetime, start_datetime, end_datetime, ...formData } =
    form.data

  let dates =
    end_datetime && end_datetime !== start_datetime
      ? {
          start_datetime,
          end_datetime,
        }
      : {
          datetime: datetime ?? start_datetime,
        }

  let data = {
    ...formData,
    ...dates,
  }

  let item = await db.item.upsert({
    where: {
      id: id ?? '',
    },
    create: data,
    update: data,
  })

  await updateGeometry({
    id: item.id,
    geometry,
  })

  return prismaToStacItem({
    ...item,
    geometry,
  })
}

export function ItemForm({
  defaultValues,
  collections,
  formType,
}: {
  collections: SerializeFrom<
    Collection & { catalog: { title: string | null } }
  >[]
  defaultValues?: unknown
  formType: keyof typeof formTypes
}) {
  let form = formTypes[formType]
  let itemSchema = createItemFormSchema(form.propertiesSchema)
  let itemValidator = withZod(itemSchema)

  let { fieldErrors } = useFormContext('myform')
  let [searchParams] = useSearchParams()

  console.log({ fieldErrors })

  return (
    <>
      <ValidatedForm
        id="myform"
        method="post"
        validator={itemValidator}
        defaultValues={{
          // collectionId: searchParams.get('collectionId') ?? undefined,
          ...(defaultValues as z.infer<typeof itemSchema>),
        }}
        className="mt-12"
      >
        <div className="grid w-full items-center gap-8">
          <div className="flex flex-col space-y-1.5">
            {collections ? (
              <CollectionSelector
                label="Collection"
                name="collectionId"
                collections={collections}
              />
            ) : (
              <Button asChild type="button">
                <Link to="collection">Create collection</Link>
              </Button>
            )}
          </div>

          <Separator />

          <div>
            <H3>Geometry</H3>
            <div className="pt-5">
              <BoundsSelector name="geometry" />
            </div>
          </div>

          <Separator />

          <div>
            <H3>Temporal</H3>
            <div className="pt-5">
              <DateRangePicker label="Date or date range" />
            </div>
          </div>

          <Separator />

          <form.Form />

          <div>
            <FormSubmit>Save</FormSubmit>
          </div>
        </div>
      </ValidatedForm>
    </>
  )
}
