import type { Collection, Prisma } from '@prisma/client'
import { db } from '~/utils/db.server'

async function seed() {
  let group = await db.group.upsert({
    where: {
      name: 'Test Group',
    },
    create: {
      name: 'Test Group',
    },
    update: {
      name: 'Test Group',
    },
  })

  let newPerson: Prisma.PersonCreateInput = {
    name: 'Robert',
    email: 'robert.broersma@deltares.nl',
  }

  let person = await db.person.upsert({
    where: {
      email: 'robert.broersma@deltares.nl',
    },
    create: {
      ...newPerson,
      memberOf: {
        create: {
          groupId: group.id,
          role: 'CONTRIBUTOR',
        },
      },
    },
    update: newPerson,
  })

  let catalog = await db.catalog.create({
    data: {
      title: 'Test Catalog',
      description: 'Test Catalog Description',
    },
  })

  let collection = (await db.$queryRaw`
    INSERT INTO "public"."Collection"("id", "updatedAt", "geometry", "startTime", "catalogId", "title") VALUES('1', now(), ST_SetSRID(ST_MakePoint(52.377956, 4.897070), 4326), now(), ${catalog.id}, 'Test Collection') RETURNING "id", "createdAt", "updatedAt", ST_AsEWKT("geometry") AS "geometry", "catalogId";
  `) as Collection

  await db.$queryRaw`
    INSERT INTO "public"."Item"("id", "updatedAt", "ownerId", "geometry", "collectionId") VALUES('1', now(), ${person.id}, ST_SetSRID(ST_MakePoint(52.377956, 4.897070), 4326), ${collection.id}) RETURNING "id", "createdAt", "updatedAt", "ownerId", "license", ST_AsEWKT("geometry") AS "geometry", "properties", "assets";
  `
}

seed()
