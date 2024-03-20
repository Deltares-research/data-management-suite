import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node'
import { Link, Outlet, useLoaderData, useSubmit } from '@remix-run/react'
import { AlertTriangle, Info, Mail, RotateCcw } from 'lucide-react'
import React from 'react'
import { H2 } from '~/components/typography'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import type { Feature } from '~/data/storage-finder'
import { storageCategories, storageOptions } from '~/data/storage-finder'
import StorageFinderIntro from '~/data/storage-finder-intro.mdx'
import { routes } from '~/routes'
import { commitSession, getSession } from '~/services/session.server'

export let meta: MetaFunction = () => {
  return [
    {
      title: 'Storage Finder',
    },
  ]
}

export let handle = { showMenu: false }

export async function loader({ request }: LoaderFunctionArgs) {
  let session = await getSession(request.headers.get('Cookie'))

  return json({ introSeen: session.get('introSeen') })
}

export async function action({ request }: ActionFunctionArgs) {
  let session = await getSession(request.headers.get('Cookie'))

  session.set('introSeen', true)

  return json(
    { status: 'ok' },
    { headers: { 'Set-Cookie': await commitSession(session) } },
  )
}

export default function StorageFinderPage() {
  let { introSeen } = useLoaderData<typeof loader>()
  let [introOpen, setIntroOpen] = React.useState(!introSeen)
  let [values, setValues] = React.useState<Record<string, string>>({})

  let submit = useSubmit()

  function reset() {
    setValues({})
  }

  React.useEffect(() => {
    if (!introOpen && !introSeen) {
      submit(null, { action: '', method: 'post' })
    }
  }, [introOpen, introSeen, submit])

  let flatValues = Object.values(values) as Feature[]

  let noneAvailable = storageOptions.every(storageOption => {
    return !flatValues.every(v =>
      [...storageOption.features, ...storageOption.maybeFeatures].includes(v),
    )
  })

  React.useEffect(() => {
    setValues(current =>
      Object.entries(current).reduce((acc, [key, value]) => {
        let category = storageCategories.find(c => c.id === key)

        if (!category) return acc

        let dependenciesMet =
          category?.dependentOn.every(dep => flatValues.includes(dep)) ?? false

        if (dependenciesMet) return acc

        let { [key]: _, ...rest } = acc

        return rest
      }, current),
    )
  }, [flatValues])

  return (
    <div className="py-12 px-8 h-screen">
      <Outlet />

      <H2 className="flex items-center gap-3">
        Deltares Data Storage Finder
        <Dialog open={introOpen} onOpenChange={setIntroOpen}>
          <DialogTrigger>
            <Info />
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Deltares Data Storage Finder</DialogTitle>
            </DialogHeader>
            <div className="mt-3 prose prose-sm prose-h1:text-lg prose-h2:text-base prose-headings:font-medium">
              <StorageFinderIntro />
            </div>
          </DialogContent>
        </Dialog>
      </H2>

      <div className="pt-12 grid grid-cols-3 gap-4 h-full">
        <div className="max-h-full overflow-auto pr-8 pb-8">
          {Object.values(values).length > 0 && (
            <Button onClick={reset} className="mb-5">
              <RotateCcw className="w-4 h-4 mr-1.5" /> Reset Questions
            </Button>
          )}
          <div className="flex flex-col gap-8">
            {storageCategories.map(category => {
              let disabled = category.dependentOn.some(
                dep => !flatValues.includes(dep),
              )

              return (
                <div key={category.id} className={disabled ? 'opacity-40' : ''}>
                  <h3
                    className={`text-medium ${
                      disabled ? 'text-muted-foreground' : 'text-foreground'
                    }`}
                  >
                    {category.description}
                  </h3>
                  <div className="pt-3">
                    {category.type === 'single' ? (
                      <RadioGroup
                        key={disabled ? 'disabled' : values[category.id]}
                        disabled={disabled}
                        name={category.id}
                        value={values[category.id]}
                        onValueChange={value => {
                          setValues(current => ({
                            ...current,
                            [category.id]: value,
                          }))
                        }}
                      >
                        {category.options.map(option => (
                          <div
                            key={option.id}
                            className="flex items-center gap-2"
                          >
                            <RadioGroupItem id={option.id} value={option.id} />
                            <Label htmlFor={option.id}>
                              {option.description}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {category.options.map(option => (
                          <div
                            key={option.id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              id={option.id}
                              value={option.id}
                              checked={flatValues.includes(option.id)}
                              onCheckedChange={checked => {
                                if (checked) {
                                  setValues(current => ({
                                    ...current,
                                    [option.id]: option.id,
                                  }))
                                } else {
                                  setValues(current => {
                                    let { [option.id]: _, ...rest } = current

                                    return rest
                                  })
                                }
                              }}
                            />
                            <Label htmlFor={option.id}>
                              {option.description}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="col-span-2 relative overflow-auto max-h-full">
          <div className="grid grid-cols-3 gap-5">
            {storageOptions.map(storageOption => {
              let isAvailable = flatValues.every(v =>
                [
                  ...storageOption.features,
                  ...storageOption.maybeFeatures,
                ].includes(v),
              )

              return (
                <Link
                  to={routes.storageFinderOption(storageOption.id)}
                  key={storageOption.id}
                >
                  <Card
                    className={`h-full relative
                    ${isAvailable ? 'opacity-100' : 'opacity-30'}`}
                  >
                    <CardHeader>
                      <CardTitle>
                        {storageOption.name}

                        {isAvailable &&
                          flatValues.some(v =>
                            storageOption.maybeFeatures.includes(v),
                          ) && (
                            <div className="absolute top-0 right-0 mt-1.5 mr-1.5">
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center">
                                      <AlertTriangle className="w-3 h-3" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Contact Data Platform Team.
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )}
                      </CardTitle>
                      <CardDescription>
                        {storageOption.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}

            {noneAvailable && (
              <div className="bg-white/40 inset-0 absolute flex flex-col items-center justify-center">
                <h2 className="text-lg font-medium mb-5">
                  No options available for these filters.
                </h2>
                <Button onClick={() => setIntroOpen(true)}>
                  <Mail className="w-4 h-4 mr-1.5" /> Contact your data steward
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
