from typing import Any

import requests

from ..core import DataManagementSuiteItem


class DataManagementSuiteClient(object):
    """
    Client for the Data Management Suite
    """

    _dms_url: str
    _dms_api_key: str

    def __init__(self, dms_url: str, dms_api_key: str):
        """
        Args:
            dms_url (str): URL where the Data management suite is hosted
            dms_api_key (str): The API key to use for requests
        """
        self._dms_url = dms_url
        self._dms_api_key = dms_api_key

    def create_or_update_item(
        self, stac_item: DataManagementSuiteItem
    ) -> DataManagementSuiteItem:
        """Create or update a metadata item in the DMS

        Args:
            stac_item (DataManagementSuiteItem): The STAC item to create or update

        Returns:
            The response from the DMS
        """

        if not stac_item.id:
            # If the STAC item does not have an ID, create a new item
            return self.create_item(stac_item)
        else:
            # If the item exists has an id, update it
            return self.update_item(stac_item.id, stac_item)

    def create_item(
        self, stac_item: DataManagementSuiteItem
    ) -> DataManagementSuiteItem:
        """Create a metadata item in the DMS

        Args:
            stac_item (DataManagementSuiteItem): The STAC item to create or update

        Returns:
            The response from the DMS
        """

        response = self._make_request("POST", "api/items", json=stac_item.to_dict())
        if not response.ok:
            print(response.text)
            response.raise_for_status()
        return DataManagementSuiteItem.from_dict(response.json())

    def update_item(
        self, item_id: str, stac_item: DataManagementSuiteItem
    ) -> DataManagementSuiteItem:
        """Update a metadata item in the DMS

        Args:
            item_id (str): The ID of the item to update
            stac_item (DataManagementSuiteItem): The STAC item to create or update

        Returns:
            The response from the DMS
        """

        response = self._make_request(
            "PUT", f"api/items/{item_id}", json=stac_item.to_dict()
        )
        if not response.ok:
            print(response.text)
            response.raise_for_status()
        return DataManagementSuiteItem.from_dict(response.json())

    def _make_request(
        self, method: str, endpoint: str, **kwargs: Any
    ) -> requests.Response:
        """Make a request to the DMS

        Args:
            method (str): The HTTP method to use
            endpoint (str): The endpoint to request
            kwargs: The arguments to pass to the request

        Returns:
            The response from the DMS
        """
        url: str = self._construct_url(endpoint)
        headers = self._get_default_headers()

        response = requests.request(method, url, headers=headers, **kwargs)

        return response

    def _construct_url(self, endpoint: str) -> str:
        """Construct a URL for the given endpoint

        Args:
            endpoint (str): The endpoint to construct the URL for

        Returns:
            The constructed URL
        """
        return f"{self._dms_url}/{endpoint}"

    def _get_default_headers(self) -> dict[str, str]:
        """Get the default headers for requests

        Returns:
            The default headers
        """
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self._dms_api_key}",
        }
