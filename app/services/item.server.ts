import type { Geometry } from 'geojson'
import { db } from '~/utils/db.server'
import { v4 as uuid } from 'uuid'
import type { Item } from '@prisma/client'

export async function upsertItem({
  id = uuid(),
  ownerId,
  collectionId,
  geometry,
  projectNumber,
  license,
  description,
  title,
  location,
}: {
  id?: string
  ownerId: string
  projectNumber: string
  title: string
  description: string | null
  license: string | null
  location: string
  collectionId: string
  geometry: Geometry
}): Promise<Item> {
  let [result] = await db.$queryRaw<Item[]>`
    INSERT INTO "public"."Item"(
      "id",
      "createdAt", 
      "updatedAt",
      "projectNumber",
      "title",
      "location",
      "description",
      "license", 
      "ownerId", 
      "geometry", 
      "collectionId"
    ) 
    
    VALUES(
      ${id},
      now(), 
      now(),
      ${projectNumber},
      ${title},
      ${location},
      ${description},
      ${license},
      ${ownerId}, 
      ST_GeomFromGeoJSON(${geometry}), 
      ${collectionId}
    )

    ON CONFLICT ("id") DO UPDATE
    SET
      "updatedAt" = now(),
      "ownerId" = ${ownerId},
      "projectNumber" = ${projectNumber},
      "title" = ${title},
      "location" = ${location},
      "license" = ${license},
      "geometry" = ST_GeomFromGeoJSON(${geometry}),
      "collectionId" = ${collectionId}
    
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
