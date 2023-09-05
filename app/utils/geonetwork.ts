import stacPackageJson from 'stac-spec/package.json'
import { getStacValidator } from './stacspec'
import { getHost } from '~/routes'
import { z } from 'zod'
import { zx } from 'zodix'
import type { LoaderArgs } from '@remix-run/node'

// TODO: Geonetwork types?
export async function geonetworkItem2StacItem({ item, baseUrl }) {
  let validate = await getStacValidator('Item')

  let geometry = item.geoBox
    ? {
        type: 'Polygon',
        coordinates: (Array.isArray(item.geoBox) ? item.geoBox : [item.geoBox])
          .slice(0, 1)
          .map(box => {
            let values = box.split('|').map(v => +v)
            return [
              [values[0], values[1]],
              [values[2], values[1]],
              [values[2], values[3]],
              [values[0], values[3]],
            ]
          }),
      }
    : undefined

  let geonetworkProperties: Record<string, any> = {}
  for (let key in item) {
    geonetworkProperties[`geonetwork:${key}`] = item[key]
  }

  let stacItem = {
    type: 'Feature',
    stac_version: stacPackageJson.version,
    id: item.identifier,
    description: item.abstract,
    properties: {
      title: item.title,
      datetime: undefined,
      start_datetime: undefined,
      end_datetime: undefined,
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

  if (
    item.tempExtentBegin &&
    item.tempExtentEnd &&
    item.tempExtentBegin !== item.tempExtentEnd
  ) {
    stacItem.properties.start_datetime = item.tempExtentBegin
    stacItem.properties.end_datetime = item.tempExtentEnd
  } else {
    stacItem.properties.datetime =
      item.tempExtentBegin ?? item.revisionDate?.[0]
  }

  validate(stacItem)

  return stacItem
}

export function getBaseUrl({ params, request }: LoaderArgs) {
  let { source64 } = zx.parseParams(params, {
    source64: z.string(),
  })

  return `${getHost(request)}/g2s/${source64}/stac`
}
