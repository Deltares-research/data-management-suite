import type { LoaderArgs } from '@remix-run/node'
import { db } from '~/utils/db.server'
import type { Item } from '@prisma/client'
import { zx } from 'zodix'
import { z } from 'zod'
import { prismaToStacItem } from '~/utils/prismaToStac'
import type { FeatureCollection } from 'geojson'

export async function loader({ request }: LoaderArgs) {
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

  let items = await db.$queryRaw<
    (Item & {
      geometry: string
      collectionTitle: string
      catalogTitle: string
    })[]
  >`
    SELECT ST_AsGeoJson("Item"."geometry") as geometry, "Item"."id" as id, "Item"."datetime", "Item"."start_datetime", "Item"."end_datetime", "Item"."properties", "Collection"."title" as "collectionTitle", "Catalog"."title" as "catalogTitle" FROM "Item"
    JOIN "Collection" ON "Collection"."id" = "Item"."collectionId"
    JOIN "Catalog" ON "Catalog"."id" = "Collection"."catalogId"
    WHERE ST_Intersects("Item"."geometry", ST_MakeEnvelope(${
      bbox[0]
    }::double precision, ${bbox[1]}::double precision, ${
    bbox[2]
  }::double precision, ${bbox[3]}::double precision, 4326))

    AND 
      ("Item"."properties"->>'title' ILIKE ${
        '%' + q + '%'
      } OR "Item"."properties"->>'description' ILIKE ${'%' + q + '%'})

    LIMIT 100
  `

  let features = [
    ...items.map(item => {
      let geometry = JSON.parse(item.geometry)

      // TODO: Generate STAC Item
      return prismaToStacItem({
        ...item,
        geometry,
      })
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
