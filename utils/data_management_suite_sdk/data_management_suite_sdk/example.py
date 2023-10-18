from datetime import datetime, timezone
from geojson.geometry import Polygon

from data_management_suite_sdk.client import DataManagementSuiteClient
from data_management_suite_sdk.core import DataManagementSuiteItem

# Define the necessary variables
api_key = ""
dms_url = (
    "https://ca-dms-dev-web.greenmushroom-03589694.westeurope.azurecontainerapps.io"
)

client = DataManagementSuiteClient(dms_url, api_key)


item_name = "Python SDK test item"
item_description = "My first DMS item"

# Find the collection ID of the collection you want to add the item to in the URL when editing the Collection in the DMS
collectionId = ""

# Create a DMSItem object
dms_item = DataManagementSuiteItem(
    # id="3bc99da9-5feb-428a-827a-6b26b43830bf",
    title=item_name,
    projectNumber="11209789",
    description=item_description,
    location="s3://Minio_on_P_Drive/Python_SDK_test_item",
    license="MIT",
    collectionId=collectionId,
    geometry=Polygon(
        coordinates=[[
            [5.119014591, 52.378756326],
            [5.026268967, 52.340002388],
            [5.092980732, 52.342487635],
            [5.12796373, 52.328071261],
            [5.144234892, 52.332048661],
            [5.129590846, 52.339008251],
            [5.128777288, 52.365345348],
            [5.119014591, 52.378756326],
        ]],
    ),
    properties={"PROPERTY1": "VALUE1", "PROPERTY2": "VALUE2"},
    datetime=datetime.now(tz=timezone.utc),

)

# Submit the DMSItem object
updated_item = client.create_or_update_item(dms_item)

print(updated_item.id)