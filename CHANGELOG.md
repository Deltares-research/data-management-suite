# Changelog

## [0.4.1](https://github.com/Deltares-research/data-management-suite/compare/web-v0.4.0...web-v0.4.1) (2023-11-21)


### :package: Testing & CI/CD

* Deploy image from registry ([#66](https://github.com/Deltares-research/data-management-suite/issues/66)) ([4e20c0c](https://github.com/Deltares-research/data-management-suite/commit/4e20c0c0b0263950711853bb8ecc2b38b62ad63b))
* fix tag image workflow ([#65](https://github.com/Deltares-research/data-management-suite/issues/65)) ([b0b73ae](https://github.com/Deltares-research/data-management-suite/commit/b0b73ae0d005e0b84982db186b697790dae13338))


### :arrow_up: Dependencies updates

* bump @playwright/test from 1.39.0 to 1.40.0 ([#52](https://github.com/Deltares-research/data-management-suite/issues/52)) ([93e1db7](https://github.com/Deltares-research/data-management-suite/commit/93e1db780a1c8ff80d9d8b5b74f6211dcb2bcb2d))
* bump @remix-run/node from 2.2.0 to 2.3.0 ([#47](https://github.com/Deltares-research/data-management-suite/issues/47)) ([476de72](https://github.com/Deltares-research/data-management-suite/commit/476de720ff14079092eb4746c5794d7454b8f0ec))
* bump @remix-validated-form/with-zod from 2.0.6 to 2.0.7 ([#51](https://github.com/Deltares-research/data-management-suite/issues/51)) ([0f36155](https://github.com/Deltares-research/data-management-suite/commit/0f36155f9676fcc28ee311983833778318e6493a))
* bump eslint from 8.43.0 to 8.53.0 ([#48](https://github.com/Deltares-research/data-management-suite/issues/48)) ([71ba0b6](https://github.com/Deltares-research/data-management-suite/commit/71ba0b6be40b10a5421d8676850e8e0def2dbcbf))
* bump lru-cache from 10.0.0 to 10.0.2 ([#53](https://github.com/Deltares-research/data-management-suite/issues/53)) ([b163642](https://github.com/Deltares-research/data-management-suite/commit/b16364279c709154c573ae397be177a78866316b))

## [0.4.0](https://github.com/Deltares-research/data-management-suite/compare/web-v0.3.0...web-v0.4.0) (2023-11-17)

### :rocket: Features

- add datadog to app and docker deployments ([#34](https://github.com/Deltares-research/data-management-suite/issues/34)) ([3d1e57b](https://github.com/Deltares-research/data-management-suite/commit/3d1e57bfa148d27c6122e95bd2dc74fa21c5f64d))

### :wrench: Bug Fixes & Refactoring

- fix start command used in prod ([#24](https://github.com/Deltares-research/data-management-suite/issues/24)) ([f015118](https://github.com/Deltares-research/data-management-suite/commit/f015118ea748b96b21db39da3e7857a77ca29530))
- remove double search outcomes with query fix ([#45](https://github.com/Deltares-research/data-management-suite/issues/45)) ([5b1f2c5](https://github.com/Deltares-research/data-management-suite/commit/5b1f2c55f8a84124a4ae90731956e37fef25470c))

### :package: Testing & CI/CD

- dont run terraform plan on dependabot PR ([889ad56](https://github.com/Deltares-research/data-management-suite/commit/889ad5684371f5db64c79b3b0c3977f007d2a108))
- fix poetry publish by building first ([f428c7b](https://github.com/Deltares-research/data-management-suite/commit/f428c7be699c6114e760e637a028b82251ae636a))

### :arrow_up: Dependencies updates

- bump prisma from 5.0.0 to 5.6.0 ([#39](https://github.com/Deltares-research/data-management-suite/issues/39)) ([cf0b78c](https://github.com/Deltares-research/data-management-suite/commit/cf0b78c2ea8977212916136b00342c23abe0ba9a))
- bump react-map-gl from 7.1.2 to 7.1.6 ([#40](https://github.com/Deltares-research/data-management-suite/issues/40)) ([f689b95](https://github.com/Deltares-research/data-management-suite/commit/f689b95a51273f6bc902bf34f93e02e1916d02e3))
- bump semver from 6.3.0 to 6.3.1 ([#35](https://github.com/Deltares-research/data-management-suite/issues/35)) ([63937c7](https://github.com/Deltares-research/data-management-suite/commit/63937c71b4ce43726d2e04e49b398a9772a4f0a8))
- bump typescript from 5.1.3 to 5.2.2 ([#37](https://github.com/Deltares-research/data-management-suite/issues/37)) ([983aca2](https://github.com/Deltares-research/data-management-suite/commit/983aca29357f39235ec235283e576c95d577b037))
- **dev:** bump @playwright/test from 1.36.1 to 1.39.0 ([#36](https://github.com/Deltares-research/data-management-suite/issues/36)) ([5fd4c49](https://github.com/Deltares-research/data-management-suite/commit/5fd4c4994f9aba25cf64653d29e5cecc317c9f2a))

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
