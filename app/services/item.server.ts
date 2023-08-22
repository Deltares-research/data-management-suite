import type { Geometry } from 'geojson'
import { db } from '~/utils/db.server'
import { v4 as uuid } from 'uuid'
import type { Item } from '@prisma/client'

export async function updateGeometry({
  id = uuid(),
  geometry,
}: {
  id: string
  geometry: Geometry
}): Promise<Item> {
  let [result] = await db.$queryRaw<Item[]>`
    UPDATE 
      "public"."Item"
    
    SET
      "updatedAt" = now(),
      "geometry" = ST_GeomFromGeoJSON(${geometry})

    WHERE
      "id" = ${id}    
  `

  return result
}
