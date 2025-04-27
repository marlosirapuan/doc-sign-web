import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

import type { PluginOptions } from 'babel-plugin-react-compiler'

const ReactCompilerConfig = {} as PluginOptions

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]]
      }
    }),
    tsConfigPaths()
  ],
  server: {
    port: 5176,
    host: true
  }
})
