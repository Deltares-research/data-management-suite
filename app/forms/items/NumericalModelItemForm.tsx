import { z } from 'zod'
import { FormInput, FormTextarea } from '~/components/ui/form'

export let config = {
  id: 'numerical',
  title: 'Numerical Models',
}

export let propertiesSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  license: z.string().optional(),
  projectNumber: z.string().optional(),
  location: z.string().optional(),
  contact: z.string().optional(),
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
    <div className="grid w-full items-center gap-6">
      <FormInput name="properties[title]" label="Title" />
      <FormTextarea name="properties[description]" label="Description" />
      <FormTextarea name="properties[license]" label="License" />
      <FormInput name="properties[projectNumber]" label="Project Number" />
      <FormInput
        name="properties[location]"
        label="Location"
        placeholder="P://12345678-experiment"
        helper="E.g. a path location on the P-drive (starting with P://) or a
                bucket URL from MinIO."
      />
      <FormInput name="properties[contact]" label="Contact" />
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
