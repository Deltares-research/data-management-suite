import type {
  LinksFunction,
  LoaderArgs,
  V2_MetaFunction,
} from '@remix-run/node'
import { db } from '~/utils/db.server'
import type { MapLayerMouseEvent, ViewStateChangeEvent } from 'react-map-gl'
import Map, { Layer, Source } from 'react-map-gl'
import mapboxStyles from 'mapbox-gl/dist/mapbox-gl.css'
import { Form, useLoaderData, useSearchParams } from '@remix-run/react'
import type { Item } from '@prisma/client'
import { H3, Muted } from '~/components/typography'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import React from 'react'
import { format } from 'date-fns'
import { Button } from '~/components/ui/button'
import type mapboxgl from 'mapbox-gl'
import { Input } from '~/components/ui/input'
import { Search, Sliders } from 'lucide-react'
import { zx } from 'zodix'
import { z } from 'zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet'
import type { FeatureCollection } from 'geojson'
import { getHost } from '~/routes'

// TODO: Get token from BE
const MAPBOX_TOKEN =
  'pk.eyJ1Ijoicm9iZXJ0YnJvZXJzbWEiLCJhIjoiY2tjMjVwbnRuMjBoMjM0bXh1eHR5d2o0YSJ9.xZxWCeY2LEaGHDzME5JqfA'

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Search' }]
}

export let links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: mapboxStyles,
    },
  ]
}

export async function loader({ request }: LoaderArgs) {
  let { bbox: bboxString, q = '' } = zx.parseQuery(request, {
    bbox: z.string().optional(),
    q: z.string().optional(),
  })
  let bbox = bboxString ? JSON.parse(bboxString) : [-180, -90, 180, 90]

  // let externalCatalogs = await db.externalCatalog.findMany()

  // let externalFeatures: FeatureCollection[] = await Promise.all(
  //   externalCatalogs.map(catalog => {
  //     return fetch(`${catalog.url}/search?q=${q}`)
  //       .then(res => res.json())
  //       .catch(e => {})
  //   }),
  // )

  let externalFeatures: any[] = []
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

  // let result = await fetch(`${getHost(request)}/stac/search${url.search}`)
  //   .then(res => res.json())
  //   .catch(e => {
  //     console.error(e)

  //     return {
  //       type: 'FeatureCollection',
  //       features: [],
  //     }
  //   })

  // return result

  let items = await db.$queryRaw`
    SELECT ST_AsGeoJson("Item"."geometry") as geometry, "Item"."id" as id, "Item"."title", "Item"."description", "Item"."dateTime", "Item"."startTime", "Item"."endTime", "Collection"."title" as "collectionTitle" FROM "Item"
    JOIN "Collection" ON "Collection"."id" = "Item"."collectionId"
    WHERE ST_Intersects("Item"."geometry", ST_MakeEnvelope(${
      bbox[0]
    }::double precision, ${bbox[1]}::double precision, ${
    bbox[2]
  }::double precision, ${bbox[3]}::double precision, 4326))

    AND 
      ("Item"."title" ILIKE ${'%' + q + '%'} OR "Item"."description" ILIKE ${
    '%' + q + '%'
  })

    LIMIT 100
  `

  return {
    items: items as (Item & { geometry: string; collectionTitle: string })[],
    externalFeatures,
  }
}

export default function SearchPage() {
  let { items, externalFeatures } = useLoaderData<typeof loader>()

  let [searchParams, setSearchParams] = useSearchParams()
  let [bounds, setBounds] = React.useState<mapboxgl.LngLatBounds>()
  let [hoveredItemIds, setHoveredItemIds] = React.useState<string[]>([])

  function handleMoveEnd(e: ViewStateChangeEvent) {
    let newBounds = e.target.getBounds()

    setSearchParams({
      bbox: JSON.stringify([...newBounds.toArray().flat()]),
    })
  }

  function setSearchBounds() {
    if (!bounds) return

    setSearchParams({
      bbox: JSON.stringify([...bounds.toArray().flat()]),
    })

    setBounds(undefined)
  }

  function handleMapHover(e: MapLayerMouseEvent) {
    setHoveredItemIds(e.features?.map(f => f.properties?.id) ?? [])
  }

  let features = [
    ...items.map(item => {
      let geometry = JSON.parse(item.geometry)

      return {
        type: 'Feature',
        properties: {
          id: item.id,
        },
        geometry,
      }
    }),
    ...externalFeatures.flatMap(fc => fc?.features ?? []),
  ]
  // let features = results.map(item => {
  //   let geometry = JSON.parse(item.geometry)

  //   return {
  //     type: 'Feature',
  //     properties: {},
  //     geometry,
  //   }
  // })

  let data = {
    type: 'FeatureCollection',
    features,
  }

  // let data = results

  let qId = React.useId()

  return (
    <>
      <div className="h-full grid grid-cols-2">
        <div className="p-5">
          <Form method="get">
            <input
              type="hidden"
              name="bbox"
              value={searchParams.get('bbox') ?? ''}
            />

            <div className="flex items-center gap-3">
              <div className="relative flex items-center flex-1">
                <label htmlFor={qId} className="sr-only">
                  Search items
                </label>
                <Search className="w-4 h-4 absolute left-2.5" />
                <Input
                  id={qId}
                  name="q"
                  placeholder="Search items by title or description..."
                  className="pl-8"
                />
              </div>

              <Sheet>
                <SheetTrigger>
                  <Button variant="outline">
                    Filter <Sliders className="ml-2 w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Adjust your filters and hit apply.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-12">
                    <Badge>Coming Soon</Badge>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </Form>

          <div className="mt-8">
            <H3>{items.length} Results</H3>
          </div>
          <div className="mt-6 flex flex-col gap-8 max-h-full overflow-auto">
            {items.map(item => (
              <Card
                onMouseEnter={() => setHoveredItemIds([item.id])}
                onMouseLeave={() => setHoveredItemIds([])}
                key={item.id}
                className={
                  hoveredItemIds.includes(item.id) ? 'border-green-500' : ''
                }
              >
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className="w-full flex justify-between gap-8 items-center">
                    {item.startTime && item.endTime ? (
                      <div className="flex gap-0.5">
                        <Muted>
                          {item.startTime &&
                            format(new Date(item.startTime), 'd MMM, yyyy')}
                          —
                          {item.endTime &&
                            format(new Date(item.endTime), 'd MMM, yyyy')}
                        </Muted>
                      </div>
                    ) : (
                      <>
                        {item.dateTime && (
                          <Muted>
                            {format(new Date(item.dateTime), 'd MMM, yyyy')}
                          </Muted>
                        )}
                      </>
                    )}

                    <div className="ml-auto">
                      <Badge variant="secondary">{item.collectionTitle}</Badge>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        <div className="h-full">
          <div className="relative h-full">
            {bounds && (
              <div className="z-10 absolute top-0 inset-x-0 p-8 flex justify-center">
                <Button variant="secondary" onClick={setSearchBounds}>
                  Search this area
                </Button>
              </div>
            )}
            <Map
              mapboxAccessToken={MAPBOX_TOKEN}
              // hackerino: 100vh minus top bar. Mapbox won't fill % height
              style={{ height: 'calc(100vh - 64px)', width: '50vw' }}
              mapStyle="mapbox://styles/mapbox/streets-v12"
              initialViewState={{
                longitude: 4.897,
                latitude: 52.377,
                zoom: 9,
              }}
              onMoveEnd={handleMoveEnd}
              onMouseMove={handleMapHover}
              onMouseOut={() => setHoveredItemIds([])}
              interactiveLayerIds={['data-fill']}
            >
              <Source type="geojson" data={data}>
                <Layer
                  id="data-line"
                  type="line"
                  paint={{
                    'line-color': '#d53e4f',
                    'line-width': 2,
                  }}
                />
                <Layer
                  id="data-line-highlighted"
                  type="line"
                  paint={{
                    'line-color': '#00ff00',
                    'line-width': 2,
                  }}
                  filter={['in', 'id', hoveredItemIds?.[0] ?? '']}
                />

                <Layer
                  id="data-fill"
                  type="fill"
                  paint={{
                    'fill-color': '#d53e4f',
                    'fill-opacity': 0.2,
                  }}
                />
                <Layer
                  id="data-fill-highlighted"
                  type="fill"
                  paint={{
                    'fill-color': '#00ff00',
                    'fill-opacity': 0.2,
                  }}
                  filter={['in', 'id', hoveredItemIds?.[0] ?? '']}
                />
              </Source>
            </Map>
          </div>
        </div>
      </div>
    </>
  )
}
