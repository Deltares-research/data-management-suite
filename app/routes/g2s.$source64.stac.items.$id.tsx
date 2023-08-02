import { withCors } from '~/utils/withCors'
import { zx } from 'zodix'
import { z } from 'zod'
import { geonetworkItem2StacItem } from '~/utils/geonetwork'

export let loader = withCors(async ({ request, params }) => {
  let { source64, id } = zx.parseParams(params, {
    source64: z.string(),
    id: z.string(),
  })

  let sourceUrl = Buffer.from(source64, 'base64').toString()

  let url = new URL(request.url)
  let baseUrl = `${url.protocol}//${url.host}/g2s/${source64}/stac`

  let result = await fetch(
    `${sourceUrl}/geonetwork/srv/eng/q?_content_type=json&fast=index&from=1&sortOrder=&to=20&uuid=${id}`,
  ).then(res => res.json())

  let item = result.metadata

  let stacItem = await geonetworkItem2StacItem({
    item,
    baseUrl,
  })

  return stacItem
})
