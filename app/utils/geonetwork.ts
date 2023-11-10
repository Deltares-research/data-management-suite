import stacPackageJson from 'stac-spec/package.json'
import { getHost } from '~/routes'
import { z } from 'zod'
import { zx } from 'zodix'
import type { LoaderFunctionArgs } from '@remix-run/node'
import type { StacItem } from './prismaToStac'
import type { Geometry } from 'geojson'

// TODO: Geonetwork types?
export async function geonetworkItem2StacItem({
  item,
  baseUrl,
}: {
  item: any
  baseUrl: string
}): Promise<StacItem> {
  let geometry: Geometry = item.geoBox
    ? {
        type: 'Polygon',
        coordinates: (Array.isArray(item.geoBox) ? item.geoBox : [item.geoBox])
          .slice(0, 1)
          // @ts-expect-error
          .map(box => {
            // @ts-expect-error
            let values = box.split('|').map(v => +v)
            return [
              [values[0], values[1]],
              [values[2], values[1]],
              [values[2], values[3]],
              [values[0], values[3]],
            ]
          }),
      }
    : {
        type: 'Polygon',
        coordinates: [
          [-180, -90],
          [180, -90],
          [180, 90],
          [-180, 90],
        ],
      }

  let geonetworkProperties: Record<string, any> = {}
  for (let key in item) {
    geonetworkProperties[`geonetwork:${key}`] = item[key]
  }

  let datetime = undefined
  let start_datetime = undefined
  let end_datetime = undefined

  if (
    item.tempExtentBegin &&
    item.tempExtentEnd &&
    item.tempExtentBegin !== item.tempExtentEnd
  ) {
    start_datetime = item.tempExtentBegin
    end_datetime = item.tempExtentEnd
  } else {
    datetime = item.tempExtentBegin ?? item.revisionDate?.[0]
  }

  let stacItem: StacItem = {
    type: 'Feature',
    stac_version: stacPackageJson.version,
    id: item.identifier,
    description: item.abstract,
    properties: {
      id: item.identifier,
      title: item.title,
      datetime,
      start_datetime,
      end_datetime,
      collectionTitle: '',
      catalogTitle: '',
      ...geonetworkProperties,
    },
    geometry,
    assets: {},
    links: [
      {
        rel: 'self',
        type: 'application/json',
        href: `${baseUrl}/items/${item['geonet:info'].uuid}`,
      },
    ],
  }

  return stacItem
}

export function getBaseUrl({ params, request }: LoaderFunctionArgs) {
  let { source64 } = zx.parseParams(params, {
    source64: z.string(),
  })

  return `${getHost(request)}/g2s/${source64}/stac`
}
