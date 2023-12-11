import { z } from 'zod'
import { FormInput } from '~/components/ui/form'

export let config = {
  id: 'numerical',
  title: 'Numerical Models',
}

export let propertiesSchema = z.object({
  reportLocation: z.string().optional(),
  timeScale: z
    .object({
      step: z.coerce.number(),
      unit: z.string(),
    })
    .optional(),
  model: z.string().optional(),
})

export function Form() {
  return (
    <div
      className="grid w-full items-center gap-6"
      data-testid="numerical-model-form"
    >
      <FormInput name="properties[reportLocation]" label="Report Location" />
      <FormInput name="properties[model]" label="Model" />

      <div className="grid grid-cols-2 gap-3">
        <FormInput
          type="number"
          name="properties[timeScale][step]"
          label="Timescale Step"
        />
        <FormInput
          name="properties[timeScale][unit]"
          label="Timescale Unit"
          helper="E.g. Days or Months"
        />
      </div>
    </div>
  )
}
