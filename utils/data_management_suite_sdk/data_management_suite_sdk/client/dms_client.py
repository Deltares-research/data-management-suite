
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
    def submit_stac_item(self, stac_item):
        """
        Submit a metadata item to the DMS
        :param stac_item: The STAC item to submit
        :return: The response from the DMS
        """
        # Create the request
        request = self._create_request(stac_item)

        # Submit the request
        response = self._submit_request(request)

        # Return the response
        return response