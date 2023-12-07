import { AlertTriangle } from 'lucide-react'
import React from 'react'
import { H1, H2 } from '~/components/typography'
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

let categories = [
  {
    id: 'sharing',
    description: 'Do you want to share your data?',
    options: [
      {
        id: 'sharing-personal',
        description: 'No, personal use',
      },
      {
        id: 'sharing-internal',
        description: 'Yes, internally',
      },
      {
        id: 'sharing-external',
        description: 'Yes, externally',
      },
    ],
  },
  {
    id: 'collaboration',
    description: 'Do you want to collaborate/co-create on your data?',
    options: [
      {
        id: 'collab-no',
        description: 'No',
      },
      {
        id: 'collab-internal',
        description: 'Yes, internally',
      },
      {
        id: 'collab-external',
        description: 'Yes, externally',
      },
    ],
  },
  {
    id: 'store-transfer',
    description: 'Do you want to store or transfer your data?',
    options: [
      {
        id: 'store',
        description: 'Store',
      },
      {
        id: 'transfer',
        description: 'Transfer',
      },
    ],
  },
  {
    id: 'size',
    description: 'Does the total amount of data exceed 10TB?',
    options: [
      {
        id: 'size-less-than-10tb',
        description: 'No, less than 10TB',
      },
      {
        id: 'size-more-than-10tb',
        description: 'Yes, 10TB or more',
      },
    ],
  },
  {
    id: 'personal-or-project',
    description: 'Is the data personal or project data?',
    options: [
      {
        id: 'personal',
        description: 'Personal',
      },
      {
        id: 'project',
        description: 'Project',
      },
    ],
  },
  {
    id: 'confidentiality',
    description:
      'What is the classification of your data regarding CONFIDENTIALITY?',
    options: [
      {
        id: 'confidentiality-basic',
        description: 'Basic',
      },
      {
        id: 'confidentiality-sensitive',
        description: 'Sensitive',
      },
      {
        id: 'confidentiality-critical',
        description: 'Critical',
      },
    ],
  },
  {
    id: 'integrity',
    description: 'What is the classification of your data regarding INTEGRITY?',
    options: [
      {
        id: 'integrity-basic',
        description: 'Basic',
      },
      {
        id: 'integrity-sensitive',
        description: 'Sensitive',
      },
      {
        id: 'integrity-critical',
        description: 'Critical',
      },
    ],
  },
] as const

type Feature = (typeof categories)[number]['options'][number]['id']

interface StorageOption {
  id: string
  name: string
  description: string
  features: Feature[]
  maybeFeatures: Feature[]
}

let storageOptions: StorageOption[] = [
  {
    id: 'p-disk',
    name: 'Basic storage P:\\',
    description: 'Basic storage on the Deltares Network Drive',
    features: [
      'sharing-internal',
      'collab-no',
      'collab-internal',
      'store',
      'size-less-than-10tb',
      'project',
      'confidentiality-basic',
      'confidentiality-sensitive',
      'integrity-basic',
      'integrity-sensitive',
      'integrity-critical',
    ],
    maybeFeatures: ['size-more-than-10tb', 'confidentiality-critical'],
  },
  {
    id: 'ms365-onedrive',
    name: 'MS365 OneDrive',
    description: 'OneDrive for Business',
    features: [
      'sharing-personal',
      'collab-no',
      'store',
      'size-less-than-10tb',
      'personal',
      'confidentiality-basic',
      'confidentiality-sensitive',
      'integrity-basic',
      'integrity-sensitive',
    ],
    maybeFeatures: [
      'size-more-than-10tb',
      'confidentiality-critical',
      'integrity-critical',
    ],
  },
  {
    id: 'surf-research-drive',
    name: 'Surf Research Drive',
    description: 'SURF Research Drive',
    features: [
      'sharing-external',
      'collab-external',
      'store',
      'size-less-than-10tb',
      'project',
      'confidentiality-basic',
      'confidentiality-sensitive',
      'integrity-basic',
      'integrity-sensitive',
    ],
    maybeFeatures: [],
  },
  {
    id: 'minio',
    name: 'MinIO',
    description: 'S3 compatible object storage',
    features: [
      'sharing-internal',
      'collab-no',
      'collab-internal',
      'store',
      'size-less-than-10tb',
      'project',
      'confidentiality-basic',
      'confidentiality-sensitive',
      'integrity-basic',
      'integrity-sensitive',
    ],
    maybeFeatures: [
      'size-more-than-10tb',
      'confidentiality-critical',
      'integrity-critical',
    ],
  },
  {
    id: 'surf-filesender',
    name: 'SURF filesender',
    description: 'Send files to external parties',
    features: [
      'sharing-external',
      'transfer',
      'size-less-than-10tb',
      'project',
      'confidentiality-basic',
      'integrity-basic',
    ],
    maybeFeatures: [
      'sharing-internal',
      'confidentiality-sensitive',
      'confidentiality-critical',
      'integrity-sensitive',
      'integrity-critical',
    ],
  },
  {
    id: 'ftps',
    name: 'FTPS',
    description: 'Secure FTP server',
    features: [
      'sharing-external',
      'transfer',
      'size-less-than-10tb',
      'project',
      'confidentiality-basic',
      'integrity-basic',
    ],
    maybeFeatures: ['sharing-internal'],
  },
]

export default function StorageFinderPage() {
  let [values, setValues] = React.useState<Record<string, string>>({})

  let flatValues = Object.values(values) as Feature[]

  return (
    <div className="py-12 px-8">
      <H2>Storage Finder</H2>
      <div className="pt-12 grid grid-cols-3 gap-12">
        <div>
          <div className="flex flex-col gap-8">
            {categories.map(category => (
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
              <Card
                key={storageOption.id}
                className={
                  flatValues.every(v =>
                    [
                      ...storageOption.features,
                      ...storageOption.maybeFeatures,
                    ].includes(v),
                  )
                    ? 'opacity-100'
                    : 'opacity-30'
                }
              >
                <CardHeader>
                  <CardTitle>{storageOption.name}</CardTitle>
                  <CardDescription>{storageOption.description}</CardDescription>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
