import pDiskPage from './options/p-disk.mdx'
import nDiskPage from './options/n-disk.mdx'
import surfResearchDrivePage from './options/surf-research-drive.mdx'
import minioPage from './options/minio.mdx'
import surfFileSenderPage from './options/surf-filesender.mdx'
import ftpsPage from './options/ftps.mdx'
import ms365Page from './options/ms365-onedrive.mdx'
import postgresPage from './options/postgres.mdx'
import geoserverPage from './options/geoserver.mdx'
import tdsPage from './options/tds.mdx'
import cloudPage from './options/cloud.mdx'
import zenodoPage from './options/zenodo.mdx'

export let storageCategories = [
  // {
  //   id: 'project-related',
  //   description: 'Is the data project-related?',
  //   dependentOn: [],
  //   type: 'single',
  //   options: [
  //     {
  //       id: 'project-related-yes',
  //       description: 'Yes',
  //     },
  //     {
  //       id: 'project-related-no',
  //       description: 'No',
  //     },
  //   ],
  // },
  {
    id: 'store-transfer-archive',
    description: 'Do you want to store, transfer or archive your data?',
    dependentOn: [],
    type: 'single',
    options: [
      {
        id: 'store',
        description: 'Store',
      },
      {
        id: 'transfer',
        description: 'Transfer',
      },
      {
        id: 'archive',
        description: 'Archive',
      },
    ],
  },
  {
    id: 'sharing',
    description: 'Do you want to share your data with external parties?',
    dependentOn: ['store'],
    type: 'single',
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
    type: 'single',
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
    description: 'Will the total amount of data exceed 5TB?',
    dependentOn: [],
    type: 'single',
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
  // {
  //   id: 'security',
  //   description: 'What are the needs regarding data security?',
  //   dependentOn: [],
  //   type: 'single',
  //   options: [
  //     {
  //       id: 'security-n/a',
  //       description: 'Not applicable (no sensitive data)',
  //     },
  //     {
  //       id: 'security-standard',
  //       description: 'Standard Deltares security measures',
  //     },
  //     {
  //       id: 'security-critical',
  //       description: 'Additional security measures required',
  //     },
  //   ],
  // },
  {
    id: 'confidentiality',
    description:
      'Do you have additional requirements around data confidentiality?',
    dependentOn: [],
    type: 'single',
    options: [
      {
        id: 'confidentiality-yes',
        description: 'Yes',
      },
      {
        id: 'confidentiality-no',
        description: 'No',
      },
    ],
  },
  {
    id: 'access',
    description: 'From where do you want to access your data?',
    dependentOn: [],
    type: 'single',
    options: [
      {
        id: 'access-n/a',
        description: 'Not applicable',
      },
      {
        id: 'access-h7',
        description: 'H7',
      },
      {
        id: 'access-external',
        description: 'External compute facilities',
      },
    ],
  },
  {
    id: 'interface',
    description: 'How do you want to interface with your data?',
    dependentOn: [],
    type: 'multi',
    options: [
      {
        id: 'interface-https',
        description: 'HTTP(s) / API',
      },
      {
        id: 'interface-network-share',
        description: 'Network share',
      },
      {
        id: 'interface-web',
        description: 'Web visualization',
      },
      {
        id: 'interface-jupyter',
        description: 'Jupyter Notebooks',
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
      // 'project-related-yes',
      'store',
      'archive',
      'sharing-internal',
      'collab-no',
      'collab-internal',
      'size-less-than-5tb',
      'security-n/a',
      'security-standard',
      'confidentiality-no',
      'access-n/a',
      'access-h7',
    ],
    maybeFeatures: ['size-more-than-5tb'],
  },
  {
    id: 'n-disk',
    name: 'Storage N:\\',
    description: 'Storage on the Deltares Network Drive',
    component: nDiskPage,
    features: [
      // 'project-related-yes',
      'archive',
      'sharing-internal',
      'security-n/a',
      'security-standard',
      'confidentiality-no',
      'access-n/a',
      'interface-network-share',
    ],
    maybeFeatures: [],
  },
  {
    id: 'ms365-onedrive',
    name: 'MS365 OneDrive',
    description: 'OneDrive for Business',
    component: ms365Page,
    features: [
      'project-related-no',
      'store',
      'sharing-internal',
      'collab-no',
      'collab-internal',
      'size-less-than-5tb',
      'security-n/a',
      'security-standard',
      'confidentiality-no',
      'access-n/a',
    ],
    maybeFeatures: [],
  },
  {
    id: 'surf-research-drive',
    name: 'SURF Research Drive',
    description: 'SURF Research Drive',
    component: surfResearchDrivePage,
    features: [
      'project-related-yes',
      'store',
      'sharing-external',
      'collab-no',
      'collab-external',
      'size-less-than-5tb',
      'security-n/a',
      'security-standard',
      'confidentiality-no',
      'access-h7',
      'access-external',
      'interface-https',
      'interface-jupyter',
    ],
    maybeFeatures: [],
  },
  {
    id: 'minio',
    name: 'MinIO',
    description: 'S3 compatible object storage',
    component: minioPage,
    features: [
      'project-related-yes',
      'store',
      'archive',
      'sharing-internal',
      'sharing-external',
      'collab-no',
      'collab-external',
      'collab-internal',
      'size-less-than-5tb',
      'size-more-than-5tb',
      'security-n/a',
      'security-standard',
      'confidentiality-no',
      'access-n/a',
      'access-h7',
      'access-external',
      'interface-https',
      'interface-web',
      'interface-jupyter',
    ],
    maybeFeatures: [],
  },
  {
    id: 'postgres',
    name: 'Postgres/PostGIS',
    description: 'Postgres/PostGIS database',
    component: postgresPage,
    features: [
      'project-related-no',
      'project-related-yes',
      'store',
      'sharing-internal',
      'collab-no',
      'collab-internal',
      'size-less-than-5tb',
      'size-more-than-5tb',
      'security-n/a',
      'security-standard',
      'confidentiality-no',
      'access-n/a',
      'access-h7',
      'access-external',
      'interface-https',
      'interface-network-share',
      'interface-jupyter',
    ],
    maybeFeatures: ['archive', 'interface-web'],
  },
  {
    id: 'geoserver',
    name: 'Geoserver',
    description: 'Geoserver for serving geospatial data',
    component: geoserverPage,
    features: [
      'project-related-no',
      'project-related-yes',
      'transfer',
      'sharing-internal',
      'sharing-external',
      'collab-no',
      'collab-internal',
      'size-less-than-5tb',
      'size-more-than-5tb',
      'security-n/a',
      'security-standard',
      'confidentiality-no',
      'access-n/a',
      'access-h7',
      'access-external',
      'interface-https',
      'interface-web',
      'interface-jupyter',
      'interface-network-share',
    ],
    maybeFeatures: [],
  },
  {
    id: 'tds',
    name: 'THREDDS Data Server',
    description: 'THREDDS Data Server for serving netCDF data',
    component: tdsPage,
    features: [
      'project-related-no',
      'project-related-yes',
      'transfer',
      'store',
      'sharing-internal',
      'sharing-external',
      'collab-internal',
      'collab-external',
      'size-less-than-5tb',
      'size-more-than-5tb',
      'security-n/a',
      'security-standard',
      'confidentiality-no',
      'access-n/a',
      'access-h7',
      'access-external',
      'interface-https',
      'interface-web',
      'interface-jupyter',
      'interface-network-share',
    ],
    maybeFeatures: [],
  },
  {
    id: 'cloud',
    name: 'Cloud Storage',
    description: 'Cloud Storage',
    component: cloudPage,
    features: [
      'project-related-no',
      'project-related-yes',
      'store',
      'transfer',
      'sharing-external',
      'collab-no',
      'collab-external',
      'collab-internal',
      'size-less-than-5tb',
      'size-more-than-5tb',
      'security-n/a',
      'security-standard',
      'confidentiality-no',
      'access-n/a',
      'access-h7',
      'access-external',
      'interface-https',
      'interface-web',
      'interface-jupyter',
    ],
    maybeFeatures: ['archive'],
  },
  {
    id: 'surf-filesender',
    name: 'SURF Filesender',
    description: 'Send files to external parties',
    component: surfFileSenderPage,
    features: [
      'project-related-no',
      'project-related-yes',
      'transfer',
      'size-less-than-5tb',
      'security-n/a',
      'confidentiality-no',
      'access-n/a',
    ],
    maybeFeatures: ['security-standard'],
  },
  {
    id: 'ftps',
    name: 'FTPS',
    description: 'Secure FTP server',
    component: ftpsPage,
    features: [
      'project-related-yes',
      'project-related-no',
      'transfer',
      'size-less-than-5tb',
      'security-n/a',
      'confidentiality-no',
      'access-n/a',
      'access-h7',
      'access-external',
    ],
    maybeFeatures: [],
  },
  {
    id: 'zenodo',
    name: 'ZENODO',
    description: 'ZENODO',
    component: zenodoPage,
    features: [
      'project-related-no',
      'project-related-yes',
      'archive',
      'size-less-than-5tb',
      'size-more-than-5tb',
      'confidentiality-no',
      'access-n/a',
    ],
    maybeFeatures: [],
  },
]
