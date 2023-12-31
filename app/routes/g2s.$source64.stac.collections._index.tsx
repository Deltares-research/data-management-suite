import type { LoaderFunctionArgs } from '@remix-run/node'
import stacPackageJson from 'stac-spec/package.json'
import { withCors } from '~/utils/withCors'
import { getStacValidator } from '~/utils/stacspec'
import { zx } from 'zodix'
import { z } from 'zod'
import { cachedFetch } from '~/utils/cachedFetch'
import { getHost } from '~/routes'

export let loader = withCors(
  async ({ request, params }: LoaderFunctionArgs) => {
    let { source64 } = zx.parseParams(params, { source64: z.string() })

    let sourceUrl = Buffer.from(source64, 'base64').toString()

    let validate = await getStacValidator('Collection')

    let baseUrl = `${getHost(request)}/g2s/${source64}/stac`

    let result = await cachedFetch(
      `${sourceUrl}/geonetwork/srv/eng/q?_content_type=json&fast=index&from=1&sortOrder=&to=20`,
    )

    let topics = result.summary.topicCats as {
      '@name': string
      '@label': string
    }[]

    let stacCollections = topics.map(topic => ({
      type: 'Collection',
      stac_version: stacPackageJson.version,
      id: topic['@name'],
      description: topic['@label'],
      // TODO: Figure out license
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
          rel: 'self',
          type: 'application/json',
          href: `${baseUrl}/collections/${topic['@name']}`,
        },
      ],
    }))

    let errors = stacCollections
      .map(c => {
        validate(c)
        return validate.errors
      })
      .filter(Boolean)

    let data = {
      collections: stacCollections,
      links: [
        {
          rel: 'self',
          type: 'application/json',
          href: `${baseUrl}/collections`,
        },
        {
          rel: 'root',
          type: 'application/json',
          href: `${baseUrl}`,
        },
      ],
    }

    if (errors.length) {
      return { errors, data }
    } else {
      return data
    }
  },
)
