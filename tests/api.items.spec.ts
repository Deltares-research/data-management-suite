import {
  randAnimal,
  randColor,
  randNumber,
  randParagraph,
  randRecentDate,
  randSoonDate,
} from '@ngneat/falso'
import { test, expect } from '@playwright/test'
import type { Prisma } from '@prisma/client'
import { randomPolygon } from '@turf/turf'
import type { ItemSchema } from '~/forms/items/ItemForm'
import { updateGeometry } from '~/services/item.server'
import { encodeToken } from '~/utils/apiKey'
import { db } from '~/utils/db.server'

test('Create Item', async ({ request, baseURL }) => {
  await truncateDatabase()

  let exampleRequestBody: ItemSchema = {
    properties: {
      title: randAnimal(),
      projectNumber: randNumber().toFixed(0),
      description: randParagraph(),
      datetime: randRecentDate().toISOString(),
    },
    geometry: randomPolygon().features[0].geometry,
    collectionId: await db.collection
      .create({
        data: {
          title: 'Test Collection',
          catalog: {
            create: {
              title: 'Test Catalog',
              description: 'Catalog created during automated test',
            },
          },
        },
      })
      .then(c => c.id),
  }

  let exampleResponseBody = {
    properties: exampleRequestBody.properties,
    links: expect.arrayContaining([
      {
        rel: 'collection',
        href: `/collections/${exampleRequestBody.collectionId}`,
        type: 'application/json',
      },
    ]),
  }

  let token = await createToken()

  let result = await request
    .post(`/api/items`, {
      data: exampleRequestBody,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      return res.json()
    })

  expect(result).toMatchObject(exampleResponseBody)
})

test('Edit Item', async ({ request }) => {
  await truncateDatabase()

  let testItem = await db.item.create({
    data: {
      properties: {
        title: randAnimal(),
        projectNumber: randNumber().toFixed(0),
        description: randParagraph(),
        start_datetime: randRecentDate().toISOString(),
        end_datetime: randSoonDate().toISOString(),
      },
      collection: {
        create: {
          title: 'Test Collection',
          catalog: {
            create: {
              title: 'Test Catalog',
              description: 'Catalog created during automated test',
            },
          },
        },
      },
    },
  })

  let exampleRequestBody: ItemSchema = {
    properties: {
      title: randAnimal(),
      projectNumber: randNumber().toFixed(0),
      description: randParagraph(),
      start_datetime: randRecentDate().toISOString(),
      end_datetime: randSoonDate().toISOString(),
    },
    geometry: randomPolygon().features[0].geometry,
    collectionId: await db.collection
      .create({
        data: {
          title: 'Test Collection',
          catalog: {
            create: {
              title: 'Test Catalog',
              description: 'Catalog created during automated test',
            },
          },
        },
      })
      .then(c => c.id),
  }

  let exampleResponseBody = {
    properties: exampleRequestBody.properties,
    assets: {},
    links: expect.arrayContaining([
      {
        rel: 'collection',
        href: `/collections/${exampleRequestBody.collectionId}`,
        type: 'application/json',
      },
    ]),
  }

  let token = await createToken()

  let result = await request
    .patch(`/api/items/${testItem.id}`, {
      data: exampleRequestBody,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      console.log(res)
      return res.json()
    })

  expect(result).toMatchObject(exampleResponseBody)
})

test('Get Item', async ({ request }) => {
  await truncateDatabase()

  // Arrange
  let exampleItem: Prisma.ItemCreateWithoutCollectionInput = {
    properties: {
      title: randAnimal(),
      projectNumber: randNumber().toFixed(0),
      description: randParagraph(),
    },
    start_datetime: randRecentDate().toISOString(),
    end_datetime: randSoonDate().toISOString(),
  }

  let item = await db.item.create({
    data: {
      ...exampleItem,
      collection: {
        create: {
          title: 'Test Collection',
          catalog: {
            create: {
              title: 'Test Catalog',
              description: 'Catalog created during automated test',
            },
          },
        },
      },
    },
  })

  let geometry = randomPolygon().features[0].geometry

  await updateGeometry({
    id: item.id,
    geometry,
  })

  // Act
  let existingItem = await request.get(`/stac/items/${item.id}`)

  // Assert
  expect(existingItem.ok()).toBeTruthy()
  let exampleResponseBody = {
    properties: {
      ...(exampleItem.properties as Object),
      start_datetime: exampleItem.start_datetime,
      end_datetime: exampleItem.end_datetime,
    },
    geometry: {
      ...geometry,
      coordinates: geometry.coordinates.map(polygon =>
        polygon.map(point => point.map(number => expect.closeTo(number, 9))),
      ),
    },
  }
  expect(await existingItem.json()).toMatchObject(exampleResponseBody)
})

test('Item Search', async ({ request }) => {
  await truncateDatabase()

  let collection = await db.collection.create({
    data: {
      title: `Animals`,
      startTime: new Date(),
      catalog: {
        create: {
          title: 'Organisms',
          description: 'Catalog of organisms',
        },
      },
    },
  })

  await Promise.all(
    Array(10)
      .fill('')
      .map(async () => {
        let item = await db.item.create({
          data: {
            collectionId: collection.id,
            properties: {
              projectNumber: `${randColor()}-${randNumber()}`,
              title: `${randAnimal()}`,
            },
          },
        })

        let centerLon = Math.random() * 360 - 180
        let centerLat = Math.random() * 180 - 90

        let lons = [
          centerLon + (Math.random() * -4 - 1),
          centerLon + (Math.random() * 4 + 1),
        ]
        let lats = [
          centerLat + (Math.random() * -4 - 1),
          centerLat + (Math.random() * 4 + 1),
        ]

        let polygon = `POLYGON((${lons[0]} ${lats[0]}, ${lons[1]} ${lats[0]}, ${lons[1]} ${lats[1]}, ${lons[0]} ${lats[1]}, ${lons[0]} ${lats[0]}))`

        await db.$queryRaw`
          UPDATE 
            "public"."Item"
          SET 
            "geometry" = ST_GeomFromText(${polygon}, 4326)
          WHERE
            "id" =  ${item.id};
        `
      }),
  )

  let searchResult = await request.get(`/api/search`).then(res => res.json())

  expect(searchResult.features.length).toBe(10)
})

async function truncateDatabase() {
  const tablenames = await db.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter(name => name !== '_prisma_migrations')
    .map(name => `"public"."${name}"`)
    .join(', ')

  try {
    await db.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
  } catch (error) {
    console.log({ error })
  }
}

async function createToken() {
  let token = 'TestKey'
  await db.apiKey.create({
    data: {
      key: encodeToken(token),
      name: 'Test Token',
      person: {
        create: {
          name: 'Test Person',
          email: 'test@test.test',
        },
      },
    },
  })

  return token
}
