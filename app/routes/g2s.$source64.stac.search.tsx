import { getStacValidator } from '~/utils/stacspec'
import { geonetworkItem2StacItem, getBaseUrl } from '~/utils/geonetwork'
import { cachedFetch } from '~/utils/cachedFetch'
import { withCors } from '~/utils/withCors'
import { zx } from 'zodix'
import { z } from 'zod'
import { bboxPolygon } from '@turf/turf'

let GN_BASE_URL = 'https://deltaresdata.openearth.eu'

const ITEMS_PER_PAGE = 20

export let loader = withCors(async loaderArgs => {
  let { request } = loaderArgs

  let validate = await getStacValidator('Item')

  let baseUrl = getBaseUrl(loaderArgs)

  let {
    q = '',
    page = 0,
    collections: collectionsString,
    bbox: bboxString,
  } = zx.parseQuery(request, {
    q: z.string().optional(),
    page: zx.NumAsString.optional(),
    collections: z.string().optional(),
    bbox: z.string().optional(),
  })
  let collections = collectionsString?.split(',') ?? []
  let bbox = bboxString ? JSON.parse(bboxString) : [-180, -90, 180, 90]

  let polygons = bboxPolygon(bbox)
  let geometry = encodeURIComponent(
    `POLYGON(${polygons.geometry.coordinates.map(
      polygon => `(${polygon.map(point => point.join(' ')).join(',')})`,
    )})`,
  )

  let gnUrl = `${GN_BASE_URL}/geonetwork/srv/eng/q?_content_type=json&fast=index&from=${
    page * ITEMS_PER_PAGE + 1
  }&sortOrder=&to=${
    (page + 1) * ITEMS_PER_PAGE
  }&any=${q}&geometry=${geometry}&relation=within_bbox`
  for (let collection of collections) {
    gnUrl += `&facet.q=topicCat/${collection}`
  }

  let result = await cachedFetch(gnUrl)

  let features = []

  for (let item of result.metadata ? [result.metadata].flat() : []) {
    let stacItem = await geonetworkItem2StacItem({ item, baseUrl })

    features.push(stacItem)
    validate(stacItem)
  }

  return {
    type: 'FeatureCollection',
    count: features.length,
    features,
    links: [],
  }
})
