import { Access } from '@prisma/client'
import { FormRadioGroup, FormRadioGroupItem } from './ui/form'
import { Unlock, Lock } from 'lucide-react'
import { Muted } from './typography'

export function AccessSelector({ name = 'access' }: { name?: string }) {
  return (
    <FormRadioGroup
      name={name}
      className="grid grid-cols-2 gap-5"
      defaultValue={Access.PRIVATE}
    >
      <FormRadioGroupItem
        label={
          <div>
            <strong className="text-md font-medium flex items-center">
              <Unlock className="w-4 h-4 mr-1.5 flex-shrink-0" /> Public
            </strong>
            <Muted className="mt-1 text-sm font-normal">
              This catalog and all it's collections and items will be accesible
              by anyone on the internet.
            </Muted>
          </div>
        }
        value={Access.PUBLIC}
      />
      <FormRadioGroupItem
        label={
          <div>
            <strong className="text-md font-medium flex items-center">
              <Lock className="w-4 h-4 mr-1.5 flex-shrink-0" /> Private
            </strong>
            <Muted className="mt-1 text-sm font-normal">
              This catalog and all it's collections and items will only be
              readable or editable by the groups you specify below.
            </Muted>
          </div>
        }
        value={Access.PRIVATE}
      />
    </FormRadioGroup>
  )
}
