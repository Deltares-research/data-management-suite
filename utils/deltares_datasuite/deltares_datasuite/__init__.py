# mypy: disable-error-code="attr-defined"
"""Python package to easily work with STAC items in the Deltares Data Management Suite"""

import sys
from importlib import metadata as importlib_metadata

from deltares_datasuite.client import DataManagementSuiteClient
from deltares_datasuite.core import DataManagementSuiteItem


def get_version() -> str:
    try:
        return importlib_metadata.version(__name__)
    except importlib_metadata.PackageNotFoundError:  # pragma: no cover
        return "unknown"


version: str = get_version()

__all__ = [
    "version",
    "DataManagementSuiteItem",
    "DataManagementSuiteClient",
]
