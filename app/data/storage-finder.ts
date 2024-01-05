import pDiskPage from './options/p-disk.mdx'
import surfResearchDrivePage from './options/surf-research-drive.mdx'
import minioPage from './options/minio.mdx'
import surfFileSenderPage from './options/surf-filesender.mdx'
import ftpsPage from './options/ftps.mdx'
import ms365Page from './options/ms365-onedrive.mdx'

export let storageCategories = [
  {
    id: 'project-related',
    description: 'Is the data project-related?',
    dependentOn: [],
    options: [
      {
        id: 'project-related-yes',
        description: 'Yes',
      },
      {
        id: 'project-related-no',
        description: 'No',
      },
    ],
  },
  {
    id: 'store-transfer',
    description: 'Do you want to store or transfer your data?',
    dependentOn: [],
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
    id: 'sharing',
    description: 'Do you want to share your data with external parties?',
    dependentOn: ['store'],
    options: [
      {
        id: 'sharing-external',
        description: 'Yes',
      },
      {
        id: 'sharing-internal',
        description: 'No, internal use',
      },
    ],
  },
  {
    id: 'collaboration',
    description: 'Do you want to collaborate/co-create on your data?',
    dependentOn: ['store'],
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
    id: 'size',
    description: 'Will the total amount of data exceed 5TB??',
    dependentOn: [],
    options: [
      {
        id: 'size-less-than-5tb',
        description: 'No, less than 5TB',
      },
      {
        id: 'size-more-than-5tb',
        description: 'Yes, 5TB or more',
      },
    ],
  },
  {
    id: 'security',
    description: 'What are the needs regarding data security?',
    dependentOn: [],
    options: [
      {
        id: 'security-n/a',
        description: 'Not applicable (no sensitive data)',
      },
      {
        id: 'security-standard',
        description: 'Standard Deltares security measures',
      },
      {
        id: 'security-critical',
        description: 'Additional security measures required',
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
      'project-related-yes',
      // 'project-related-no',
      'store',
      // 'transfer',
      // 'sharing-external',
      'sharing-internal',
      'collab-no',
      'collab-internal',
      // 'collab-external',
      'size-less-than-5tb',
      // 'size-more-than-5tb',
      'security-n/a',
      'security-standard',
      // 'security-critical',
    ],
    maybeFeatures: ['size-more-than-5tb'],
  },
  {
    id: 'ms365-onedrive',
    name: 'MS365 OneDrive',
    component: ms365Page,
    description: 'OneDrive for Business',
    features: [
      // 'project-related-yes',
      'project-related-no',
      'store',
      // 'transfer',
      // 'sharing-external',
      'sharing-internal',
      'collab-no',
      'collab-internal',
      // 'collab-external',
      'size-less-than-5tb',
      // 'size-more-than-5tb',
      'security-n/a',
      'security-standard',
      // 'security-critical',
    ],
    maybeFeatures: [],
  },
  {
    id: 'surf-research-drive',
    name: 'Surf Research Drive',
    component: surfResearchDrivePage,
    description: 'SURF Research Drive',
    features: [
      'project-related-yes',
      // 'project-related-no',
      'store',
      // 'transfer',
      'sharing-external',
      // 'sharing-internal',
      'collab-no',
      // 'collab-internal',
      'collab-external',
      'size-less-than-5tb',
      // 'size-more-than-5tb',
      'security-n/a',
      'security-standard',
      // 'security-critical',
    ],
    maybeFeatures: [],
  },
  {
    id: 'minio',
    name: 'MinIO',
    component: minioPage,
    description: 'S3 compatible object storage',
    features: [
      'project-related-yes',
      // 'project-related-no',
      'store',
      // 'transfer',
      // 'sharing-external',
      'sharing-internal',
      'collab-no',
      'collab-internal',
      // 'collab-external',
      'size-less-than-5tb',
      // 'size-more-than-5tb',
      'security-n/a',
      'security-standard',
      // 'security-critical',
    ],
    maybeFeatures: ['collab-external', 'size-more-than-5tb'],
  },
  {
    id: 'surf-filesender',
    name: 'SURF filesender',
    component: surfFileSenderPage,
    description: 'Send files to external parties',
    features: [
      'project-related-yes',
      'project-related-no',
      // 'store',
      'transfer',
      // 'sharing-external',
      // 'sharing-internal',
      // 'collab-no',
      // 'collab-internal',
      // 'collab-external',
      'size-less-than-5tb',
      // 'size-more-than-5tb',
      'security-n/a',
      // 'security-standard',
      // 'security-critical',
    ],
    maybeFeatures: ['security-standard'],
  },
  {
    id: 'ftps',
    name: 'FTPS',
    component: ftpsPage,
    description: 'Secure FTP server',
    features: [
      'project-related-yes',
      'project-related-no',
      // 'store',
      'transfer',
      // 'sharing-external',
      // 'sharing-internal',
      // 'collab-no',
      // 'collab-internal',
      // 'collab-external',
      'size-less-than-5tb',
      // 'size-more-than-5tb',
      'security-n/a',
      // 'security-standard',
      // 'security-critical',
    ],
    maybeFeatures: [],
  },
]
