import { type LoaderArgs } from '@remix-run/node'
import stacPackageJson from 'stac-spec/package.json'
import { withCors } from '~/utils/withCors'
import { conformsTo, getStacValidator } from '~/utils/stacspec'
import { zx } from 'zodix'
import { z } from 'zod'
import { cachedFetch } from '~/utils/cachedFetch'

export let loader = withCors(async ({ request, params }: LoaderArgs) => {
  let { source64 } = zx.parseParams(params, { source64: z.string() })

  let sourceUrl = Buffer.from(source64, 'base64').toString()

  let validate = await getStacValidator('Catalog')
  let url = new URL(request.url)

  let siteUrl = `${sourceUrl}/geonetwork/srv/api/site`

  let site = await cachedFetch(siteUrl, {
    requestInit: {
      headers: {
        accept: '*/*;q=0.8',
      },
    },
    cacheOptions: { ttl: 1000 * 60 * 60 * 24 },
  })

  let baseUrl = `${url.protocol}//${url.host}/g2s/${source64}/stac`

  let site = await fetch(`${sourceUrl}/geonetwork/srv/api/0.1/site`, {
    headers: {
      'X-XSRF-TOKEN': '71ab0f46-5a92-4226-9ded-fb8034fe6cb5',
    },
  })

  console.log(site)

  return site

  let data = {
    type: 'Catalog',
    id: site['system/site/name'],
    description: `Geonetwork catalog found at ${sourceUrl}`,
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
    conformsTo,
  }

  if (validate(data)) {
    return data
  } else {
    return { errors: validate.errors, data }
  }
})
