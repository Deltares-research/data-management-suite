import React, { useState, useCallback } from 'react'
import Map from 'react-map-gl'

import DrawControl from './DrawControl'
import type { Feature, Polygon } from 'geojson'
import { useField } from 'remix-validated-form'
import { ErrorMessage } from '../typography'

// TODO: Get token from BE
const MAPBOX_TOKEN =
  'pk.eyJ1Ijoicm9iZXJ0YnJvZXJzbWEiLCJhIjoiY2tjMjVwbnRuMjBoMjM0bXh1eHR5d2o0YSJ9.xZxWCeY2LEaGHDzME5JqfA'

export function BoundsSelector({ name }: { name: string }) {
  let { defaultValue } = useField(`${name}`)
  let { error } = useField(`${name}.coordinates`)

  const [feature, setFeature] = useState<Feature<Polygon> | undefined>(
    defaultValue?.type === 'Polygon'
      ? {
          type: 'Feature',
          properties: {},
          geometry: defaultValue,
          id: '1',
        }
      : undefined,
  )

  // @ts-expect-error
  const onUpdate = useCallback(e => {
    for (const f of e.features) {
      return setFeature(f)
    }
  }, [])

  // @ts-expect-error
  const onDelete = useCallback(e => {
    setFeature(undefined)
  }, [])

  return (
    <div data-testid="geometry-selector" className="rounded-xl overflow-hidden">
      <input type="hidden" name={`${name}.type`} value="Polygon" />
      {feature?.geometry?.coordinates.map((polygon, polygonIndex) =>
        (Array.isArray(polygon) ? polygon : [polygon]).map(
          (point, pointIndex) => (
            <React.Fragment key={`${polygonIndex}-${pointIndex}`}>
              <input
                type="hidden"
                name={`${name}.coordinates[${polygonIndex}][${pointIndex}][0]`}
                value={point[0]}
              />
              <input
                type="hidden"
                name={`${name}.coordinates[${polygonIndex}][${pointIndex}][1]`}
                value={point[1]}
              />
            </React.Fragment>
          ),
        ),
      )}

      <Map
        style={{ height: 400 }}
        initialViewState={{
          longitude: 4.897,
          latitude: 52.377,
          zoom: 9,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
        customAttribution=""
      >
        <DrawControl
          initialFeature={defaultValue}
          position="top-left"
          displayControlsDefault={false}
          controls={{
            polygon: true,
            trash: true,
          }}
          defaultMode="draw_polygon"
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </Map>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  )
}
