# Changelog

## [0.4.0](https://github.com/Deltares-research/data-management-suite/compare/web-v0.3.0...web-v0.4.0) (2023-11-17)


### :rocket: Features

* add datadog to app and docker deployments ([#34](https://github.com/Deltares-research/data-management-suite/issues/34)) ([3d1e57b](https://github.com/Deltares-research/data-management-suite/commit/3d1e57bfa148d27c6122e95bd2dc74fa21c5f64d))
* add end2end pytest in github actions pipeline ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* add python docs ([#15](https://github.com/Deltares-research/data-management-suite/issues/15)) ([f180371](https://github.com/Deltares-research/data-management-suite/commit/f1803716085bba0cfa8b00a5e38ffa9d59428bbb))
* Add sidebar menu ([#76](https://github.com/Deltares-research/data-management-suite/issues/76)) ([b3986c3](https://github.com/Deltares-research/data-management-suite/commit/b3986c32b7622b10d36335aa3154e17a2421afb9))
* Add testing and releasing of python package to Github Action workflow ([#64](https://github.com/Deltares-research/data-management-suite/issues/64)) ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))


### :wrench: Bug Fixes & Refactoring

* add wait and healthcheck so pytests wait until webcontainer has started ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* change timeouts and pass correct database url for python end2end test ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* correct use of release step output to trigger package publishing ([#57](https://github.com/Deltares-research/data-management-suite/issues/57)) ([d182400](https://github.com/Deltares-research/data-management-suite/commit/d182400d149f46cb727e21df1a74df746c23ea93))
* fix start command used in prod ([#24](https://github.com/Deltares-research/data-management-suite/issues/24)) ([f015118](https://github.com/Deltares-research/data-management-suite/commit/f015118ea748b96b21db39da3e7857a77ca29530))
* **python:** Run github actions worflows for python package also when workflows change ([cfad619](https://github.com/Deltares-research/data-management-suite/commit/cfad619c66d8031b50d45107facd5e2a5ef7a05b))
* remove double search outcomes with query fix ([#45](https://github.com/Deltares-research/data-management-suite/issues/45)) ([5b1f2c5](https://github.com/Deltares-research/data-management-suite/commit/5b1f2c55f8a84124a4ae90731956e37fef25470c))
* run pytest only in 1 workflow and spin up docker image with webserver when testing ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* use correct config file name ([#72](https://github.com/Deltares-research/data-management-suite/issues/72)) ([2016750](https://github.com/Deltares-research/data-management-suite/commit/2016750fd023c604abab1a217fd1681c10e47b1b))
* users are no longer able to select catalogs they are not a member of when creating a collection ([fd4cbdd](https://github.com/Deltares-research/data-management-suite/commit/fd4cbdd94bdc503bf5e24b14ef37f5c60c76b579))


### :package: Testing & CI/CD

* add dependency update section to changelog ([2fb60dc](https://github.com/Deltares-research/data-management-suite/commit/2fb60dc60e47ca4befdbfd292884a1c4ec1c1a02))
* add permissions to upload test-results ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* add workflow to tag images when pushing tag or deployment branch ([8df2297](https://github.com/Deltares-research/data-management-suite/commit/8df2297d9669c8edcf74647bdac977b1c9bdc870))
* await all expect statements in e2e tests ([b3986c3](https://github.com/Deltares-research/data-management-suite/commit/b3986c32b7622b10d36335aa3154e17a2421afb9))
* create separate release pull request with more emoji headings ([#16](https://github.com/Deltares-research/data-management-suite/issues/16)) ([d72d025](https://github.com/Deltares-research/data-management-suite/commit/d72d025b1793936f44662053215c8c42d15e2754))
* disable python end2end test ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* dont run terraform plan on dependabot PR ([889ad56](https://github.com/Deltares-research/data-management-suite/commit/889ad5684371f5db64c79b3b0c3977f007d2a108))
* fix poetry publish by building first ([f428c7b](https://github.com/Deltares-research/data-management-suite/commit/f428c7be699c6114e760e637a028b82251ae636a))
* fix release draft action ([32dc53e](https://github.com/Deltares-research/data-management-suite/commit/32dc53ed61756a20d19f9dacda98a167a8202b5d))
* only build container when pushing to main ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* **python:** add automatic pushing of package to pypi ([8a26444](https://github.com/Deltares-research/data-management-suite/commit/8a264441e32d01a48878750fae52f08b08047346))
* **python:** only run tests on push ([ede7f56](https://github.com/Deltares-research/data-management-suite/commit/ede7f5609a293df2f00aa77c740905bb6c9ec80c))
* **python:** remove second release draft workflow ([d6f9891](https://github.com/Deltares-research/data-management-suite/commit/d6f9891db07e3ce6028aee38bba1a4cff5e12af8))
* **python:** use tags to release multiple packages ([eca87a7](https://github.com/Deltares-research/data-management-suite/commit/eca87a7a607269ed70d7c4579f896535c991efdb))
* Release CICD improvements  ([f7f1223](https://github.com/Deltares-research/data-management-suite/commit/f7f122368b49202de8bc496bac1260d10477108d))
* rename release tags pushed by release-please ([f137946](https://github.com/Deltares-research/data-management-suite/commit/f1379461e1d46b6d85ec1a799c7c738ae8a37dfb))
* rename workflows ([a969c63](https://github.com/Deltares-research/data-management-suite/commit/a969c63b73c6c45a287890895dfac8ca5126eb20))
* trigger python test ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))


### :arrow_up: Dependencies updates

* bump prisma from 5.0.0 to 5.6.0 ([#39](https://github.com/Deltares-research/data-management-suite/issues/39)) ([cf0b78c](https://github.com/Deltares-research/data-management-suite/commit/cf0b78c2ea8977212916136b00342c23abe0ba9a))
* bump react-map-gl from 7.1.2 to 7.1.6 ([#40](https://github.com/Deltares-research/data-management-suite/issues/40)) ([f689b95](https://github.com/Deltares-research/data-management-suite/commit/f689b95a51273f6bc902bf34f93e02e1916d02e3))
* bump semver from 6.3.0 to 6.3.1 ([#35](https://github.com/Deltares-research/data-management-suite/issues/35)) ([63937c7](https://github.com/Deltares-research/data-management-suite/commit/63937c71b4ce43726d2e04e49b398a9772a4f0a8))
* bump typescript from 5.1.3 to 5.2.2 ([#37](https://github.com/Deltares-research/data-management-suite/issues/37)) ([983aca2](https://github.com/Deltares-research/data-management-suite/commit/983aca29357f39235ec235283e576c95d577b037))
* **dev:** bump @playwright/test from 1.36.1 to 1.39.0 ([#36](https://github.com/Deltares-research/data-management-suite/issues/36)) ([5fd4c49](https://github.com/Deltares-research/data-management-suite/commit/5fd4c4994f9aba25cf64653d29e5cecc317c9f2a))
* Upgrade to remix v2 ([#13](https://github.com/Deltares-research/data-management-suite/issues/13))  ([d138f5d](https://github.com/Deltares-research/data-management-suite/commit/d138f5dba40a87fd19f52f48e779231f72e5c806))

## [0.3.0](https://github.com/Deltares-research/data-management-suite/compare/data-management-suite-v0.2.0...data-management-suite-v0.3.0) (2023-11-10)

### :rocket: Features

- add python docs ([#15](https://github.com/Deltares-research/data-management-suite/issues/15)) ([f180371](https://github.com/Deltares-research/data-management-suite/commit/f1803716085bba0cfa8b00a5e38ffa9d59428bbb))
- Add sidebar menu ([#76](https://github.com/Deltares-research/data-management-suite/issues/76)) ([b3986c3](https://github.com/Deltares-research/data-management-suite/commit/b3986c32b7622b10d36335aa3154e17a2421afb9))

### :wrench: Bug Fixes & Refactoring

- users are no longer able to select catalogs they are not a member of when creating a collection ([fd4cbdd](https://github.com/Deltares-research/data-management-suite/commit/fd4cbdd94bdc503bf5e24b14ef37f5c60c76b579))

### :package: Testing & CI/CD

- Add testing and releasing of python package to Github Action workflow ([#64](https://github.com/Deltares-research/data-management-suite/issues/64)) ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))

### :arrow_up: Dependencies updates

- Upgrade to remix v2 ([#13](https://github.com/Deltares-research/data-management-suite/issues/13)) ([d138f5d](https://github.com/Deltares-research/data-management-suite/commit/d138f5dba40a87fd19f52f48e779231f72e5c806))

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
