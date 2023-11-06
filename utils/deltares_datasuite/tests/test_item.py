from pystac import Item

from deltares_datasuite import DataManagementSuiteItem


def test_item(item: Item) -> None:
    # test to see if a item is correctly created from a dict
    item_dict = item.to_dict()
    item_dict["properties"]["title"] = "test"
    item_dict["properties"]["projectNumber"] = "12345"
    item_dict["properties"]["description"] = "test description"
    item_dict["properties"]["location"] = "test location"
    item_dict["properties"]["license"] = "test license"

    item_from_dict = DataManagementSuiteItem.from_dict(item_dict)
    assert item_from_dict.title == "test"
    assert item_from_dict.projectNumber == "12345"
    assert item_from_dict.description == "test description"
    assert item_from_dict.location == "test location"
