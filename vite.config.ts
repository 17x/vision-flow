import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(), tailwindcss()
  ],
  resolve: {
    alias: {
      // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
      // '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Example: Split vendor libraries into separate chunks
          if (id.includes('node_modules')) {
            return 'vendor'; // All node_modules are bundled into 'vendor.js'
          }
        }
      }
    }
  }
})
