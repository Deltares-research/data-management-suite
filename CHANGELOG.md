# Changelog

## [0.2.0](https://github.com/wolkwork/data-management-suite/compare/v0.1.0...v0.2.0) (2023-11-08)


### Features

* add end2end pytest in github actions pipeline ([aed6579](https://github.com/wolkwork/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* Add testing and releasing of python package to Github Action workflow ([#64](https://github.com/wolkwork/data-management-suite/issues/64)) ([aed6579](https://github.com/wolkwork/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))


### Bug Fixes

* add wait and healthcheck so pytests wait until webcontainer has started ([aed6579](https://github.com/wolkwork/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* change timeouts and pass correct database url for python end2end test ([aed6579](https://github.com/wolkwork/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* correct use of release step output to trigger package publishing ([#57](https://github.com/wolkwork/data-management-suite/issues/57)) ([d182400](https://github.com/wolkwork/data-management-suite/commit/d182400d149f46cb727e21df1a74df746c23ea93))
* **python:** Run github actions worflows for python package also when workflows change ([cfad619](https://github.com/wolkwork/data-management-suite/commit/cfad619c66d8031b50d45107facd5e2a5ef7a05b))
* run pytest only in 1 workflow and spin up docker image with webserver when testing ([aed6579](https://github.com/wolkwork/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* use correct config file name ([#72](https://github.com/wolkwork/data-management-suite/issues/72)) ([2016750](https://github.com/wolkwork/data-management-suite/commit/2016750fd023c604abab1a217fd1681c10e47b1b))
* users are no longer able to select catalogs they are not a member of when creating a collection ([fd4cbdd](https://github.com/wolkwork/data-management-suite/commit/fd4cbdd94bdc503bf5e24b14ef37f5c60c76b579))
