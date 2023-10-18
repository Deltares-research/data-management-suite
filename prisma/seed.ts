import {
  rand,
  randAnimal,
  randColor,
  randFilePath,
  randLine,
  randNumber,
  randWord,
} from '@ngneat/falso'
import { db } from '~/utils/db.server'

async function seed() {
  /**
   * 1. Create group for access control
   * 2. Create private catalog
   * 2.1 Create collection
   * 2.1.1 Create 100 items
   *
   * 3. Create public catalog
   * 3.1 Create collection
   * 3.1.1 Create 100 items
   *
   * */

  // let group = await db.group.upsert({
  //   where: {
  //     name: 'Test Group',
  //   },
  //   create: {
  //     name: 'Test Group',
  //   },
  //   update: {
  //     name: 'Test Group',
  //   },
  // })

  // let newPerson: Prisma.PersonCreateInput = {
  //   name: 'Robert',
  //   email: 'robert.broersma@deltares.nl',
  // }

  // let person = await db.person.upsert({
  //   where: {
  //     email: 'robert.broersma@deltares.nl',
  //   },
  //   create: {
  //     ...newPerson,
  //     memberOf: {
  //       create: {
  //         groupId: group.id,
  //         role: 'CONTRIBUTOR',
  //       },
  //     },
  //   },
  //   update: newPerson,
  // })

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

  // Set collection geometry
  // await db.$queryRaw`
  //   UPDATE
  //     "public"."Collection"
  //   SET
  //     "geometry" = ST_SetSRID(ST_MakePoint(52.377956, 4.897070), 4326)
  //   WHERE
  //     "id" =  ${collection.id};
  // `

  await Promise.all(
    Array(100)
      .fill('')
      .map(async () => {
        let item = await db.item.create({
          data: {
            collectionId: collection.id,
            properties: {
              projectNumber: `${randColor()}-${randNumber()}`,
              title: `${randAnimal()}`,
              location: randFilePath(),
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

  // let standardIds = await Promise.all(
  //   Array(3)
  //     .fill('')
  //     .map(async () => {
  //       let standard = await db.standard.create({
  //         data: {
  //           name: randWord(),
  //           description: randLine(),
  //         },
  //       })

  //       return standard.id
  //     }),
  // )

  // let parents = await Promise.all(
  //   Array(100)
  //     .fill('')
  //     .map(async () => {
  //       let parentKeyword = await db.keyword.create({
  //         data: {
  //           title: randWord(),
  //           description: randLine(),
  //           standardId: rand(standardIds),
  //         },
  //       })

  //       return parentKeyword
  //     }),
  // )

  // await Promise.all(
  //   Array(2000)
  //     .fill('')
  //     .map(async () => {
  //       let parent = rand(parents)

  //       let newKeyword = await db.keyword.create({
  //         data: {
  //           title: randWord(),
  //           description: randLine(),
  //           standardId: parent.standardId,
  //           parentId: parent.id,
  //         },
  //       })

  //       parents.push(newKeyword)
  //     }),
  // )
}

seed()
