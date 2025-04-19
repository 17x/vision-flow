import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
// import { dirname, resolve } from 'path';
// import {fileURLToPath} from 'node:url'

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  return {
    base: './',
    plugins: [
      react(), tailwindcss(),
    ],
    optimizeDeps: {
      include: ['@lite-u/editor'],
    },
    server: {
      fs: {
        // allow: ['..'] // allow access outside root
      },
    },
    resolve: {
      preserveSymlinks: true,
      // dedupe: ['@lite-u/editor'],
      alias: {
        // '@lite-u/editor': 'node_modules/@lite-u/editor/dist/',
        // '@lite-u/editor': '@lite-u/editor/dist/esm/index.d.ts',

        // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
        // '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      },
    },
    esbuild: {
      pure: mode === 'production' ? ['console.log'] : [],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Example: Split vendor libraries into separate chunks
            if (id.includes('node_modules')) {
              return 'vendor' // All node_modules are bundled into 'vendor.js'
            }
          },
        },
      },
    },
  }
})
