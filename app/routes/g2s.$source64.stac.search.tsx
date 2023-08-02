import type { LoaderArgs } from '@remix-run/node'
import { getStacValidator } from '~/utils/stacspec'
import { geonetworkItem2StacItem } from '~/utils/geonetwork'

let GN_BASE_URL = 'https://deltaresdata.openearth.eu'

// https://deltaresdata.openearth.eu/geonetwork/srv/eng/q?_content_type=json&bucket=s101&facet.q=&fast=index&from=1&resultType=details&sortBy=relevance&sortOrder=&to=20

export async function loader({ request }: LoaderArgs) {
  let validate = await getStacValidator('Item')

  let url = new URL(request.url)
  let baseUrl = `${url.protocol}//${url.host}/oe/stac`

  let rawResult = await fetch(
    `${GN_BASE_URL}/geonetwork/srv/eng/q?_content_type=json&fast=index&from=1&sortOrder=&to=20`,
  )
  let result = await rawResult.json()

  let features = []

  for (let item of result.metadata) {
    let stacItem = await geonetworkItem2StacItem({ item, baseUrl })

    features.push(stacItem)
    validate(stacItem)
  }

  return {
    res: {
      type: 'FeatureCollection',
      features,
      links: [],
    },
    metadata: result.metadata,
  }
}
