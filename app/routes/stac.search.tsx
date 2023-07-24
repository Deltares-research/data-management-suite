import type { LinksFunction, LoaderArgs, V2_MetaArgs } from '@remix-run/node'
import { db } from '~/utils/db.server'
import Map, {
  FillLayer,
  Layer,
  Marker,
  Source,
  ViewStateChangeEvent,
} from 'react-map-gl'
import mapboxStyles from 'mapbox-gl/dist/mapbox-gl.css'
import React from 'react'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import mapboxgl from 'mapbox-gl'

const MAPBOX_TOKEN =
  'pk.eyJ1Ijoicm9iZXJ0YnJvZXJzbWEiLCJhIjoiY2tjMjVwbnRuMjBoMjM0bXh1eHR5d2o0YSJ9.xZxWCeY2LEaGHDzME5JqfA'

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

export default function SearchPage() {
  let results = useLoaderData<typeof loader>()

  let [, setSearchParams] = useSearchParams()

  function handleMoveEnd(e: ViewStateChangeEvent) {
    let bounds = e.target.getBounds()

    setSearchParams({
      bbox: JSON.stringify([...bounds.toArray().flat()]),
    })
  }

  return (
    <div className="">
      <div>
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </div>
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ height: 400, width: 600 }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        initialViewState={{
          longitude: 4.897,
          latitude: 52.377,
          zoom: 9,
        }}
        onMoveEnd={handleMoveEnd}
      >
        {results.map(item => {
          let geo = JSON.parse(item.geometry)

          return (
            <Marker
              key={item.id}
              latitude={geo.coordinates[0]}
              longitude={geo.coordinates[1]}
            />
          )
        })}

        {/* <Source type="geojson" data={data} >
          <Layer {...dataLayer} />
        </Source> */}
      </Map>
    </div>
  )
}
