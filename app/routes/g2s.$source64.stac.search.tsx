import { getStacValidator } from '~/utils/stacspec'
import { geonetworkItem2StacItem } from '~/utils/geonetwork'
import { cachedFetch } from '~/utils/cachedFetch'
import { withCors } from '~/utils/withCors'
import { getHost } from '~/routes'

let GN_BASE_URL = 'https://deltaresdata.openearth.eu'

// https://deltaresdata.openearth.eu/geonetwork/srv/eng/q?_content_type=json&bucket=s101&facet.q=&fast=index&from=1&resultType=details&sortBy=relevance&sortOrder=&to=20

export let loader = withCors(async ({ request }) => {
  let validate = await getStacValidator('Item')

  let url = new URL(request.url)
  let baseUrl = `${getHost(request)}/oe/stac`
  let collectionsString = url.searchParams.get('collections')
  let collections = collectionsString?.split(',') ?? []

  let gnUrl = `${GN_BASE_URL}/geonetwork/srv/eng/q?_content_type=json&fast=index&from=1&sortOrder=&to=20`
  for (let collection of collections) {
    gnUrl += `&facet.q=topicCat/${collection}`
  }

  let result = await cachedFetch(gnUrl)

  let features = []

  for (let item of result.metadata) {
    let stacItem = await geonetworkItem2StacItem({ item, baseUrl })

    features.push(stacItem)
    validate(stacItem)
  }

  return {
    type: 'FeatureCollection',
    features,
    links: [],
  }
})
