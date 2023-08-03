import { type LoaderArgs } from '@remix-run/node'
import stacPackageJson from 'stac-spec/package.json'
import { withCors } from '~/utils/withCors'
import { getStacValidator } from '~/utils/stacspec'
import { zx } from 'zodix'
import { z } from 'zod'

export let loader = withCors(async ({ request, params }: LoaderArgs) => {
  let { source64 } = zx.parseParams(params, { source64: z.string() })

  let sourceUrl = Buffer.from(source64, 'base64').toString()

  let validate = await getStacValidator('Catalog')
  let url = new URL(request.url)

  let baseUrl = `${url.protocol}//${url.host}/g2s/${source64}/stac`

  let data = {
    type: 'Catalog',
    id: 'TBD',
    description: 'TBD',
    stac_version: stacPackageJson.version,
    links: [
      {
        rel: 'self',
        type: 'application/json',
        href: `${baseUrl}`,
      },
      {
        rel: 'search',
        type: 'application/geo+json',
        title: 'STAC Search',
        href: `${baseUrl}/search`,
        method: 'GET',
      },
      {
        rel: 'data',
        type: 'application/json',
        href: `${baseUrl}/collections`,
      },
    ],
  }

  if (validate(data)) {
    return data
  } else {
    return { errors: validate.errors, data }
  }
})
