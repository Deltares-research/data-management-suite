from datetime import datetime, timezone

from geojson import Polygon

from deltares_datasuite.client import DataManagementSuiteClient
from deltares_datasuite.core import DataManagementSuiteItem

# Define the necessary variables
dms_url = (
    "https://ca-dms-dev-web.greenmushroom-03589694.westeurope.azurecontainerapps.io"
)

api_key = ""

client = DataManagementSuiteClient(dms_url, api_key)


item_name = "Fair data - numerical models item"
item_description = "This project was a very complex model of the Dutch water system. After running the model the metadata is automatically uploaded to the Data Management Suite."
project_number = "11209789"
data_location = "s3://Minio_on_P_Drive/"
license = "MIT"

other_properties = {"Awesomeness": "Very high", "DataSize": "1.5Tb"}

# Find the collection ID of the collection you want to add the item to in the URL when editing the Collection in the DMS
collectionId = ""

# Create a DMSItem object
dms_item = DataManagementSuiteItem(
    # id="3bc99da9-5feb-428a-827a-6b26b43830bf",
    title=item_name,
    projectNumber=project_number,
    description=item_description,
    location=data_location,
    license=license,
    collection=collectionId,
    geometry=Polygon(
        coordinates=[
            [
                [5.119014591, 52.378756326],
                [5.026268967, 52.340002388],
                [5.092980732, 52.342487635],
                [5.12796373, 52.328071261],
                [5.144234892, 52.332048661],
                [5.129590846, 52.339008251],
                [5.128777288, 52.365345348],
                [5.119014591, 52.378756326],
            ]
        ],
    ),
    properties=other_properties,
    datetime=datetime.now(tz=timezone.utc),
)

# Submit the DMSItem object
updated_item = client.create_or_update_item(dms_item)

print(updated_item.id)
