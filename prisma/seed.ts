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

  let animal = randAnimal()
  let collection = await db.collection.create({
    data: {
      title: `${animal} Collection`,
      startTime: new Date(),
      catalog: {
        create: {
          title: 'Animals',
          description: 'Catalog of animals',
        },
      },
    },
  })

  await db.$queryRaw`
    UPDATE 
      "public"."Collection"
    SET 
      "geometry" = ST_SetSRID(ST_MakePoint(52.377956, 4.897070), 4326)
    WHERE
      "id" =  ${collection.id};
  `

  await Promise.all(
    Array(100)
      .fill('')
      .map(async () => {
        let item = await db.item.create({
          data: {
            collectionId: collection.id,
            projectNumber: `${randColor()}-${randNumber()}`,
            title: `${animal} Item ${randNumber()}`,
            location: randFilePath(),
          },
        })

        await db.$queryRaw`
    UPDATE 
      "public"."Item"
    SET 
      "geometry" = ST_SetSRID(ST_MakePoint(52.377956, 4.897070), 4326)
    WHERE
      "id" =  ${item.id};
  `
      }),
  )

  let standardIds = await Promise.all(
    Array(3)
      .fill('')
      .map(async () => {
        let standard = await db.standard.create({
          data: {
            name: randWord(),
            description: randLine(),
          },
        })

        return standard.id
      }),
  )

  let parents = await Promise.all(
    Array(100)
      .fill('')
      .map(async () => {
        let parentKeyword = await db.keyword.create({
          data: {
            title: randWord(),
            description: randLine(),
            standardId: rand(standardIds),
          },
        })

        return parentKeyword
      }),
  )

  await Promise.all(
    Array(2000)
      .fill('')
      .map(async () => {
        let parent = rand(parents)

        let newKeyword = await db.keyword.create({
          data: {
            title: randWord(),
            description: randLine(),
            standardId: parent.standardId,
            parentId: parent.id,
          },
        })

        parents.push(newKeyword)
      }),
  )
}

seed()
