from typing import Any

from pystac import Extent, SpatialExtent, TemporalExtent

TEST_LABEL_CATALOG = {
    "country-1": {
        "area-1-1": {
            "dsm": "area-1-1_dsm.tif",
            "ortho": "area-1-1_ortho.tif",
            "labels": "area-1-1_labels.geojson",
        },
        "area-1-2": {
            "dsm": "area-1-2_dsm.tif",
            "ortho": "area-1-2_ortho.tif",
            "labels": "area-1-2_labels.geojson",
        },
    },
    "country-2": {
        "area-2-1": {
            "dsm": "area-2-1_dsm.tif",
            "ortho": "area-2-1_ortho.tif",
            "labels": "area-2-1_labels.geojson",
        },
        "area-2-2": {
            "dsm": "area-2-2_dsm.tif",
            "ortho": "area-2-2_ortho.tif",
            "labels": "area-2-2_labels.geojson",
        },
    },
}

ARBITRARY_GEOM: dict[str, Any] = {
    "type": "Polygon",
    "coordinates": [
        [
            [-2.5048828125, 3.8916575492899987],
            [-1.9610595703125, 3.8916575492899987],
            [-1.9610595703125, 4.275202171119132],
            [-2.5048828125, 4.275202171119132],
            [-2.5048828125, 3.8916575492899987],
        ]
    ],
}

ARBITRARY_BBOX: list[float] = [
    ARBITRARY_GEOM["coordinates"][0][0][0],
    ARBITRARY_GEOM["coordinates"][0][0][1],
    ARBITRARY_GEOM["coordinates"][0][1][0],
    ARBITRARY_GEOM["coordinates"][0][1][1],
]

ARBITRARY_EXTENT = Extent(
    spatial=SpatialExtent.from_coordinates(ARBITRARY_GEOM["coordinates"]),
    temporal=TemporalExtent.from_now(),
)
