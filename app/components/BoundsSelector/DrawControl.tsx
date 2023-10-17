import MapboxDraw from '@mapbox/mapbox-gl-draw'
import type { Geometry } from 'geojson'
import React from 'react'
import { useControl } from 'react-map-gl'

import type { ControlPosition } from 'react-map-gl'

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition
  initialFeature?: Geometry

  onCreate?: (evt: { features: object[] }) => void
  onUpdate?: (evt: { features: object[]; action: string }) => void
  onDelete?: (evt: { features: object[] }) => void
}

export default function DrawControl(props: DrawControlProps) {
  let hasRun = React.useRef(false)

  let draw = useControl<MapboxDraw>(
    () => new MapboxDraw(props),
    ({ map }) => {
      // @ts-expect-error TODO: Fix types
      map.on('draw.create', props.onCreate)
      // @ts-expect-error TODO: Fix types
      map.on('draw.update', props.onUpdate)
      // @ts-expect-error TODO: Fix types
      map.on('draw.delete', props.onDelete)

      function setupInitialGeometry() {
        if (props.initialFeature && !hasRun.current) {
          draw.add(props.initialFeature)
        }

        hasRun.current = true
        map.off('load', setupInitialGeometry)
      }

      map.on('load', setupInitialGeometry)
    },
    ({ map }) => {
      map.off('draw.create', props.onCreate)
      map.off('draw.update', props.onUpdate)
      map.off('draw.delete', props.onDelete)
    },
    {
      position: props.position,
    },
  )

  return null
}

DrawControl.defaultProps = {
  onCreate: () => {},
  onUpdate: () => {},
  onDelete: () => {},
}
