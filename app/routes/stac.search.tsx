import type { Item } from '@prisma/client'
import { db } from '~/utils/db.server'
import { withCors } from '~/utils/withCors'

export let loader = withCors(async ({ request }) => {
  let url = new URL(request.url)
  let bboxString = url.searchParams.get('bbox')
  let bbox = bboxString ? JSON.parse(bboxString) : [-180, -90, 180, 90]

  let items = await db.$queryRaw`
    SELECT ST_AsGeoJson(geometry) as geometry, "id", "ownerId" FROM "Item"
    WHERE ST_Intersects(geometry, ST_MakeEnvelope(${bbox[1]}::double precision, ${bbox[0]}::double precision, ${bbox[3]}::double precision, ${bbox[2]}::double precision, 4326))
  `

  return { type: 'FeatureCollection', features: items }
})

export let action = withCors(async ({ request }) => {
  let url = new URL(request.url)
  let bboxString = url.searchParams.get('bbox')
  let bbox = bboxString ? JSON.parse(bboxString) : [-180, -90, 180, 90]

  // let { filter } = await request.json()
  // console.log(filter.args[0].args)

  // let where = []

  // for (let arg of filter.args) {
  //   let subWhere = []
  //   for (let [info, value] of arg.args) {
  //     subWhere.push(`${info.property} ${arg.op} ${value}`)
  //   }
  // }

  // console.log({ where })

  let items = (await db.$queryRaw`
    SELECT ST_AsGeoJson(geometry) as geometry, i."id", i."ownerId" 
    FROM "Item" i

    INNER JOIN "_ItemToKeyword" itk ON i."id" = itk."A"
    INNER JOIN "Keyword" k ON itk."B" = k."id"

    WHERE 
      ST_Intersects(i.geometry, ST_MakeEnvelope(${bbox[1]}::double precision, ${bbox[0]}::double precision, ${bbox[3]}::double precision, ${bbox[2]}::double precision, 4326))
    AND k.title = 'dolores'
  `) as Item[]

  return {
    type: 'FeatureCollection',
    features: items.map(item => ({
      type: 'Feature',
      ...item,
    })),
  }
})
