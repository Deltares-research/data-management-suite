import type { Geometry } from 'geojson'
import { db } from '~/utils/db.server'
import { v4 as uuid } from 'uuid'
import type { Item } from '@prisma/client'

export async function createItem({
  ownerId,
  collectionId,
  geometry,
}: {
  ownerId: string
  collectionId: string
  geometry: Geometry
}): Promise<{
  id: string
}> {
  let [result] = await db.$queryRaw<Item[]>`
    INSERT INTO "public"."Item"(
      "id",
      "updatedAt", 
      "ownerId", 
      "geometry", 
      "collectionId"
    ) 
    
    VALUES(
      ${uuid()},
      now(), 
      ${ownerId}, 
      ST_GeomFromGeoJSON(${geometry}), 
      ${collectionId}
    ) 
    
    RETURNING 
      "id", 
      "createdAt", 
      "updatedAt", 
      "ownerId", 
      "license", 
      ST_AsEWKT("geometry") AS "geometry", 
      "properties", 
      "assets"
    ;
  `

  return result
}
