import requests
from ..core import DataManagementSuiteItem
class DataManagementSuiteClient(object):
    """
    Client for the Data Management Suite
    """

    _dms_url: str = None
    _dms_api_key: str = None

    def __init__(self, dms_url, dms_api_key):
        self._dms_url = dms_url
        self._dms_api_key = dms_api_key

    #function to submit a STAC item to the DMS
    def create_item(self, stac_item: DataManagementSuiteItem)-> DataManagementSuiteItem:
        """
        Submit a metadata item to the DMS
        :param stac_item: The STAC item to submit
        :return: The response from the DMS
        """

        if stac_item.id is not None:
            raise ValueError("Cannot submit an item that already has an ID")

        response = self._make_request("POST", "api/items", json=stac_item.to_dict())
        response.raise_for_status()

        return DataManagementSuiteItem.from_dict(response.json())

    def update_item(self, item_id: str, stac_item: DataManagementSuiteItem) -> DataManagementSuiteItem:
        """
        Update a metadata item in the DMS
        :param item_id: The ID of the item to update
        :param stac_item: The STAC item to update
        :return: The response from the DMS
        """

        response = self._make_request(
            "PUT", f"api/items/{item_id}", json=stac_item.to_dict()
        )

        return DataManagementSuiteItem.from_dict(response.json())    

    def _make_request(self, method: str, endpoint: str, **kwargs) -> requests.Response:
        """
        Make a request to the DMS
        :param method: The HTTP method to use
        :param endpoint: The endpoint to request
        :param kwargs: The arguments to pass to the request
        :return: The response from the DMS
        """
        url = self._construct_url(endpoint)
        headers = self._get_default_headers()

        response = requests.request(method, url, headers=headers, **kwargs)

        return response

    def _construct_url(self, endpoint: str) -> str:
        """
        Construct a URL for the given endpoint
        :param endpoint: The endpoint to construct the URL for
        :return: The URL
        """
        return f"{self._dms_url}/{endpoint}"
    
    def _get_default_headers(self) -> dict:
        """
        Get the default headers for requests
        :return: The headers
        """
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self._dms_api_key}",
        }
    
