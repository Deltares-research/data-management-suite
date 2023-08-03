import { Link, useSearchParams } from '@remix-run/react'
import { H3, Muted } from '~/components/typography'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { z } from 'zod'
import type { ActionArgs, SerializeFrom } from '@remix-run/node'
import { db } from '~/utils/db.server'
import { upsertItem } from '~/services/item.server'
import {
  ValidatedForm,
  useFormContext,
  validationError,
} from 'remix-validated-form'
import { withZod } from '@remix-validated-form/with-zod'
import {
  FormInput,
  FormSelect,
  FormSubmit,
  FormTextarea,
} from '~/components/ui/form'
import { zfd } from 'zod-form-data'
import { MultiCombobox } from '~/components/Combobox'
import { CollectionSelector } from '~/components/CollectionSelector'
import { authenticator } from '~/services/auth.server'
import { Separator } from '~/components/ui/separator'
import type { Collection } from '@prisma/client'
import type { AllowedGeometry } from '~/types'
import type { ViewStateChangeEvent } from 'react-map-gl'
import { Map } from 'react-map-gl'
import React from 'react'
import { BoundsSelector } from '~/components/BoundsSelector/BoundsSelector'

let geometrySchema = z.object({
  coordinates: zfd.numeric().array().length(2).array().array(),
  type: z.literal('Polygon'),
}) satisfies z.ZodType<AllowedGeometry>

let metadataSchema = z.object({
  projectNumber: z.string().min(3),
  title: z.string(),
  description: z.string().nullable(),
  location: z.string(),
  license: z.string().nullable(),
  keywords: z.string().array().optional(),
  collectionId: z.string(),
  geometry: geometrySchema,
})

let metadataValidator = withZod(metadataSchema)

export async function submitItemForm({ request }: ActionArgs) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/microsoft',
  })

  let form = await metadataValidator.validate(await request.formData())

  if (form.error) {
    throw validationError(form.error)
  }

  let { geometry } = form.data

  let item = await upsertItem({
    ...form.data,
    ownerId: user.id,
    collectionId: form.data.collectionId,
    geometry,
  })

  // Gross, but easier than a raw query for now
  for (let keywordId of form.data.keywords ?? []) {
    await db.keyword.update({
      where: {
        id: keywordId,
      },
      data: {
        items: {
          connect: {
            id: item.id,
          },
        },
      },
    })
  }

  return item
}

export function ItemForm({
  defaultValues,
  collections,
}: {
  collections: SerializeFrom<Collection>[]
  defaultValues?: z.infer<typeof metadataSchema>
}) {
  let [searchParams] = useSearchParams()

  return (
    <div className="py-12 w-full h-full flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        <H3>{defaultValues ? 'Edit' : 'Create'} metadata record</H3>
        <Muted>Publish your dataset directly to the metadata service</Muted>
        <ValidatedForm
          method="post"
          validator={metadataValidator}
          defaultValues={{
            collectionId: searchParams.get('collectionId') ?? undefined,
            ...defaultValues,
          }}
          className="mt-12"
        >
          <div className="grid w-full items-center gap-8">
            <FormInput
              name="projectNumber"
              label="Project Number"
              helper="Should be a valid maconomy number"
            />

            <FormInput name="title" label="Title" />
            <FormTextarea name="description" label="Description" />
            <FormTextarea name="license" label="License" />

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

            <FormInput
              name="location"
              label="Location"
              placeholder="P://12345678-experiment"
              helper="E.g. a path location on the P-drive (starting with P://) or a
                bucket URL from MinIO."
            />

            <Separator />

            <H3>Experimental Facilities</H3>

            <FormSelect name="facility" label="Facility">
              <SelectItem value="next">Next.js</SelectItem>
              <SelectItem value="sveltekit">SvelteKit</SelectItem>
              <SelectItem value="astro">Astro</SelectItem>
              <SelectItem value="nuxt">Nuxt.js</SelectItem>
            </FormSelect>

            <MultiCombobox label="Keywords" name="keywords" />

            <Separator />

            <div>
              <H3>Geometry</H3>
              <div className="pt-5">
                <BoundsSelector name="geometry" />
              </div>
            </div>

            <div>
              <FormSubmit>Save</FormSubmit>
            </div>
          </div>
        </ValidatedForm>
      </div>
    </div>
  )
}
