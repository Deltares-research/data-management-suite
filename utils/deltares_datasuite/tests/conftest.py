import hashlib
import uuid
from datetime import datetime

import psycopg
import pytest
from psycopg import Connection
from pystac import Item

from deltares_datasuite import DataManagementSuiteClient
from tests.utils.test_cases import ARBITRARY_BBOX, ARBITRARY_GEOM


@pytest.fixture
def item() -> Item:
    return Item("test-item", ARBITRARY_GEOM, ARBITRARY_BBOX, datetime.now(), {})


@pytest.fixture
def db_connection() -> Connection:
    connection = psycopg.connect("postgresql://postgres:postgres@localhost:5432/remix")

    yield connection

    connection.close()


@pytest.fixture
def db_user(db_connection: Connection):
    cur = db_connection.cursor()
    person_id = str(uuid.uuid4())
    cur.execute(
        f"INSERT INTO \"Person\" (id, name, email) VALUES ('{person_id}', 'Test User', '{person_id}-test@wolk.work');"
    )
    db_connection.commit()
    yield person_id

    cur.execute(f"DELETE FROM \"Person\" WHERE id = '{person_id}'")
    db_connection.commit()


@pytest.fixture
def db_api_key(db_connection: Connection, db_user: str):
    cur = db_connection.cursor()
    key = str(uuid.uuid4())
    hashed_key = hashlib.sha256(key.encode("utf-8")).hexdigest()
    cur.execute(
        f"INSERT INTO \"ApiKey\" (key, \"personId\", id, name) VALUES ('{hashed_key}', '{db_user}', '{key}', 'test_api_key')"
    )
    db_connection.commit()
    yield key

    cur.execute(f"DELETE FROM \"ApiKey\" WHERE id = '{key}'")
    db_connection.commit()


@pytest.fixture
def db_catalog(db_connection: Connection):
    cur = db_connection.cursor()
    catalog_id = str(uuid.uuid4())
    cur.execute(
        f"INSERT INTO \"Catalog\" (id, title, description, access) VALUES ('{catalog_id}', 'Test Catalog', 'This is a test catalog', 'PRIVATE');"
    )
    db_connection.commit()
    yield catalog_id

    cur.execute(f"DELETE FROM \"Catalog\" WHERE id = '{catalog_id}'")
    db_connection.commit()


@pytest.fixture
def db_collection(db_connection: Connection, db_catalog: str):
    cur = db_connection.cursor()
    collection_id = str(uuid.uuid4())
    cur.execute(
        f"INSERT INTO \"Collection\" (id, title, description, access, \"catalogId\", \"updatedAt\") VALUES ('{collection_id}', 'Test Collection', 'This is a test collection', 'PRIVATE', '{db_catalog}', '{datetime.now().isoformat()}');"
    )
    db_connection.commit()
    yield collection_id

    cur.execute(f"DELETE FROM \"Collection\" WHERE id = '{collection_id}'")
    db_connection.commit()


@pytest.fixture
def dms_client(db_api_key: str):
    yield DataManagementSuiteClient("http://localhost", db_api_key)
