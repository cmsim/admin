// https://umijs.org/config/
import { defineConfig } from 'umi'
import defaultSettings from './defaultSettings'
import proxy from './proxy'
import routes from './routes'
const { REACT_APP_ENV } = process.env

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
    immer: true,
    lazyLoad: true
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings
  },
  dynamicImport: {
    loading: '@/Loading'
  },
  targets: {
    ie: 11
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  access: {},
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/'
  },
  lessLoader: {
    modifyVars: {
      'root-entry-name': 'default'
    }
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  nodeModulesTransform: {
    type: 'none'
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {}
})
