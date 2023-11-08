from datetime import datetime, timezone

from psycopg import Connection

from deltares_datasuite import DataManagementSuiteClient, DataManagementSuiteItem

# def test_create_item(
#     dms_client: DataManagementSuiteClient, db_collection: str, db_connection: Connection
# ):
#     saved_item = dms_client.create_item(
#         DataManagementSuiteItem(
#             title="Test Item",
#             projectNumber="11209789",
#             description="This is a test item, please work",
#             location="s3://Minio_on_P_Drive/Python_SDK_test_item",
#             license="MIT",
#             collection=db_collection,
#             geometry={
#                 "type": "Polygon",
#                 "coordinates": [
#                     [
#                         [5.119014591, 52.378756326],
#                         [5.026268967, 52.340002388],
#                         [5.092980732, 52.342487635],
#                         [5.12796373, 52.328071261],
#                         [5.144234892, 52.332048661],
#                         [5.129590846, 52.339008251],
#                         [5.128777288, 52.365345348],
#                         [5.119014591, 52.378756326],
#                     ]
#                 ],
#             },
#             properties={"This": "is", "a": "Test"},
#             datetime=datetime.now(tz=timezone.utc),
#         )
#     )

#     assert saved_item.id is not None

#     cur = db_connection.cursor()
#     cur.execute(f"DELETE FROM \"Item\" WHERE id = '{saved_item.id}'")
