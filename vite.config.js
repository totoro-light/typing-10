import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import { execSync } from 'child_process'

const commit = execSync('git rev-parse --short HEAD').toString().trim()

export default defineConfig({
  define: { __COMMIT__: JSON.stringify(commit) },
  plugins: [
    react(),
    legacy({ targets: ['chrome >= 56'] }),
  ],
  base: '/typing-10/',
})
