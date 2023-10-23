import type { AllowedGeometry } from '~/types'
import * as numerical from './NumericalModelItemForm'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import type { Prisma } from '@prisma/client'

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

export function createItemFormSchema(extraFormTypes: string[] = []) {
  let properties = extraFormTypes?.reduce((acc, type) => {
    return (acc ?? z.object({})).merge(formTypes[type].propertiesSchema)
  }, null as z.AnyZodObject | null)

  return z.object({
    collectionId: z.string().min(1, { message: 'Please select a collection' }),
    geometry: geometrySchema,
    properties:
      properties ??
      z
        .object({
          datetime: z.string().nullish(),
          start_datetime: z.string().nullish(),
          end_datetime: z.string().nullish(),
        })
        .passthrough()
        .describe(
          'Properties can be a record of arbitrary JSON objects or primitives for whatever metadata is relevant to your item. E.g. { "timeScale": { "step": 1, "unit": "day" } }',
        ),
  }) satisfies z.ZodType<
    Omit<
      Prisma.ItemUncheckedCreateInput,
      'datetime' | 'start_datetime' | 'end_datetime' | 'properties'
    >
  >
}
