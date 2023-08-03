import type { LinksFunction, LoaderArgs } from '@remix-run/node'
import { db } from '~/utils/db.server'
import mapboxStyles from 'mapbox-gl/dist/mapbox-gl.css'

export let links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: mapboxStyles,
    },
  ]
}

export async function loader({ request }: LoaderArgs) {
  let url = new URL(request.url)
  let bboxString = url.searchParams.get('bbox')
  let bbox = bboxString ? JSON.parse(bboxString) : [-180, -90, 180, 90]

  let items = await db.$queryRaw`
    SELECT ST_AsGeoJson(geometry) as geometry, "id", "ownerId" FROM "Item"
    WHERE ST_Intersects(geometry, ST_MakeEnvelope(${bbox[1]}::double precision, ${bbox[0]}::double precision, ${bbox[3]}::double precision, ${bbox[2]}::double precision, 4326))
  `

  return items
}
