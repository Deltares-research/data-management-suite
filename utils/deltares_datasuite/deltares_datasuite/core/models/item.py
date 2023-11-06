from typing import Any, Dict, List, Optional, Type, Union

# avoids conflicts since there are also kwargs and attrs called `datetime`
from datetime import datetime as Datetime

from geojson import Polygon
from pystac import Asset, Catalog, Item


class DataManagementSuiteItem(Item):
    # We set the id to be optional because we want to be able to create an item
    # and let the Datamanagement suite assign the id
    id: str = ""

    def __init__(
        self,
        title: str,
        projectNumber: str,
        location: str,
        description: str,
        license: str,
        collection: str,
        geometry: Polygon,
        properties: Dict[str, Any],
        id: str = "",
        bbox: Optional[List[float]] = None,
        datetime: Optional[Datetime] = None,
        start_datetime: Optional[Datetime] = None,
        end_datetime: Optional[Datetime] = None,
        stac_extensions: Optional[List[str]] = None,
        href: Optional[str] = None,
        extra_fields: Optional[Dict[str, Any]] = None,
        assets: Optional[Dict[str, Asset]] = None,
        **kwargs: Any,
    ):
        super().__init__(
            id=id,
            geometry=geometry,
            bbox=bbox,
            datetime=datetime,
            collection=collection,
            properties=properties,
            start_datetime=start_datetime,
            end_datetime=end_datetime,
            stac_extensions=stac_extensions,
            href=href,
            extra_fields=extra_fields,
            assets=assets,
        )

        self.properties["title"] = title
        self.properties["projectNumber"] = projectNumber
        self.properties["description"] = description
        self.properties["location"] = location
        self.properties["license"] = license

    @property
    def title(self) -> str:
        """Title of the item.

        Returns:
            str: title of the item
        """
        return str(self.properties["title"])

    @property
    def projectNumber(self) -> str:
        """Project number of the item.

        Returns:
            str: project number of the item
        """
        return str(self.properties["projectNumber"])

    @property
    def description(self) -> str:
        """Description of the item.

        Returns:
            str: description of the item
        """
        return str(self.properties["description"])

    @property
    def location(self) -> str:
        """Location of the data

        Returns:
            str: location of the data
        """
        return str(self.properties["location"])

    @property
    def license(self) -> str:
        """License of the item

        Returns:
            str: license of the item
        """
        return str(self.properties["license"])

    @classmethod
    def from_dict(
        cls: Type["DataManagementSuiteItem"],
        d: Dict[str, Any],
        href: Optional[str] = None,
        root: Optional[Catalog] = None,
        migrate: bool = False,
        preserve_dict: bool = True,
    ) -> "DataManagementSuiteItem":
        """Instantiate a DataManagementSuiteItem from a dict.

        Args:
            d (Dict[str, Any]): dict to convert to DataManagementSuiteItem
            href (Optional[str], optional): Optional href for this item. Defaults to None.
            root (Optional[Catalog], optional): Optional root Catalog reference. Defaults to None.
            migrate (bool): If true migrate to latest STAC version. Defaults to False.
            preserve_dict (bool): If True the dict is not adjusted in place. Defaults to True.

        Returns:
            DataManagementSuiteItem: instantiated DataManagementSuiteItem
        """
        stac_item: Item = Item.from_dict(d, href, root, migrate, preserve_dict)

        if "collectionId" in d:
            collection_id = d["collectionId"]
        else:
            collection_link = stac_item.get_single_link("collection")
            # fetch collection id from collection link if possible
            if collection_link:
                collection_id = str(collection_link.target).split("/")[-1]
            else:
                collection_id = None

        item = cls(
            title=stac_item.properties["title"],
            projectNumber=stac_item.properties["projectNumber"],
            description=stac_item.properties["description"],
            location=stac_item.properties["location"],
            license=stac_item.properties["license"],
            collection=collection_id,
            id=stac_item.id,
            geometry=stac_item.geometry,
            bbox=stac_item.bbox,
            datetime=stac_item.datetime,
            properties=stac_item.properties,
            stac_extensions=stac_item.stac_extensions,
            extra_fields=stac_item.extra_fields,
            assets=stac_item.assets,
        )

        return item
