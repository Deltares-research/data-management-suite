import type { Asset, Prisma } from '@prisma/client'
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
  datetime,
  start_datetime,
  end_datetime,
  geometry,
  properties,
  collectionId,
  assets,
}: {
  id: string
  geometry: {
    type: 'Polygon'
    coordinates: number[][][]
  }
  properties: Prisma.JsonValue
  datetime?: Date | null
  start_datetime?: Date | null
  end_datetime?: Date | null
  collectionId: string
  assets: Asset[]
}): StacItem {
  return {
    id,
    type: 'Feature',
    collection: collectionId,
    geometry,
    stac_version: stacPackageJson.version,
    properties: {
      ...(properties as Record<string, unknown>),
      datetime: datetime?.toISOString(),
      start_datetime: start_datetime?.toISOString(),
      end_datetime: end_datetime?.toISOString(),
    },
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
    assets: assets?.reduce((acc, asset) => {
      acc[asset.key] = {
        ...asset,
        type: asset.type ?? undefined,
        title: asset.title ?? undefined,
        description: asset.description ?? undefined,
      }
      return acc
    }, {} as Record<string, StacAsset>),
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
