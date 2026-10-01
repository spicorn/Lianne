import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Project site: https://<user>.github.io/Lianne/
// The repo on GitHub must be named Lianne, or the built files 404 and the page stays blank.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/Lianne/' : '/',
  plugins: [react()],
}))
