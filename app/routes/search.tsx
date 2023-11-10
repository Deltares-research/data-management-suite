import type {
  LinksFunction,
  LoaderFunctionArgs,
  V2_MetaFunction,
} from '@remix-run/node'
import type { MapLayerMouseEvent, ViewStateChangeEvent } from 'react-map-gl'
import Map, { Layer, Source } from 'react-map-gl'
import mapboxStyles from 'mapbox-gl/dist/mapbox-gl.css'
import {
  Form,
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from '@remix-run/react'
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
import { BookOpen, Loader2, Search, Sliders } from 'lucide-react'
import { z } from 'zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet'
import { getHost } from '~/routes'
import { loader as searchLoader } from '~/routes/api.search'

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

export let searchQuerySchema = {
  bbox: z
    .string()
    .optional()
    .describe('JSON stringified representation of a bbox'),
  q: z.string().optional().describe('Will search item title and description'),
}

export async function loader(args: LoaderFunctionArgs) {
  let data = await searchLoader(args)

  return {
    data,
    host: getHost(args.request),
  }
}

export default function SearchPage() {
  let { data, host } = useLoaderData<typeof loader>()

  let [searchParams, setSearchParams] = useSearchParams()
  let [bounds, setBounds] = React.useState<mapboxgl.LngLatBounds>()
  let [hoveredItemIds, setHoveredItemIds] = React.useState<string[]>([])

  function handleMoveEnd(e: ViewStateChangeEvent) {
    let newBounds = e.target.getBounds()

    setSearchParams(csp => {
      csp.set('bbox', JSON.stringify([...newBounds.toArray().flat()]))

      return csp
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

  let qId = React.useId()
  let navigation = useNavigation()

  return (
    <div className="grid grid-cols-2" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="h-full overflow-auto relative">
        {navigation.state === 'loading' && (
          <div className="absolute inset-0 bg-white/70 animate-in z-10 flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        )}
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
                  <Button type="button" variant="outline">
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
            <H3>{data.features.length} Results</H3>
          </div>
          <div className="mt-6 flex flex-col gap-8">
            {data.features.map(({ properties, ...item }) => (
              <Link
                key={item.id}
                to={`https://radiantearth.github.io/stac-browser/#/external/${host}/stac/items/${item.id}`}
                target="_blank"
                rel="noopener"
              >
                <Card
                  onMouseEnter={() => setHoveredItemIds([item.id])}
                  onMouseLeave={() => setHoveredItemIds([])}
                  className={
                    hoveredItemIds.includes(item.id) ? 'border-green-500' : ''
                  }
                >
                  <CardHeader>
                    <CardTitle>{properties.title}</CardTitle>
                    <Muted className="flex items-center mt-0.5">
                      <BookOpen className="w-4 h-4 mr-1.5" />{' '}
                      {item.catalogTitle}
                    </Muted>
                    <CardDescription>{properties.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <div className="w-full flex justify-between gap-8 items-center">
                      {properties.startTime && properties.endTime ? (
                        <div className="flex gap-0.5">
                          <Muted>
                            {properties.startTime &&
                              format(
                                new Date(properties.startTime),
                                'd MMM, yyyy',
                              )}
                            —
                            {properties.endTime &&
                              format(
                                new Date(properties.endTime),
                                'd MMM, yyyy',
                              )}
                          </Muted>
                        </div>
                      ) : (
                        <>
                          {properties.dateTime && (
                            <Muted>
                              {format(
                                new Date(properties.dateTime),
                                'd MMM, yyyy',
                              )}
                            </Muted>
                          )}
                        </>
                      )}

                      <div className="ml-auto">
                        <Badge variant="secondary">
                          {item.collectionTitle}
                        </Badge>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
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
  )
}
