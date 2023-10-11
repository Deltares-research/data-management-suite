from typing import Any, Dict, List, Optional

from datetime import datetime
from geojson.geometry import Polygon


class DataManagementSuiteItem:

    id: Optional[str] = None

    title: str

    projectNumber: str

    description: Optional[str] = ""

    location: str

    license: Optional[str] = None

    keywords: Optional[List[str]] = []

    collectionId: str

    geometry: Polygon

    properties: Optional[Dict[str, Any]] = None

    start_datetime: datetime = None

    end_datetime: Optional[datetime] = None


    def __init__(
        self,
        title: str,
        projectNumber: str,
        location: str,
        collectionId: str,
        start_datetime: datetime,
        id: Optional[str] = None,
        geometry: Optional[Polygon] = None,
        description: Optional[str] = None,
        license: Optional[str] = None,
        keywords: Optional[List[str]] = None,
        properties: Optional[Dict[str, Any]] = None,
        end_datetime: Optional[datetime] = None,
    ):
        if geometry and not geometry.is_valid:
            raise ValueError("Geometry is not valid")
        self.id = id
        self.title = title
        self.projectNumber = projectNumber
        self.description = description
        self.location = location
        self.license = license
        self.keywords = keywords
        self.collectionId = collectionId
        self.geometry = geometry
        self.properties = properties
        self.start_datetime = start_datetime
        self.end_datetime = end_datetime
    
    @classmethod
    def from_dict(cls, item_dict: dict) -> "DataManagementSuiteClient":
        """
        Create a DMSItem from a dictionary
        :param item_dict: The dictionary to create the DMSItem from
        :return: The DMSItem
        """
        id = item_dict.get("id")
        title = item_dict["title"]
        projectNumber = item_dict["projectNumber"]
        description = item_dict.get("description")
        location = item_dict["location"]
        license = item_dict.get("license")
        keywords = item_dict.get("keywords")
        collectionId = item_dict["collectionId"]
        geometry = Polygon.to_instance(item_dict["geometry"]) if "geometry" in item_dict else None
        properties = item_dict.get("properties")

        if item_dict["dateTime"] is not None:
            start_datetime = datetime.fromisoformat(item_dict["dateTime"])
        else:
            start_datetime = datetime.fromisoformat(item_dict["startTime"])

        if ("endTime" in item_dict) and (item_dict["endTime"] is not None):
            end_datetime = datetime.fromisoformat(item_dict["endTime"])
        else:
            end_datetime = None

        return cls(
            id=id,
            title=title,
            projectNumber=projectNumber,
            description=description,
            location=location,
            license=license,
            keywords=keywords,
            collectionId=collectionId,
            geometry=geometry,
            properties=properties,
            start_datetime=start_datetime,
            end_datetime=end_datetime
        )

    def to_dict(self) -> dict:

        if self.start_datetime.tzinfo is None:
            raise ValueError("Start datetime must have a timezone")
        
        if self.end_datetime and self.end_datetime.tzinfo is None:
            raise ValueError("End datetime must have a timezone")
        
        item_dict = {
            "title": self.title,
            "projectNumber": self.projectNumber,
            "geometry": self.geometry,
            "location": self.location,
            "collectionId": self.collectionId,
            "dateRange": {
                "from": self.start_datetime.isoformat()
            }
        }

        if self.description:
            item_dict["description"] = self.description
        
        if self.license:
            item_dict["license"] = self.license
        
        if self.keywords:
            item_dict["keywords"] = self.keywords

        if self.properties:
            item_dict["properties"] = self.properties

        if self.end_datetime:
            item_dict["dateRange"]["to"] = self.end_datetime.isoformat()

        return item_dict

