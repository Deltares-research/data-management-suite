import { randUuid } from '@ngneat/falso'
import { Access, Role } from '@prisma/client'
import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { withZod } from '@remix-validated-form/with-zod'
import { Plus, Unlock, X, Lock } from 'lucide-react'
import React from 'react'
import {
  ValidatedForm,
  useFormContext,
  validationError,
} from 'remix-validated-form'
import { z } from 'zod'
import { zx } from 'zodix'
import { GroupSelector } from '~/components/GroupSelector'
import { ErrorMessage, H3, H4, Muted } from '~/components/typography'
import { Button } from '~/components/ui/button'
import {
  FormInput,
  FormRadioGroup,
  FormRadioGroupItem,
  FormSelect,
  FormTextarea,
} from '~/components/ui/form'
import { SelectItem } from '~/components/ui/select'
import { routes } from '~/routes'
import { serverOnly$ } from 'vite-env-only'
import { db } from '~/utils/db.server'

let catalogSchema = z.object({
  title: z.string().nullish(),
  description: z.string(),
  access: z.nativeEnum(Access),
  permissions: z
    .array(
      z.object({
        role: z.nativeEnum(Role, {
          errorMap: () => ({
            message: 'Required',
          }),
        }),
        groupId: z.string().min(1, { message: 'Required' }),
      }),
      {
        required_error: 'Catalog should have at least one permission group.',
      },
    )
    .min(1, { message: 'Catalog should have at least one permission group.' })
    .refine(
      arg => {
        return arg.some(permission => permission.role === Role.ADMIN)
      },
      { message: 'Catalog should have at least one Admin permission group.' },
    ),
})

let catalogValidator = withZod(catalogSchema)

export let submitCatalogForm = serverOnly$(async function submitCatalogForm({
  request,
  id,
}: ActionFunctionArgs & { id?: string }) {
  let { redirectUrl } = zx.parseQuery(request, {
    redirectUrl: z.string().optional(),
  })
  let form = await catalogValidator.validate(await request.formData())

  if (form.error) {
    throw validationError(form.error)
  }

  let { permissions, ...formData } = form.data

  await db.catalog.upsert({
    where: {
      id: id ?? '',
    },
    create: {
      ...formData,
      permissions: {
        create: permissions,
      },
    },
    update: {
      ...formData,
      permissions: {
        deleteMany: {},
        create: permissions,
      },
    },
  })

  return redirect(redirectUrl ?? routes.catalogs())
})

export function CatalogForm({
  defaultValues,
}: {
  defaultValues?: z.infer<typeof catalogSchema>
}) {
  let [permissions, setPermissions] = React.useState([
    ...(defaultValues?.permissions ?? []).map((_, i) => randUuid()),
  ])

  let form = useFormContext('form')

  return (
    <div className="py-12 w-full h-full flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        <H3>{defaultValues ? 'Edit' : 'Create'} Catalog</H3>
        <ValidatedForm
          id="form"
          method="post"
          validator={catalogValidator}
          defaultValues={defaultValues}
        >
          <div className="mt-12 grid w-full items-center gap-8">
            <FormInput name="title" label="Title" />
            <FormTextarea name="description" label="Description" />
            <FormRadioGroup
              name="access"
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
                      This catalog and all it's collections and items will be
                      accesible by anyone on the internet.
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
                      This catalog and all it's collections and items will only
                      be readable or editable by the groups you specify below.
                    </Muted>
                  </div>
                }
                value={Access.PRIVATE}
              />
            </FormRadioGroup>

            <div className="">
              <H4>Permissions</H4>
              <div className="mt-5 flex flex-col gap-3">
                {permissions.map((id, i) => (
                  <div key={id} className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <GroupSelector
                        label="Group"
                        name={`permissions[${i}].groupId`}
                      />
                    </div>
                    <div className="flex gap-3 items-end">
                      <FormSelect
                        name={`permissions[${i}].role`}
                        label="Role"
                        defaultValue={Role.READER}
                      >
                        {Object.keys(Role).map(role => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </FormSelect>
                      <Button
                        color="danger"
                        size="icon"
                        type="button"
                        onClick={() => {
                          setPermissions(c => c.filter(cid => cid !== id))
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => setPermissions(c => [...c, randUuid()])}
                  variant="outline"
                  type="button"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Permission
                </Button>
                {form.fieldErrors.permissions && (
                  <ErrorMessage>{form.fieldErrors.permissions}</ErrorMessage>
                )}
              </div>
            </div>

            <Button>Save</Button>
          </div>
        </ValidatedForm>
      </div>
    </div>
  )
}
