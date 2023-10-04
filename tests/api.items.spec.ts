import {
  randAnimal,
  randColor,
  randFilePath,
  randNumber,
  randParagraph,
  randRecentDate,
  randSoonDate,
} from '@ngneat/falso'
import { test, expect } from '@playwright/test'
import { randomPolygon } from '@turf/turf'
import type { ItemSchema } from '~/forms/ItemForm'
import { updateGeometry } from '~/services/item.server'
import { encodeToken } from '~/utils/apiKey'
import { db } from '~/utils/db.server'

test('Create Item', async ({ request }) => {
  await truncateDatabase()

  let exampleRequestBody: ItemSchema = {
    title: randAnimal(),
    projectNumber: randNumber().toFixed(0),
    description: randParagraph(),
    geometry: randomPolygon().features[0].geometry,
    dateRange: {
      from: randRecentDate().toISOString(),
      to: randSoonDate().toISOString(),
    },
    location: '',
    license: '',
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
    title: exampleRequestBody.title,
    assets: null,
    collectionId: exampleRequestBody.collectionId,
    description: exampleRequestBody.description,
    dateTime: null,
    startTime: exampleRequestBody.dateRange.from,
    endTime: exampleRequestBody.dateRange.to,
    location: '',
    license: '',
  }

  let token = createToken()

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
      title: randAnimal(),
      projectNumber: randNumber().toFixed(0),
      description: randParagraph(),
      startTime: randRecentDate().toISOString(),
      endTime: randSoonDate().toISOString(),
      location: '',
      license: '',
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
    title: randAnimal(),
    projectNumber: randNumber().toFixed(0),
    description: randParagraph(),
    geometry: randomPolygon().features[0].geometry,
    dateRange: {
      from: randRecentDate().toISOString(),
      to: randSoonDate().toISOString(),
    },
    location: '',
    license: '',
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
    title: exampleRequestBody.title,
    assets: null,
    collectionId: exampleRequestBody.collectionId,
    description: exampleRequestBody.description,
    dateTime: null,
    startTime: exampleRequestBody.dateRange.from,
    endTime: exampleRequestBody.dateRange.to,
    location: '',
    license: '',
  }

  let token = createToken()

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
  let exampleItem = {
    dateTime: null,
    title: randAnimal(),
    projectNumber: randNumber().toFixed(0),
    description: randParagraph(),
    startTime: randRecentDate().toISOString(),
    endTime: randSoonDate().toISOString(),
    location: '',
    license: '',
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
  let newItem = await request.get(`/api/items/${item.id}`)

  // Assert
  expect(newItem.ok()).toBeTruthy()
  let exampleResponseBody = {
    ...exampleItem,
    geometry: {
      ...geometry,
      coordinates: geometry.coordinates.map(polygon =>
        polygon.map(point => point.map(number => expect.closeTo(number, 9))),
      ),
    },
  }
  expect(await newItem.json()).toMatchObject(exampleResponseBody)
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
            projectNumber: `${randColor()}-${randNumber()}`,
            title: `${randAnimal()}`,
            location: randFilePath(),
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
