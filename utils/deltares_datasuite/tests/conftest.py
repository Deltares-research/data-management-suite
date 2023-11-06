from datetime import datetime

import pytest
from pystac import Item

from tests.utils.test_cases import ARBITRARY_BBOX, ARBITRARY_GEOM


@pytest.fixture
def item() -> Item:
    return Item("test-item", ARBITRARY_GEOM, ARBITRARY_BBOX, datetime.now(), {})
