import type { AllowedGeometry } from '~/types'
import * as numerical from './NumericalModelItemForm'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

interface FormType {
  config: {
    id: string
    title: string
  }
  propertiesSchema: z.AnyZodObject
  Form: React.ComponentType
}

export let formTypes: Record<string, FormType> = {
  numerical,
}

let geometrySchema = z.object({
  coordinates: zfd.numeric().array().length(2).array().array(),
  type: z.literal('Polygon'),
}) satisfies z.ZodType<AllowedGeometry>

let generalItemPropertiesSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().optional(),
    license: z.string().optional(),
    projectNumber: z.string().optional(),
    contact: z.string().optional(),
    datetime: z.string().nullish(),
    start_datetime: z.string().nullish(),
    end_datetime: z.string().nullish(),
  })
  .passthrough()
  .describe(
    'Properties can be a record of arbitrary JSON objects or primitives for whatever metadata is relevant to your item. E.g. { "timeScale": { "step": 1, "unit": "day" } }',
  )

export function createItemFormSchema(extraFormTypes: string[] = []) {
  let properties = extraFormTypes?.reduce((acc, type) => {
    return (acc ?? z.object({})).merge(formTypes[type].propertiesSchema)
  }, generalItemPropertiesSchema)

  return z.object({
    collection: z.string().min(1, { message: 'Please select a collection' }),
    geometry: geometrySchema,
    assets: z
      .record(
        z.string(),
        z.object({
          key: z.string().nullish(),
          href: z.string().min(1, { message: 'Required' }),
          title: z.string().nullish(),
          description: z.string().nullish(),
          type: z.string().nullish(),
          roles: z.union([z.string(), z.array(z.string()).nullish()]),
        }),
      )
      .optional(),
    properties,
  })
}
