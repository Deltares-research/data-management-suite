import MapboxDraw from '@mapbox/mapbox-gl-draw'
import type { FeatureCollection } from 'geojson'
import React from 'react'
import { useControl } from 'react-map-gl'

import type { ControlPosition } from 'react-map-gl'

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition
  initialFeature?: FeatureCollection

  onCreate?: (evt: { features: object[] }) => void
  onUpdate?: (evt: { features: object[]; action: string }) => void
  onDelete?: (evt: { features: object[] }) => void
}

export default function DrawControl(props: DrawControlProps) {
  let draw = useControl<MapboxDraw>(
    () => new MapboxDraw(props),
    ({ map }) => {
      map.on('draw.create', props.onCreate)
      map.on('draw.update', props.onUpdate)
      map.on('draw.delete', props.onDelete)
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

  let hasRun = React.useRef(false)
  React.useEffect(() => {
    if (!hasRun.current) {
      if (props.initialFeature) draw.add(props.initialFeature)
      hasRun.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

DrawControl.defaultProps = {
  onCreate: () => {},
  onUpdate: () => {},
  onDelete: () => {},
}
