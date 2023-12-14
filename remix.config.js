/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  serverModuleFormat: 'cjs',
  postcss: true,
  browserNodeBuiltinsPolyfill: {
    modules: {
      querystring: true,
    },
  },
}
