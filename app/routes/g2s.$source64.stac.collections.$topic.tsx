import { db } from '~/utils/db.server'
import { withCors } from '~/utils/withCors'
import stacPackageJson from 'stac-spec/package.json'
import { getStacValidator } from '~/utils/stacspec'
import { zx } from 'zodix'
import { z } from 'zod'

export let loader = withCors(async ({ request, params }) => {
  let { source64, topic } = zx.parseParams(params, {
    source64: z.string(),
    topic: z.string(),
  })

  let sourceUrl = Buffer.from(source64, 'base64').toString()

  let validate = await getStacValidator('Collection')

  let url = new URL(request.url)

  let baseUrl = `${url.protocol}//${url.host}/g2s/${source64}/stac`

  // https://deltaresdata.openearth.eu/geonetwork/srv/eng/q?_content_type=json&bucket=s101&facet.q=topicCat%2FclimatologyMeteorologyAtmosphere&fast=index&from=1&resultType=details&sortBy=relevance&sortOrder=&to=20

  let result = await fetch(
    `${sourceUrl}/geonetwork/srv/eng/q?_content_type=json&fast=index&from=1&sortOrder=&to=20&facet.q=topicCat%2F${topic}`,
  ).then(res => res.json())

  let metadata = Array.isArray(result.metadata)
    ? result.metadata
    : [result.metadata]

  let stacCollection = {
    type: 'Collection',
    stac_version: stacPackageJson.version,
    id: sourceUrl,
    description: '',
    license: 'MIT',
    extent: {
      spatial: {
        bbox: [[-180, -90, 180, 90]],
      },
      temporal: {
        interval: [[new Date().toISOString(), null]],
      },
    },
    links: [
      ...metadata.map(item => ({
        rel: 'child',
        href: `${baseUrl}/items/${item['geonet:info'].uuid}`,
        type: 'application/geo+json',
      })),
      {
        rel: 'self',
        type: 'application/json',
        // TODO: Fetch collections from GN
        href: `${baseUrl}/collections/all`,
      },
    ],
  }

  if (validate(stacCollection)) {
    return stacCollection
  } else {
    return { errors: validate.errors, data: stacCollection }
  }
})
