import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { VitePWA } from 'vite-plugin-pwa'
import styleImport from 'vite-plugin-style-import'
import tsconfigPaths from 'vite-tsconfig-paths'
const path = require('path')

const DEV = 'development'
// 你的gitlab地址或者 cdn地址 对应webpack的publicPath
const productionBase = 'https://cms.im/'
// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    base: mode === DEV ? '/' : productionBase,
    plugins: [
      tsconfigPaths(),
      reactRefresh(),
      styleImport({
        libs: [
          {
            libraryName: 'antd',
            esModule: true,
            resolveStyle: name => {
              return `antd/es/${name}/style/index`
            }
          }
        ]
      }),
      VitePWA({
        workbox: {
          additionalManifestEntries: [{ url: 'https://rsms.me/inter/inter.css', revision: null }],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          navigateFallback: undefined
        },
        manifest: {
          name: 'Vitamin',
          short_name: 'Vitamin',
          theme_color: '#BD34FE',
          icons: [
            {
              src: '/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: '/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    server: {
      port: 3000,
      cors: true,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:7001',
          secure: false,
          changeOrigin: true
        }
      }
    },
    resolve: {
      alias: [
        // fix less import by: @import ~
        // https://github.com/vitejs/vite/issues/2185#issuecomment-784637827
        { find: /^~/, replacement: '' },
        { find: '@', replacement: path.resolve(__dirname, 'src') }
      ]
    },
    css: {
      modules: {
        scopeBehaviour: 'local',
        localsConvention: 'camelCase'
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      },
      postcss: {
        plugins: [require('postcss-flexbugs-fixes'), require('postcss-nested'), require('postcss-preset-env')]
      }
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: '[name].js',
          assetFileNames: '[name][extname]',
          chunkFileNames: '[name].js'
        }
      },
      sourcemap: true
    }
  })
}
