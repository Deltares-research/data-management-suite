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
