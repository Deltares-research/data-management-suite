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
      {
        rel: 'items',
        href: `${baseUrl}/collections/${topic}/items`,
        type: 'application/geo+json',
      },
      {
        rel: 'self',
        type: 'application/json',
        // TODO: Fetch collections from GN
        href: `${baseUrl}/collections/${topic}`,
      },
    ],
  }

  if (validate(stacCollection)) {
    return stacCollection
  } else {
    return { errors: validate.errors, data: stacCollection }
  }
})
