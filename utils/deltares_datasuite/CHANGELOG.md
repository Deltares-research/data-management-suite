# Changelog

## [0.5.0](https://github.com/Deltares-research/data-management-suite/compare/python_sdk-v0.4.0...python_sdk-v0.5.0) (2024-04-09)


### :rocket: Features

* add end2end pytest in github actions pipeline ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* add python docs ([#15](https://github.com/Deltares-research/data-management-suite/issues/15)) ([f180371](https://github.com/Deltares-research/data-management-suite/commit/f1803716085bba0cfa8b00a5e38ffa9d59428bbb))
* Add testing and releasing of python package to Github Action workflow ([#64](https://github.com/Deltares-research/data-management-suite/issues/64)) ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))


### :wrench: Bug Fixes & Refactoring

* add wait and healthcheck so pytests wait until webcontainer has started ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* change timeouts and pass correct database url for python end2end test ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* formatting ([0f2838d](https://github.com/Deltares-research/data-management-suite/commit/0f2838d65a60ab963efdd0504af1a69598b8f52c))
* import directly ([4a65bde](https://github.com/Deltares-research/data-management-suite/commit/4a65bdec8e52c64965271e970d48408b45621d84))
* put back missing arguments in example ([be65676](https://github.com/Deltares-research/data-management-suite/commit/be6567640867fd2ac5fe6e8fbf6c29702df564ca))
* run pytest only in 1 workflow and spin up docker image with webserver when testing ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))


### :package: Testing & CI/CD

* add permissions to upload test-results ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* disable python end2end test ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* only build container when pushing to main ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
* Release CICD improvements  ([f7f1223](https://github.com/Deltares-research/data-management-suite/commit/f7f122368b49202de8bc496bac1260d10477108d))
* trigger python test ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))


### :arrow_up: Dependencies updates

* bump bandit from 1.7.5 to 1.7.6 in /utils/deltares_datasuite ([#108](https://github.com/Deltares-research/data-management-suite/issues/108)) ([a0159b2](https://github.com/Deltares-research/data-management-suite/commit/a0159b2c8a4dd3204276f43840f716669321e7b8))
* bump black from 23.11.0 to 23.12.0 in /utils/deltares_datasuite ([#121](https://github.com/Deltares-research/data-management-suite/issues/121)) ([9bae03c](https://github.com/Deltares-research/data-management-suite/commit/9bae03cb13e3c1f7a168b939847f6764d4717601))
* bump black from 23.12.0 to 24.3.0 in /utils/deltares_datasuite ([#180](https://github.com/Deltares-research/data-management-suite/issues/180)) ([2a43c85](https://github.com/Deltares-research/data-management-suite/commit/2a43c857ce8a43e1196688eeb47bee2226222d92))
* bump coverage from 7.3.2 to 7.3.3 in /utils/deltares_datasuite ([#122](https://github.com/Deltares-research/data-management-suite/issues/122)) ([e6a624b](https://github.com/Deltares-research/data-management-suite/commit/e6a624b7e702f4b58c8d0ec0f0728e46957a5712))
* bump gitpython from 3.1.40 to 3.1.41 in /utils/deltares_datasuite ([#141](https://github.com/Deltares-research/data-management-suite/issues/141)) ([5598664](https://github.com/Deltares-research/data-management-suite/commit/55986647e542f1c24a3fc390eeeb014e9914bee7))
* bump isort from 5.12.0 to 5.13.1 in /utils/deltares_datasuite ([#113](https://github.com/Deltares-research/data-management-suite/issues/113)) ([728ebc5](https://github.com/Deltares-research/data-management-suite/commit/728ebc5dfd10c9d40db34e43eacda0201d8c0ad9))
* bump isort from 5.13.1 to 5.13.2 in /utils/deltares_datasuite ([#124](https://github.com/Deltares-research/data-management-suite/issues/124)) ([4e5df31](https://github.com/Deltares-research/data-management-suite/commit/4e5df315900c0589737994299ec154975251b9d0))
* bump jinja2 from 3.1.2 to 3.1.3 in /utils/deltares_datasuite ([#142](https://github.com/Deltares-research/data-management-suite/issues/142)) ([4386a41](https://github.com/Deltares-research/data-management-suite/commit/4386a41f814e07a92fb1192f02838b3be76abb94))
* bump mkdocs-material from 9.4.10 to 9.4.14 in /utils/deltares_datasuite ([#73](https://github.com/Deltares-research/data-management-suite/issues/73)) ([6105257](https://github.com/Deltares-research/data-management-suite/commit/610525704d0f7639d02a148bad78948059211697))
* bump mkdocs-material from 9.4.14 to 9.5.2 in /utils/deltares_datasuite ([#106](https://github.com/Deltares-research/data-management-suite/issues/106)) ([eba8223](https://github.com/Deltares-research/data-management-suite/commit/eba8223d4dbe198665084af925f846984dd5a603))
* bump mkdocs-material from 9.4.8 to 9.4.10 in /utils/deltares_datasuite ([#59](https://github.com/Deltares-research/data-management-suite/issues/59)) ([2c9879c](https://github.com/Deltares-research/data-management-suite/commit/2c9879cb7f12f485a7a342a799d7701c1917fd4f))
* bump mkdocstrings from 0.23.0 to 0.24.0 in /utils/deltares_datasuite ([#54](https://github.com/Deltares-research/data-management-suite/issues/54)) ([dfe858c](https://github.com/Deltares-research/data-management-suite/commit/dfe858cf241a912f8cf29b9d5d81ed7cb1c059e9))
* bump mypy from 1.6.1 to 1.7.0 in /utils/deltares_datasuite ([#38](https://github.com/Deltares-research/data-management-suite/issues/38)) ([a833ca3](https://github.com/Deltares-research/data-management-suite/commit/a833ca34821b8cafe29db84f0276c7a1870cb099))
* bump mypy from 1.7.0 to 1.7.1 in /utils/deltares_datasuite ([#74](https://github.com/Deltares-research/data-management-suite/issues/74)) ([a8de503](https://github.com/Deltares-research/data-management-suite/commit/a8de5031d21294d971186f1d0d5cbab1091390a9))
* bump mypy from 1.7.1 to 1.9.0 in /utils/deltares_datasuite ([#173](https://github.com/Deltares-research/data-management-suite/issues/173)) ([6f15882](https://github.com/Deltares-research/data-management-suite/commit/6f158820d3276e9eac46ed726ea8c13464efe4c9))
* bump pre-commit from 3.5.0 to 3.6.0 in /utils/deltares_datasuite ([#125](https://github.com/Deltares-research/data-management-suite/issues/125)) ([d0fb45d](https://github.com/Deltares-research/data-management-suite/commit/d0fb45dfe343c5204761f8cf128449bf12931ecf))
* bump psycopg from 3.1.12 to 3.1.13 in /utils/deltares_datasuite ([#58](https://github.com/Deltares-research/data-management-suite/issues/58)) ([532115e](https://github.com/Deltares-research/data-management-suite/commit/532115e0a892a5a199b74baff26d09ab410ba47f))
* bump psycopg from 3.1.13 to 3.1.14 in /utils/deltares_datasuite ([#81](https://github.com/Deltares-research/data-management-suite/issues/81)) ([46b21d1](https://github.com/Deltares-research/data-management-suite/commit/46b21d1da6ee005bb03781a5803879eb9c3222de))
* bump psycopg from 3.1.14 to 3.1.15 in /utils/deltares_datasuite ([#123](https://github.com/Deltares-research/data-management-suite/issues/123)) ([8adecd5](https://github.com/Deltares-research/data-management-suite/commit/8adecd5cb1e8178703043aec48f3a1652b814062))
* bump psycopg from 3.1.15 to 3.1.18 in /utils/deltares_datasuite ([#153](https://github.com/Deltares-research/data-management-suite/issues/153)) ([257ecf9](https://github.com/Deltares-research/data-management-suite/commit/257ecf9ecb64f28c959ca6c7ead324183d5ce3cb))
* bump pylint from 3.0.2 to 3.0.3 in /utils/deltares_datasuite ([#105](https://github.com/Deltares-research/data-management-suite/issues/105)) ([371454d](https://github.com/Deltares-research/data-management-suite/commit/371454d0580eef66d1752d2fd7c4a32945e87efa))
* bump safety from 2.4.0b1 to 2.4.0b2 in /utils/deltares_datasuite ([#55](https://github.com/Deltares-research/data-management-suite/issues/55)) ([154fba8](https://github.com/Deltares-research/data-management-suite/commit/154fba8a820b4ac0912267192dbf4c821ed3ca76))

## [0.4.0](https://github.com/Deltares-research/data-management-suite/compare/deltares_datasuite-v0.3.0...deltares_datasuite-v0.4.0) (2023-11-10)


### :rocket: Features

* add python docs ([#15](https://github.com/Deltares-research/data-management-suite/issues/15)) ([f180371](https://github.com/Deltares-research/data-management-suite/commit/f1803716085bba0cfa8b00a5e38ffa9d59428bbb))

## [0.3.0](https://github.com/Deltares-research/data-management-suite/compare/deltares_datasuite-v0.2.0...deltares_datasuite-v0.3.0) (2023-11-08)

### Features

- add end2end pytest in github actions pipeline ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
- Add testing and releasing of python package to Github Action workflow ([#64](https://github.com/Deltares-research/data-management-suite/issues/64)) ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))

### Bug Fixes

- add wait and healthcheck so pytests wait until webcontainer has started ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
- change timeouts and pass correct database url for python end2end test ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
- formatting ([0f2838d](https://github.com/Deltares-research/data-management-suite/commit/0f2838d65a60ab963efdd0504af1a69598b8f52c))
- import directly ([4a65bde](https://github.com/Deltares-research/data-management-suite/commit/4a65bdec8e52c64965271e970d48408b45621d84))
- run pytest only in 1 workflow and spin up docker image with webserver when testing ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
- use correct config file name ([#72](https://github.com/Deltares-research/data-management-suite/issues/72)) ([2016750](https://github.com/Deltares-research/data-management-suite/commit/2016750fd023c604abab1a217fd1681c10e47b1b))

## [0.2.0](https://github.com/Deltares-research/data-management-suite/compare/deltares-datasuite-v0.1.0...deltares-datasuite-v0.2.0) (2023-11-08)

### Features

- add end2end pytest in github actions pipeline ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
- Add testing and releasing of python package to Github Action workflow ([#64](https://github.com/Deltares-research/data-management-suite/issues/64)) ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))

### Bug Fixes

- add wait and healthcheck so pytests wait until webcontainer has started ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
- change timeouts and pass correct database url for python end2end test ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))
- run pytest only in 1 workflow and spin up docker image with webserver when testing ([aed6579](https://github.com/Deltares-research/data-management-suite/commit/aed657943cf66dbc483e2a7c26428f1bd0655d74))

## 0.1.0 (2023-11-07)

### Bug Fixes

- formatting ([0f2838d](https://github.com/Deltares-research/data-management-suite/commit/0f2838d65a60ab963efdd0504af1a69598b8f52c))
- import directly ([4a65bde](https://github.com/Deltares-research/data-management-suite/commit/4a65bdec8e52c64965271e970d48408b45621d84))

## [0.1.1](https://github.com/Deltares-research/data-management-suite/compare/v0.1.0...v0.1.1) (2023-11-07)

### Bug Fixes

- import directly ([4a65bde](https://github.com/Deltares-research/data-management-suite/commit/4a65bdec8e52c64965271e970d48408b45621d84))
