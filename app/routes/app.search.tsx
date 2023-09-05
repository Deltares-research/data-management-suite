import type { LinksFunction, LoaderArgs } from '@remix-run/node'
import { db } from '~/utils/db.server'
import type { ViewStateChangeEvent } from 'react-map-gl'
import Map, { Layer, Source } from 'react-map-gl'
import mapboxStyles from 'mapbox-gl/dist/mapbox-gl.css'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { getHost } from '~/routes'

// TODO: Get token from BE
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

  let externalCatalog = await db.externalCatalog.findFirst()

  // if (externalCatalog?.url) {
  //   let result = await fetch(`${externalCatalog?.url}/search${url.search}`)
  //     .then(res => res.json())
  //     .catch(e => {
  //       console.error(e)

  //       return {
  //         type: 'FeatureCollection',
  //         features: [],
  //       }
  //     })

  //   return result
  // }

  let result = await fetch(`${getHost(request)}/stac/search${url.search}`)
    .then(res => res.json())
    .catch(e => {
      console.error(e)

      return {
        type: 'FeatureCollection',
        features: [],
      }
    })

  return result

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

  // let features = results.map(item => {
  //   let geometry = JSON.parse(item.geometry)

  //   return {
  //     type: 'Feature',
  //     properties: {},
  //     geometry,
  //   }
  // })

  // let data = {
  //   type: 'FeatureCollection',
  //   features,
  // }

  let data = results

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
        <Source type="geojson" data={data}>
          <Layer
            id="data"
            type="fill"
            paint={{
              'fill-color': '#d53e4f',
              'fill-opacity': 0.5,
            }}
          />
        </Source>
      </Map>
    </div>
  )
}
