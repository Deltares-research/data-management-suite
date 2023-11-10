# Changelog

## [0.3.0](https://github.com/Deltares-research/data-management-suite/compare/data-management-suite-v0.2.0...data-management-suite-v0.3.0) (2023-11-10)


### :rocket: Features

* add end2end pytest in github actions pipeline ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* add python docs ([#15](https://github.com/Deltares-research/data-management-suite/issues/15)) ([f180371](https://github.com/Deltares-research/data-management-suite/commit/f1803716085bba0cfa8b00a5e38ffa9d59428bbb))
* Add sidebar menu ([#76](https://github.com/Deltares-research/data-management-suite/issues/76)) ([b3986c3](https://github.com/Deltares-research/data-management-suite/commit/b3986c32b7622b10d36335aa3154e17a2421afb9))
* Add testing and releasing of python package to Github Action workflow ([#64](https://github.com/Deltares-research/data-management-suite/issues/64)) ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))


### :wrench: Bug Fixes & Refactoring

* add wait and healthcheck so pytests wait until webcontainer has started ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* change timeouts and pass correct database url for python end2end test ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* correct use of release step output to trigger package publishing ([#57](https://github.com/Deltares-research/data-management-suite/issues/57)) ([d182400](https://github.com/Deltares-research/data-management-suite/commit/d182400d149f46cb727e21df1a74df746c23ea93))
* **python:** Run github actions worflows for python package also when workflows change ([cfad619](https://github.com/Deltares-research/data-management-suite/commit/cfad619c66d8031b50d45107facd5e2a5ef7a05b))
* run pytest only in 1 workflow and spin up docker image with webserver when testing ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* use correct config file name ([#72](https://github.com/Deltares-research/data-management-suite/issues/72)) ([2016750](https://github.com/Deltares-research/data-management-suite/commit/2016750fd023c604abab1a217fd1681c10e47b1b))
* users are no longer able to select catalogs they are not a member of when creating a collection ([fd4cbdd](https://github.com/Deltares-research/data-management-suite/commit/fd4cbdd94bdc503bf5e24b14ef37f5c60c76b579))


### :package: Testing & CI/CD

* add dependency update section to changelog ([2fb60dc](https://github.com/Deltares-research/data-management-suite/commit/2fb60dc60e47ca4befdbfd292884a1c4ec1c1a02))
* add permissions to upload test-results ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* await all expect statements in e2e tests ([b3986c3](https://github.com/Deltares-research/data-management-suite/commit/b3986c32b7622b10d36335aa3154e17a2421afb9))
* create separate release pull request with more emoji headings ([#16](https://github.com/Deltares-research/data-management-suite/issues/16)) ([d72d025](https://github.com/Deltares-research/data-management-suite/commit/d72d025b1793936f44662053215c8c42d15e2754))
* disable python end2end test ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* fix release draft action ([32dc53e](https://github.com/Deltares-research/data-management-suite/commit/32dc53ed61756a20d19f9dacda98a167a8202b5d))
* only build container when pushing to main ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* **python:** add automatic pushing of package to pypi ([8a26444](https://github.com/Deltares-research/data-management-suite/commit/8a264441e32d01a48878750fae52f08b08047346))
* **python:** only run tests on push ([ede7f56](https://github.com/Deltares-research/data-management-suite/commit/ede7f5609a293df2f00aa77c740905bb6c9ec80c))
* **python:** remove second release draft workflow ([d6f9891](https://github.com/Deltares-research/data-management-suite/commit/d6f9891db07e3ce6028aee38bba1a4cff5e12af8))
* **python:** use tags to release multiple packages ([eca87a7](https://github.com/Deltares-research/data-management-suite/commit/eca87a7a607269ed70d7c4579f896535c991efdb))
* Release CICD improvements  ([f7f1223](https://github.com/Deltares-research/data-management-suite/commit/f7f122368b49202de8bc496bac1260d10477108d))
* rename workflows ([a969c63](https://github.com/Deltares-research/data-management-suite/commit/a969c63b73c6c45a287890895dfac8ca5126eb20))
* trigger python test ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))


### :arrow_up: Dependencies updates

* Upgrade to remix v2 ([#13](https://github.com/Deltares-research/data-management-suite/issues/13))  ([d138f5d](https://github.com/Deltares-research/data-management-suite/commit/d138f5dba40a87fd19f52f48e779231f72e5c806))

## [0.2.0](https://github.com/Deltares-research/data-management-suite/compare/v0.1.0...v0.2.0) (2023-11-08)

### Features

- add end2end pytest in github actions pipeline ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
- Add testing and releasing of python package to Github Action workflow ([#64](https://github.com/Deltares-research/data-management-suite/issues/64)) ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))

### Bug Fixes

- add wait and healthcheck so pytests wait until webcontainer has started ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
- change timeouts and pass correct database url for python end2end test ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
- correct use of release step output to trigger package publishing ([#57](https://github.com/Deltares-research/data-management-suite/issues/57)) ([d182400](https://github.com/Deltares-research/data-management-suite/commit/d182400d149f46cb727e21df1a74df746c23ea93))
- **python:** Run github actions worflows for python package also when workflows change ([cfad619](https://github.com/Deltares-research/data-management-suite/commit/cfad619c66d8031b50d45107facd5e2a5ef7a05b))
- run pytest only in 1 workflow and spin up docker image with webserver when testing ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
- use correct config file name ([#72](https://github.com/Deltares-research/data-management-suite/issues/72)) ([2016750](https://github.com/Deltares-research/data-management-suite/commit/2016750fd023c604abab1a217fd1681c10e47b1b))
- users are no longer able to select catalogs they are not a member of when creating a collection ([fd4cbdd](https://github.com/Deltares-research/data-management-suite/commit/fd4cbdd94bdc503bf5e24b14ef37f5c60c76b579))
