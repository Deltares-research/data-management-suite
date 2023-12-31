import { Link, useLocation } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import type { ActionFunctionArgs, SerializeFrom } from '@remix-run/node'
import { db } from '~/utils/db.server'
import { updateGeometry } from '~/services/item.server'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { withZod } from '@remix-validated-form/with-zod'
import { FormInput, FormSubmit, FormTextarea } from '~/components/ui/form'
import { CollectionSelector } from '~/components/CollectionSelector'
import { Separator } from '~/components/ui/separator'
import { Role, type Collection, type Prisma } from '@prisma/client'
import { BoundsSelector } from '~/components/BoundsSelector/BoundsSelector'
import { DateRangePicker } from '~/components/DateRangePicker'
import { requestJsonOrFormData } from '~/utils/requestJsonOrFormdata'
import { requireAuthentication } from '~/services/auth.server'
import type { StacItem } from '~/utils/prismaToStac'
import { prismaToStacItem } from '~/utils/prismaToStac'
import { formTypes, createItemFormSchema } from '.'
import { Label } from '~/components/ui/label'
import React from 'react'
import { BookIcon, Plus, X } from 'lucide-react'
import { randUuid } from '@ngneat/falso'
import { H3, Muted } from '~/components/typography'
import { routes } from '~/routes'

export async function submitItemForm({
  request,
  id,
}: ActionFunctionArgs & { id?: string }) {
  let user = await requireAuthentication(request)

  let formDataRaw = await requestJsonOrFormData(request)

  let itemValidator = withZod(
    createItemFormSchema(formDataRaw.getAll('properties[__extraFormTypes]')),
  )

  let form = await itemValidator.validate(formDataRaw)

  if (form.error) {
    throw validationError(form.error)
  }

  let { geometry, collection, ...formData } = form.data

  let selectedCatalog = await db.catalog.findFirst({
    where: {
      collections: {
        some: {
          id: collection,
        },
      },
      permissions: {
        some: {
          role: {
            in: [Role.ADMIN, Role.CONTRIBUTOR],
          },
          group: {
            members: {
              some: {
                personId: user.id,
              },
            },
          },
        },
      },
    },
  })

  if (!selectedCatalog) throw new Response('Forbidden', { status: 403 })

  let { datetime, start_datetime, end_datetime, ...properties } =
    form.data.properties

  let data = {
    ...formData,
    properties: properties as Prisma.JsonObject,
    datetime: datetime || undefined,
    start_datetime: start_datetime || undefined,
    end_datetime: end_datetime || undefined,
    ownerId: user.id,
    collectionId: collection,
  }

  let assets = Object.entries(form.data.assets ?? {}).map(
    ([objectKey, { key, ...asset }]) => ({
      ...asset,
      key: key ?? objectKey,
      roles:
        typeof asset.roles === 'string'
          ? asset.roles?.split(',') ?? []
          : asset.roles ?? [],
    }),
  )

  let item = await db.item.upsert({
    where: {
      id: id ?? '',
    },
    create: {
      ...data,
      assets: {
        create: assets,
      },
    },
    update: {
      ...data,
      assets: {
        deleteMany: {},
        create: assets,
      },
    },
    include: {
      assets: true,
    },
  })

  await updateGeometry({
    id: item.id,
    geometry,
  })

  return prismaToStacItem({
    ...item,
    geometry,
    request,
  })
}

export function ItemForm({
  defaultValues,
  collections,
}: {
  collections: SerializeFrom<
    Collection & { catalog: { title: string | null } }
  >[]
  defaultValues?: StacItem & {}
}) {
  let location = useLocation()

  let [extraFormTypes, setExtraFormTypes] = React.useState<
    (keyof typeof formTypes)[]
  >(
    Object.entries(formTypes)
      .map(([key, formType]) => {
        if (
          Object.keys(formType.propertiesSchema.shape).some(key => {
            return defaultValues?.properties?.[key]
          })
        ) {
          return key
        }

        return null
      })
      .filter(Boolean) as (keyof typeof formTypes)[],
  )

  let [assets, setAssets] = React.useState(defaultValues?.assets ?? {})

  let itemSchema = React.useMemo(
    () => createItemFormSchema(extraFormTypes),
    [extraFormTypes],
  )
  let itemValidator = React.useMemo(() => withZod(itemSchema), [itemSchema])

  // TODO: Make global error view
  // let { fieldErrors } = useFormContext('myform')

  if (collections.length <= 0) {
    return (
      <div className="px-8 max-w-xl w-full h-full mx-auto py-12">
        <div className="w-full h-full items-center flex flex-col justify-center text-center gap-1.5">
          <div className="bg-muted w-12 h-12 flex items-center justify-center rounded-full mb-3">
            <BookIcon />
          </div>
          <H3>No eligible collections</H3>
          <Muted>
            There are no collections in which you can add items. Ask an admin to
            join a group or create your own collection.
          </Muted>
          <Button asChild className="mt-6">
            <Link
              to={routes.createCollection({
                redirectUrl: location.pathname + location.search,
              })}
            >
              <Plus className="w-4 h-4 mr-1.5" /> Create New Collection
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="px-8 max-w-6xl w-full mx-auto py-12">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            {defaultValues ? 'Edit' : 'Register'} metadata record
          </h2>
          <p className="text-muted-foreground">
            Findable metadata records are the foundation of the data catalog.
          </p>
        </div>
        <Separator className="my-6" />
        <div>
          <ValidatedForm
            id="myform"
            method="post"
            validator={itemValidator}
            defaultValues={{
              ...defaultValues,
              assets,
            }}
            className="flex flex-col gap-y-16"
          >
            {extraFormTypes.map(formType => (
              <input
                key={formType}
                type="hidden"
                name="properties.__extraFormTypes"
                value={formType}
              />
            ))}
            <div className="gap-14 grid grid-cols-3">
              <div id="general">
                <h3 className="text-lg font-medium">General</h3>
                <p className="text-sm text-muted-foreground">
                  Basic information about the data
                </p>
              </div>
              <div
                className="col-span-2 flex flex-col gap-6"
                data-testid="general-form"
              >
                <FormInput name="properties[title]" label="Title" />
                <FormTextarea
                  name="properties[description]"
                  label="Description"
                />
                <FormTextarea name="properties[license]" label="License" />
                <FormInput
                  name="properties[projectNumber]"
                  label="Project Number"
                />
                <FormInput name="properties[contact]" label="Contact" />

                <div className="flex flex-col gap-1.5">
                  {collections ? (
                    <CollectionSelector
                      label="Collection"
                      name="collection"
                      collections={collections}
                    />
                  ) : (
                    <Button asChild type="button">
                      <Link to="collection">Create collection</Link>
                    </Button>
                  )}
                </div>

                <div>
                  <Label>Geometry</Label>
                  <div className="pt-1.5">
                    <BoundsSelector name="geometry" />
                  </div>
                </div>

                <div>
                  <DateRangePicker label="Date or date range" />
                </div>
              </div>

              <div id="assets">
                <h3 className="text-lg font-medium">Assets</h3>
                <p className="text-sm text-muted-foreground">
                  Data associated with the item
                </p>
              </div>
              <div className="col-span-2 flex flex-col gap-6">
                {Object.entries(assets).map(([key], index) => (
                  <div
                    key={key}
                    data-testid={`asset-form-${index}`}
                    className="flex flex-col gap-6"
                  >
                    {index > 0 && <Separator className="my-12" />}
                    <div className="flex items-end gap-6">
                      <div className="flex-1">
                        <FormInput label="Key" name={`assets.${key}.key`} />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setAssets(c => {
                            let { [key]: _, ...rest } = c

                            return rest
                          })
                        }
                      >
                        <X className="w-4 h-4 mr-1.5" /> Remove
                      </Button>
                    </div>
                    <FormInput label="Link" name={`assets.${key}.href`} />
                    <FormInput label="Title" name={`assets.${key}.title`} />
                    <FormTextarea
                      label="Description"
                      name={`assets.${key}.description`}
                    />
                    <div className="grid grid-cols-2 gap-6">
                      <FormInput
                        label="Type"
                        name={`assets.${key}.type`}
                        helper="E.g. application/geo+json"
                      />
                      <FormInput
                        label="Roles"
                        name={`assets.${key}.roles`}
                        helper="A comma-separated list of semantic roles"
                      />
                    </div>
                  </div>
                ))}

                <div>
                  <Button
                    type="button"
                    onClick={() => {
                      setAssets(c => ({ ...c, [randUuid()]: {} }))
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1.5" /> Add Asset
                  </Button>
                </div>
              </div>

              {extraFormTypes?.map(type => {
                let formType = formTypes[type]

                return (
                  <>
                    <Separator className="col-span-3" />
                    <div id="properties">
                      <h3 className="text-lg font-medium">
                        {formType.config.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Properties specific to {formType.config.title}
                      </p>
                      <Button
                        className="mt-3"
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          setExtraFormTypes(c => c.filter(v => v !== type))
                        }
                      >
                        <X className="w-4 h-4 mr-1.5" /> Remove{' '}
                        {formType.config.title}
                      </Button>
                    </div>
                    <div className="col-span-2">
                      <formType.Form />
                    </div>
                  </>
                )
              })}

              {extraFormTypes.length < Object.keys(formTypes).length && (
                <>
                  <Separator className="col-span-3" />
                  <div id="properties">
                    <h3 className="text-lg font-medium">More Properties</h3>
                    <p className="text-sm text-muted-foreground">
                      Add more specific properties for your use-case
                    </p>
                  </div>
                  <div className="col-span-2 flex flex-wrap gap-3">
                    {Object.entries(formTypes)
                      .filter(([key]) => !extraFormTypes.includes(key))
                      .map(([key, formType]) => (
                        <Button
                          key={key}
                          onClick={() => setExtraFormTypes(c => [...c, key])}
                        >
                          <Plus className="w-4 h-4 mr-1.5" />{' '}
                          {formType.config.title}
                        </Button>
                      ))}
                  </div>
                </>
              )}
            </div>

            <div>
              <FormSubmit>Save</FormSubmit>
            </div>
          </ValidatedForm>
        </div>
      </div>
    </>
  )
}
