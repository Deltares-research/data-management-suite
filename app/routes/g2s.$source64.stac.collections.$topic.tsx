import { withCors } from '~/utils/withCors'
import stacPackageJson from 'stac-spec/package.json'
import { getStacValidator } from '~/utils/stacspec'
import { zx } from 'zodix'
import { z } from 'zod'
import { loader as itemsLoader } from './g2s.$source64.stac.collections.$topic.items'
import { getHost } from '~/routes'

export let loader = withCors(async ({ request, params, ...args }) => {
  let { source64, topic } = zx.parseParams(params, {
    source64: z.string(),
    topic: z.string(),
  })

  let validate = await getStacValidator('Collection')

  let baseUrl = `${getHost(request)}/g2s/${source64}/stac`

  let { extent } = await itemsLoader({ request, params, ...args }).then(res =>
    res.json(),
  )

  let stacCollection = {
    type: 'Collection',
    stac_version: stacPackageJson.version,
    id: topic,
    description: '',
    license: 'MIT',
    extent,
    links: [
      {
        rel: 'root',
        href: `${baseUrl}`,
      },
      {
        rel: 'items',
        href: `${baseUrl}/collections/${topic}/items`,
        type: 'application/geo+json',
      },
      {
        rel: 'self',
        type: 'application/json',
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
