import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import { installGlobals } from '@remix-run/node'
import tsconfigPaths from 'vite-tsconfig-paths'
import envOnly from 'vite-env-only'
import mdx from '@mdx-js/rollup'

installGlobals()

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [mdx(), remix(), tsconfigPaths(), envOnly()],
})
