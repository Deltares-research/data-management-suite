import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react'

import { H3, Muted } from '~/components/typography'

import { Button } from '~/components/ui/button'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { z } from 'zod'
import type { LoaderArgs } from '@remix-run/node'
import { redirect, type ActionArgs } from '@remix-run/node'
import { zx } from 'zodix'
import { db } from '~/utils/db.server'
import { createItem } from '~/services/item.server'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { withZod } from '@remix-validated-form/with-zod'
import { FormInput, FormSubmit } from '~/components/ui/form'
import React from 'react'
import { zfd } from 'zod-form-data'
import { Combobox, MultiCombobox } from '~/components/Combobox'
import { CollectionSelector } from '~/components/CollectionSelector'
import { authenticator } from '~/services/auth.server'

type AllowedGeometry = GeoJSON.Point | GeoJSON.LineString | GeoJSON.Polygon

let geometrySchema = z.union([
  z.object({
    coordinates: zfd.numeric().array().length(4),
    type: z.literal('Point'),
  }),
  z.object({
    coordinates: zfd.numeric().array().length(2).array(),
    type: z.literal('LineString'),
  }),
  z.object({
    coordinates: zfd.numeric().array().length(2).array().array(),
    type: z.literal('Polygon'),
  }),
]) satisfies z.ZodType<AllowedGeometry>

let metadataSchema = withZod(
  z.object({
    projectNumber: z.string().min(3),
    title: z.string(),
    description: z.string(),
    location: z.string(),
    keywords: z.string().array(),
    collectionId: z.string(),
    // creator: z.string(),
    geometry: geometrySchema,
  }),
)

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request)

  let collections = await db.collection.findMany()

  return { collections }
}

export async function action({ request }: ActionArgs) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/microsoft',
  })
  let form = await metadataSchema.validate(await request.formData())

  if (form.error) {
    return validationError(form.error)
  }

  let { geometry } = form.data

  let record = await createItem({
    ownerId: user.id,
    collectionId: form.data.collectionId,
    geometry,
  })

  // Gross, but easier that raw query for now
  for (let keywordId of form.data.keywords) {
    await db.keyword.update({
      where: {
        id: keywordId,
      },
      data: {
        items: {
          connect: {
            id: record.id,
          },
        },
      },
    })
  }

  return redirect('/app/list')
}

export default function CreatePage() {
  let { collections } = useLoaderData<typeof loader>()
  let [searchParams] = useSearchParams()

  return (
    <>
      <Outlet />
      <div className="py-12 w-full h-full flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full">
          <H3>Create metadata record</H3>
          <Muted>Publish your dataset directly to the metadata service</Muted>
          <ValidatedForm
            method="post"
            validator={metadataSchema}
            defaultValues={{
              collectionId: searchParams.get('collectionId') ?? '',
            }}
            className="mt-12"
          >
            <div className="grid w-full items-center gap-8">
              <FormInput
                name="projectNumber"
                label="Project Number"
                helper="Should be a valid maconomy number"
              />

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input name="title" id="title" />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea name="description" id="description" />
              </div>

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
                {/* <Textarea name="collection" id="collection" /> */}
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  name="location"
                  id="location"
                  placeholder="P://12345678-experiment"
                />
                <Muted>
                  E.g. a path location on the P-drive (starting with P://) or a
                  bucket URL from MinIO.
                </Muted>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="creator">Creator</Label>
                  <Select>
                    <SelectTrigger id="creator">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="sveltekit">SvelteKit</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                      <SelectItem value="nuxt">Nuxt.js</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="facility">Facility</Label>
                  <Select>
                    <SelectTrigger id="facility">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="sveltekit">SvelteKit</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                      <SelectItem value="nuxt">Nuxt.js</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <H3>Geometry</H3>
                <div className="pt-5 grid grid-cols-2 gap-8">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="geometry.type">Type</Label>
                    <Select name="geometry.type">
                      <SelectTrigger id="geometry.type">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="Point">Point</SelectItem>
                        <SelectItem value="LineString">LineString</SelectItem>
                        <SelectItem value="Polygon">Polygon</SelectItem>
                        <SelectItem value="MultiPolygon">
                          MultiPolygon
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-3">
                    <FormInput name="geometry.coordinates[0]" label="NW Lat" />
                    <FormInput name="geometry.coordinates[1]" label="NW Lng" />
                    <FormInput name="geometry.coordinates[2]" label="SE Lat" />
                    <FormInput name="geometry.coordinates[3]" label="SE Lng" />
                  </div>
                </div>
              </div>

              <div>
                <MultiCombobox label="Keywords" name="keywords" />
              </div>

              <div>
                <FormSubmit>Save</FormSubmit>
              </div>
            </div>
          </ValidatedForm>
        </div>
      </div>
    </>
  )
}
