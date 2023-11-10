import type { LoaderFunctionArgs } from '@remix-run/node'
import stacPackageJson from 'stac-spec/package.json'
import { db } from '~/utils/db.server'
import { withCors } from '~/utils/withCors'
import { getStacValidator } from '~/utils/stacspec'
import { zx } from 'zodix'
import { z } from 'zod'
import { getHost } from '~/routes'

export let loader = withCors(
  async ({ request, params }: LoaderFunctionArgs) => {
    let { catalogId } = zx.parseParams(params, { catalogId: z.string() })

    let validate = await getStacValidator('Collection')

    let baseUrl = `${getHost(request)}/stac/catalogs/${catalogId}`

    let collections = await db.collection.findMany({
      where: {
        catalogId,
      },
      include: {
        items: true,
      },
    })

    let stacCollections = collections.map(collection => ({
      type: 'Collection',
      stac_version: stacPackageJson.version,
      id: collection.title,
      description: collection.description ?? '',
      license: 'MIT',
      extent: {
        spatial: {
          // TODO
          bbox: [[-180, -90, 180, 90]],
        },
        temporal: {
          interval: [
            [
              collection.startTime?.toISOString() ?? new Date().toISOString(),
              collection.endTime ?? null,
            ],
          ],
        },
      },
      links: [
        {
          rel: 'self',
          type: 'application/json',
          href: `${baseUrl}/collections/${collection.id}`,
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
