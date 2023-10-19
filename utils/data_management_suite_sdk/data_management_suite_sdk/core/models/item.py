from typing import Any, Dict, List, Optional, Type, Union

# avoids conflicts since there are also kwargs and attrs called `datetime`
from datetime import datetime as Datetime
from geojson.geometry import Polygon
from pystac import Asset, Collection, Item


class DataManagementSuiteItem(Item):
    # We set the id to be optional because we want to be able to create an item
    # and let the Datamanagement suite assign the id
    id: Optional[str] = None

    # The following attributes we add to the "properties" of the stac item
    title: str
    projectNumber: str
    description: Optional[str] = ""
    location: str
    license: Optional[str] = None


    def __init__(
        self,
        title: str,
        projectNumber: str,
        location: str,
        description: str,
        license: str,
        collection: str,
        geometry: Optional[Dict[str, Any]],
        properties: Dict[str, Any],
        id: Optional[str] = None,
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
            assets=assets
        )

        self.properties["title"] = title
        self.properties["projectNumber"] = projectNumber
        self.properties["description"] = description
        self.properties["location"] = location
        self.properties["license"] = license

    
    @classmethod
    def from_dict(
            cls: Type["DataManagementSuiteItem"],
            item_dict: dict) -> "DataManagementSuiteItem":
        """
        Create a DMSItem from a dictionary
        :param item_dict: The dictionary to create the DMSItem from
        :return: The DMSItem
        """
        stac_item = Item.from_dict(item_dict)

        if "collectionId" in item_dict:
            collection_id = item_dict["collectionId"]
        else:
            collection_link = stac_item.get_single_link("collection")
            #fetch collection id from collection link if possible
            if collection_link:
                collection_id = str(collection_link.target).split('/')[-1]
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
            assets=stac_item.assets
        )
        
        return item

    def to_dict(self) -> dict:

        item_dict = super().to_dict()
        del item_dict['collection']
        item_dict["collectionId"] = self.collection_id

        return item_dict

