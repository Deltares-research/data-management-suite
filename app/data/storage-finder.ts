import pDiskPage from './options/p-disk.mdx'

export let storageCategories = [
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

export type Feature =
  (typeof storageCategories)[number]['options'][number]['id']

interface StorageOption {
  id: string
  name: string
  component: React.ComponentType
  description: string
  features: Feature[]
  maybeFeatures: Feature[]
}

export let storageOptions: StorageOption[] = [
  {
    id: 'p-disk',
    name: 'Basic storage P:\\',
    description: 'Basic storage on the Deltares Network Drive',
    component: pDiskPage,
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
    component: pDiskPage,
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
    component: pDiskPage,
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
    component: pDiskPage,
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
    component: pDiskPage,
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
    component: pDiskPage,
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
