import { withCors } from '~/utils/withCors'
import stacPackageJson from 'stac-spec/package.json'
import { getStacValidator } from '~/utils/stacspec'
import { zx } from 'zodix'
import { z } from 'zod'
import { geonetworkItem2StacItem } from '~/utils/geonetwork'

const RESULTS_PER_PAGE = 20

export let loader = withCors(async ({ request, params }) => {
  let { source64, topic } = zx.parseParams(params, {
    source64: z.string(),
    topic: z.string(),
  })

  let { page = 1 } = zx.parseQuery(request, { page: zx.IntAsString.optional() })

  let sourceUrl = Buffer.from(source64, 'base64').toString()

  let validate = await getStacValidator('Collection')

  let url = new URL(request.url)

  let baseUrl = `${url.protocol}//${url.host}/g2s/${source64}/stac`

  let result = await fetch(
    `${sourceUrl}/geonetwork/srv/eng/q?_content_type=json&fast=index&sortOrder=&facet.q=topicCat%2F${topic}&from=${
      (page - 1) * RESULTS_PER_PAGE + 1
    }&to=${page * RESULTS_PER_PAGE}`,
  ).then(res => res.json())

  let metadata = Array.isArray(result.metadata)
    ? result.metadata
    : [result.metadata]

  let features = await Promise.all(
    metadata.map(async item => geonetworkItem2StacItem({ item, baseUrl })),
  )

  let topLefts = features.map(f => f.geometry.coordinates[0][0])
  let bottomRights = features.map(f => f.geometry.coordinates[0][2])

  let minX = Math.min(...topLefts.map(c => c[0]))
  let minY = Math.min(...topLefts.map(c => c[1]))
  let maxX = Math.max(...bottomRights.map(c => c[0]))
  let maxY = Math.min(...bottomRights.map(c => c[1]))

  let bbox = [[minX, minY, maxX, maxY]]

  let pagination = []
  if (page < 9999) {
    pagination.push({
      rel: 'next',
      type: 'application/geo+json',
      href: `${baseUrl}/collections/${topic}/items?page=${page + 1}`,
    })
  }

  if (page > 1) {
    pagination.push({
      rel: 'prev',
      type: 'application/geo+json',
      href: `${baseUrl}/collections/${topic}/items?page=${page - 1}`,
    })
  }

  let stacCollection = {
    type: 'FeatureCollection',
    stac_version: stacPackageJson.version,
    id: sourceUrl,
    description: '',
    license: 'MIT',
    extent: {
      spatial: {
        bbox,
      },
      temporal: {
        interval: [[new Date().toISOString(), null]],
      },
    },
    features,
    links: [...pagination],
  }

  if (validate(stacCollection)) {
    return stacCollection
  } else {
    return { errors: validate.errors, data: stacCollection }
  }
})
