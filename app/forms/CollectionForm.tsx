import { randUuid } from '@ngneat/falso'
import { Role } from '@prisma/client'
import type { Permission, Catalog, Group } from '@prisma/client'
import type { ActionFunctionArgs, SerializeFrom } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Link, useLocation } from '@remix-run/react'
import { withZod } from '@remix-validated-form/with-zod'
import { Library, Plus, X } from 'lucide-react'
import React from 'react'
import {
  ValidatedForm,
  useControlField,
  useFormContext,
  validationError,
} from 'remix-validated-form'
import { serverOnly$ } from 'vite-env-only'
import { z } from 'zod'
import { zx } from 'zodix'
import { CatalogSelector } from '~/components/CatalogSelector'
import { GroupSelector } from '~/components/GroupSelector'
import { ID } from '~/components/ID'
import { ErrorMessage, H3, H4, Muted } from '~/components/typography'
import { Button } from '~/components/ui/button'
import { FormInput, FormSelect, FormTextarea } from '~/components/ui/form'
import { SelectItem } from '~/components/ui/select'
import { routes } from '~/routes'
import { db } from '~/utils/db.server'

let collectionSchema = z.object({
  title: z.string(),
  description: z.string().nullish(),
  catalogId: z.string().min(1, { message: 'Please select a catalog' }),
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
    )
    .optional(),
})

let collectionValidator = withZod(collectionSchema)

export let submitCollectionForm = serverOnly$(
  async function submitCollectionForm({
    request,
    id,
  }: ActionFunctionArgs & { id?: string }) {
    let { redirectUrl } = zx.parseQuery(request, {
      redirectUrl: z.string().optional(),
    })
    let form = await collectionValidator.validate(await request.formData())

    if (form.error) {
      return validationError(form.error)
    }

    let { permissions, ...formData } = form.data

    await db.collection.upsert({
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

    return redirect(redirectUrl ?? routes.collections())
  },
)

export function CollectionForm({
  catalogs,
  defaultValues,
}: {
  catalogs: SerializeFrom<
    Catalog & { permissions: (Permission & { group: Group })[] }
  >[]
  defaultValues?: z.infer<typeof collectionSchema> & { id: string }
}) {
  let location = useLocation()

  let form = useFormContext('form')
  let [catalogId, setCatalogId] = useControlField<string>('catalogId', 'form')

  let catalog = catalogs.find(c => c.id === catalogId)

  let [permissions, setPermissions] = React.useState([
    ...(defaultValues?.permissions ?? []).map((_, i) => randUuid()),
  ])

  if (catalogs.length <= 0) {
    return (
      <div className="px-8 max-w-xl w-full h-full mx-auto py-12">
        <div className="w-full h-full items-center flex flex-col justify-center text-center gap-1.5">
          <div className="bg-muted w-12 h-12 flex items-center justify-center rounded-full mb-3">
            <Library />
          </div>
          <H3>No eligible catalogs</H3>
          <Muted>
            There are no catalogs in which you can create collections. Ask an
            admin to join a group or create your own catalog.
          </Muted>
          <Button asChild className="mt-6">
            <Link
              to={routes.createCatalog({
                redirectUrl: location.pathname + location.search,
              })}
            >
              <Plus className="w-4 h-4 mr-1.5" /> Create New Catalog
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 w-full h-full flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        <H3>{defaultValues ? 'Edit' : 'Create'} Collection</H3>
        {defaultValues && (
          <div className="pt-3">
            <ID>{defaultValues.id}</ID>
          </div>
        )}
        <ValidatedForm
          id="form"
          method="post"
          validator={collectionValidator}
          defaultValues={defaultValues}
        >
          <div className="mt-12 grid w-full items-center gap-8">
            <CatalogSelector
              catalogs={catalogs}
              label="Catalog"
              name="catalogId"
              value={catalogId}
              onValueChange={setCatalogId}
            />
            <FormInput name="title" label="Title" />
            <FormTextarea name="description" label="Description" />

            <div className="">
              <H4>Permissions</H4>
              {catalog && (
                <div className="mt-2 rounded border border-border p-5">
                  <h5 className="text-sm font-medium">
                    Inherited Permissions from catalog{' '}
                    <span className="italic">{catalog.title}</span>
                  </h5>
                  <ul className="mt-1 list-inside list-disc">
                    {catalog?.permissions.map(permission => (
                      <li
                        key={permission.id}
                        className="text-sm text-gray-600 list-item"
                      >
                        Role{' '}
                        <span className="italic text-black font-medium">
                          {permission.role}
                        </span>{' '}
                        on group{' '}
                        <span className="italic text-black font-medium">
                          {permission.group.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
