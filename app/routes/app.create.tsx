import { Form } from '@remix-run/react'

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
import type { ActionArgs } from '@remix-run/node'
import { zx } from 'zodix'
import { db } from '~/utils/db.server'
import { createItem } from '~/services/item.server'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { withZod } from '@remix-validated-form/with-zod'
import { FormInput, FormSubmit } from '~/components/ui/form'
import React from 'react'
import { zfd } from 'zod-form-data'
import { Combobox, MultiCombobox } from '~/components/Combobox'

let metadataSchema = withZod(
  z.object({
    projectNumber: z.string().min(3),
    title: z.string(),
    description: z.string(),
    location: z.string(),
    // creator: z.string(),
    geometry: z.object({
      coordinates: zfd.numeric().array().length(4),
      type: z.union([
        z.literal('Point'),
        z.literal('LineString'),
        z.literal('Polygon'),
        z.literal('MultiPolygon'),
      ]),
    }),
  }),
)

export async function action({ request }: ActionArgs) {
  let form = await metadataSchema.validate(await request.formData())

  if (form.error) {
    return validationError(form.error)
  }

  let { geometry } = form.data
  console.log(geometry)

  let person = await db.person.findUniqueOrThrow({
    where: {
      email: 'robert.broersma@deltares.nl',
    },
  })

  let record = await createItem({
    ownerId: person.id,
    geometry,
  })

  return record
}

export default function CreatePage() {
  return (
    <div className="py-12 w-full h-full flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        <H3>Create metadata record</H3>
        <Muted>Publish your dataset directly to the metadata service</Muted>
        <ValidatedForm
          method="post"
          validator={metadataSchema}
          className="mt-12"
        >
          <div className="grid w-full items-center gap-8">
            <MultiCombobox />
            <Combobox />

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
                      <SelectItem value="MultiPolygon">MultiPolygon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-3">
                  <FormInput name="geometry.coordinates[0]" label="NW Lat" />
                  <FormInput name="geometry.coordinates[1]" label="NW Lng" />
                  <FormInput name="geometry.coordinates[2]" label="SE Lng" />
                  <FormInput name="geometry.coordinates[3]" label="SE Lng" />
                </div>
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
