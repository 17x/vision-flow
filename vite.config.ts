import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import * as path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
// @ts-ignore
export default defineConfig(({mode}) => {
  return {
    base: './',
    plugins: [
      react(), tailwindcss(),
    ],
    optimizeDeps: ['@lite-u/ui'],
    resolve: {
      // preserveSymlinks: true,
      alias: {
        react: path.resolve(__dirname, './node_modules/react'),
        '@editor': path.resolve(__dirname, '../@lite-u/editor'),

        // '@editor': path.resolve(__dirname, '../src/engine'),
        // '@editor': './src/engine',

        // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
        // '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      },
    },
    esbuild: {
      pure: false,
      // pure: mode === 'production' ? ['console.log'] : [],
    },
    build: {
      // minify:'esbuild',
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
    server: {
      fs: {
        allow: ['..'],
      },
    },
  }
})
