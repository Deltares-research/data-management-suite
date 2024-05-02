import type { LoaderFunctionArgs } from '@remix-run/node'
import { db } from '~/utils/db.server'
import { zx } from 'zodix'
import { z } from 'zod'
import { prismaToStacItem } from '~/utils/prismaToStac'
import type { FeatureCollection } from 'geojson'
import { createAuthenticator } from '~/services/auth.server'
import { whereUserCanReadItem } from '~/utils/authQueries'
import { fetchItemsGeometries } from '~/utils/fetchGeometries'

export async function loader({ request }: LoaderFunctionArgs) {
  let authenticator = createAuthenticator(request)
  let user = await authenticator.isAuthenticated(request)

  // let url = new URL(request.url)
  let { bbox: bboxString, q = '' } = zx.parseQuery(request, {
    bbox: z.string().optional(),
    q: z.string().optional(),
  })
  let bbox = bboxString ? JSON.parse(bboxString) : [-180, -90, 180, 90]

  // let externalCatalogs = await db.externalCatalog.findMany()

  // let externalFeatures: FeatureCollection[] = await Promise.all(
  //   externalCatalogs.map(catalog => {
  //     return fetch(`${catalog.url}/search?q=${q}`)
  //       .then(res => res.json())
  //       .catch(e => {})
  //   }),
  // )

  // let externalCatalog = await db.externalCatalog.findFirst()

  // if (externalCatalog?.url) {
  //   externalResults = await fetch(`${externalCatalog?.url}/search${url.search}`)
  //     .then(res => res.json())
  //     .catch(e => {
  //       console.error(e)

  //       return {
  //         type: 'FeatureCollection',
  //         features: [],
  //       }
  //     })
  // }

  // let result = await fetch(`${getHost(request)}/stac/search${url.search}`)
  //   .then(res => res.json())
  //   .catch(e => {
  //     console.error(e)

  //     return {
  //       type: 'FeatureCollection',
  //       features: [],
  //     }
  //   })

  // return result

  let itemsMeta = await db.item.findMany({
    where: {
      ...whereUserCanReadItem(user?.id),
      OR: [
        {
          properties: {
            path: ['title'],
            string_contains: q,
          },
        },
        {
          properties: {
            path: ['description'],
            string_contains: q,
          },
        },
      ],
    },
    include: {
      collection: {
        include: {
          catalog: true,
        },
      },
      assets: true,
    },
  })

  let items = await fetchItemsGeometries(itemsMeta, bbox)

  let features = [
    ...items.map(item => {
      return {
        ...prismaToStacItem({
          ...item,
          request,
        }),
        collectionTitle: item.collection.title,
        catalogTitle: item.collection.catalog.title,
      }
    }),
    // ...externalResults.features?.map(feature => ({
    //   ...feature,
    //   properties: {
    //     ...feature.properties,
    //     catalogTitle: externalCatalog?.title,
    //   },
    // })),
  ]

  return {
    type: 'FeatureCollection',
    features,
  } satisfies FeatureCollection
}
