import type { MetaFunction } from '@remix-run/node'
import { Link, Outlet } from '@remix-run/react'
import { AlertTriangle } from 'lucide-react'
import React from 'react'
import { H2 } from '~/components/typography'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import type { Feature } from '~/data/storage-finder'
import { storageCategories, storageOptions } from '~/data/storage-finder'
import { routes } from '~/routes'

export let meta: MetaFunction = () => {
  return [
    {
      title: 'Storage Finder',
    },
  ]
}

export default function StorageFinderPage() {
  let [values, setValues] = React.useState<Record<string, string>>({})

  let flatValues = Object.values(values) as Feature[]

  return (
    <div className="py-12 px-8">
      <Outlet />

      <H2>Storage Finder</H2>
      <div className="pt-12 grid grid-cols-3 gap-12">
        <div>
          <div className="flex flex-col gap-8">
            {storageCategories.map(category => (
              <div key={category.id}>
                <h3 className="text-medium">{category.description}</h3>
                <div className="pt-3">
                  <RadioGroup
                    name={category.id}
                    onValueChange={value =>
                      setValues({ ...values, [category.id]: value })
                    }
                  >
                    {category.options.map(option => (
                      <div key={option.id} className="flex items-center gap-2">
                        <RadioGroupItem id={option.id} value={option.id} />
                        <Label htmlFor={option.id}>{option.description}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <div className="grid grid-cols-3 gap-5">
            {storageOptions.map(storageOption => (
              <Link
                to={routes.storageFinderOption(storageOption.id)}
                key={storageOption.id}
              >
                <Card
                  className={`h-full
                    ${
                      flatValues.every(v =>
                        [
                          ...storageOption.features,
                          ...storageOption.maybeFeatures,
                        ].includes(v),
                      )
                        ? 'opacity-100'
                        : 'opacity-30'
                    }`}
                >
                  <CardHeader>
                    <CardTitle>{storageOption.name}</CardTitle>
                    <CardDescription>
                      {storageOption.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {flatValues.some(v =>
                      storageOption.maybeFeatures.includes(v),
                    ) && (
                      <Badge variant="outline">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Contact IT
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
