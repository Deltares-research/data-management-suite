import { type LoaderArgs } from '@remix-run/node'
import stacPackageJson from 'stac-spec/package.json'
import { withCors } from '~/utils/withCors'
import { getStacValidator } from '~/utils/stacspec'

export let loader = withCors(async ({ request }: LoaderArgs) => {
  let validate = await getStacValidator('Catalog')
  let url = new URL(request.url)

  let baseUrl = `${url.protocol}//${url.host}/stac`

  let data = {
    type: 'Catalog',
    id: 'deltares-catalog',
    description:
      'Searchable spatiotemporal metadata catalog for all data within Deltares.',
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
