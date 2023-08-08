import stacPackageJson from 'stac-spec/package.json'
import { getStacValidator } from './stacspec'

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

  let stacItem = {
    type: 'Feature',
    stac_version: stacPackageJson.version,
    id: item.identifier,
    description: item.abstract,
    properties: {
      title: item.title,
      datetime: item.revisionDate?.[0] ?? item.tempExtentBegin,
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

  validate(stacItem)

  return stacItem
}
