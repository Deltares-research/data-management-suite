import { Prisma } from '@prisma/client'
import { db } from './db.server'
import type { AllowedGeometry } from '~/types'

interface Item {
  id: string
}

export async function fetchItemsGeometries<T extends Item>(
  items: T[],
  bbox?: [number, number, number, number],
) {
  let where = bbox
    ? Prisma.sql`WHERE (
    ST_Intersects("Item"."geometry", 
      ST_MakeEnvelope(
        ${bbox[0].toFixed(12)}::double precision, 
        ${bbox[1].toFixed(12)}::double precision, 
        ${bbox[2].toFixed(12)}::double precision,
        ${bbox[3].toFixed(12)}::double precision, 
        4326))
    OR "Item"."geometry" IS NULL
  )`
    : Prisma.sql`WHERE 1 = 1`

  let geometries = await db.$queryRaw<{ geometry: string; id: string }[]>`
    SELECT 
      ST_AsGeoJson("Item"."geometry") as geometry, 
      "Item"."id" as id
    FROM "Item"
    ${where}

    AND
      "Item"."id" IN (${Prisma.join(items.map(item => item.id))})
  `

  let result = geometries.map(geo => {
    let geometry = JSON.parse(geo.geometry) as AllowedGeometry

    return {
      ...items.find(item => item.id === geo.id)!,
      geometry,
    }
  })

  return result
}
