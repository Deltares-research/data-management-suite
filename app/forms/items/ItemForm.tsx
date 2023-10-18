import { Link } from '@remix-run/react'
import { H3 } from '~/components/typography'
import { Button } from '~/components/ui/button'
import { z } from 'zod'
import type { ActionArgs, SerializeFrom } from '@remix-run/node'
import { db } from '~/utils/db.server'
import { updateGeometry } from '~/services/item.server'
import {
  ValidatedForm,
  useFormContext,
  validationError,
} from 'remix-validated-form'
import { withZod } from '@remix-validated-form/with-zod'
import { FormSubmit } from '~/components/ui/form'
import { CollectionSelector } from '~/components/CollectionSelector'
import { Separator } from '~/components/ui/separator'
import type { Collection } from '@prisma/client'
import { BoundsSelector } from '~/components/BoundsSelector/BoundsSelector'
import { DateRangePicker } from '~/components/DateRangePicker'
import { requestJsonOrFormData } from '~/utils/requestJsonOrFormdata'
import { requireAuthentication } from '~/services/auth.server'
import { prismaToStacItem } from '~/utils/prismaToStac'
import { zx } from 'zodix'
import { createItemFormSchema, formTypes } from '.'
import {
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from '~/components/ui/accordion'
import { SidebarNav } from '~/components/SidebarNav'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { routes } from '~/routes'

export async function submitItemForm({
  request,
  id,
  params,
}: ActionArgs & { id?: string }) {
  await requireAuthentication(request)

  let { type } = zx.parseParams(params, { type: z.string() })

  let formType = formTypes[type as keyof typeof formTypes]
  let itemValidator = withZod(createItemFormSchema(formType.propertiesSchema))

  let form = await itemValidator.validate(await requestJsonOrFormData(request))

  if (form.error) {
    throw validationError(form.error)
  }

  let { geometry, datetime, start_datetime, end_datetime, ...formData } =
    form.data

  let dates =
    end_datetime && end_datetime !== start_datetime
      ? {
          start_datetime,
          end_datetime,
        }
      : {
          datetime: datetime ?? start_datetime,
        }

  let data = {
    ...formData,
    ...dates,
  }

  let item = await db.item.upsert({
    where: {
      id: id ?? '',
    },
    create: data,
    update: data,
  })

  await updateGeometry({
    id: item.id,
    geometry,
  })

  return prismaToStacItem({
    ...item,
    geometry,
  })
}

export function ItemForm({
  defaultValues,
  collections,
  formType,
}: {
  collections: SerializeFrom<
    Collection & { catalog: { title: string | null } }
  >[]
  defaultValues?: unknown
  formType: keyof typeof formTypes
}) {
  let form = formTypes[formType]
  let itemSchema = createItemFormSchema(form.propertiesSchema)
  let itemValidator = withZod(itemSchema)

  let { fieldErrors } = useFormContext('myform')
  // let [searchParams] = useSearchParams()

  console.log({ fieldErrors })

  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Register metadata record
          </h2>
          {/* <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p> */}
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav
              items={[
                {
                  title: 'General',
                  href: '#general',
                },
                {
                  title: form.config.title,
                  href: '#properties',
                },
              ]}
            />
          </aside>
          <div className="flex-1 lg:max-w-2xl">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline">
                  {formType ?? 'Select Form Type'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link to={routes.createItemType('numerical')}>
                    Numerical Models
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ValidatedForm
              id="myform"
              method="post"
              validator={itemValidator}
              defaultValues={{
                // collectionId: searchParams.get('collectionId') ?? undefined,
                ...(defaultValues as z.infer<typeof itemSchema>),
              }}
              className="flex flex-col gap-y-16"
            >
              <div className="flex flex-col gap-y-8">
                <div id="general">
                  <h3 className="text-lg font-medium">General</h3>
                  <p className="text-sm text-muted-foreground">
                    This is how others will see you on the site.
                  </p>
                </div>
                <Separator />
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
                </div>

                <Separator />

                <div>
                  <H3>Geometry</H3>
                  <div className="pt-5">
                    <BoundsSelector name="geometry" />
                  </div>
                </div>

                <Separator />

                <div>
                  <H3>Temporal</H3>
                  <div className="pt-5">
                    <DateRangePicker label="Date or date range" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-y-8">
                <div id="properties">
                  <h3 className="text-lg font-medium">Properties</h3>
                  <p className="text-sm text-muted-foreground">
                    Properties specific to {form.config.title}
                  </p>
                </div>
                <Separator />
                <form.Form />
              </div>

              <div>
                <FormSubmit>Save</FormSubmit>
              </div>
            </ValidatedForm>
          </div>
        </div>
      </div>
    </>
  )
}
