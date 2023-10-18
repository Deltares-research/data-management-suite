import type { Prisma } from '@prisma/client'
import type { Feature } from 'geojson'
import type {
  CommonMetadata,
  StacAsset,
  StacExtensions,
  StacLink,
} from 'stac-ts'
import stacPackageJson from 'stac-spec/package.json'

export function prismaToStacItem({
  id,
  geometry,
  properties,
  collectionId,
}: {
  id: string
  geometry: {
    type: 'Polygon'
    coordinates: number[][][]
  }
  properties: Prisma.JsonValue
  collectionId: string
}): StacItem {
  return {
    id,
    type: 'Feature',
    geometry,
    stac_version: stacPackageJson.version,
    properties: properties as Record<string, unknown>,
    // TODO: Make links absolute?
    links: [
      {
        rel: 'self',
        type: 'application/json',
        href: `/items/${id}`,
      },
      {
        rel: 'collection',
        type: 'application/json',
        href: `/collections/${collectionId}`,
      },
    ],
    // TODO: Add assets
    assets: {},
  }
}

// stac-ts override because it doesn't play nicely with the `geojson` package
export type StacItem = Feature & {
  stac_version: string
  stac_extensions?: StacExtensions
  id: string
  links: StacLink[]
  assets: { [k: string]: StacAsset }
  properties: CommonMetadata &
    (
      | {
          datetime: {
            [k: string]: unknown
          }
          [k: string]: unknown
        }
      | {
          [k: string]: unknown
        }
    )
  [k: string]: unknown
}
