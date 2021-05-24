import '@ant-design/pro-layout/dist/layout.css'
import 'assets/css/base.css'
import { createBrowserHistory } from 'history'
import ReactDom from 'react-dom'
import createLoading from 'dva-loading'
import createImmer from 'dva-immer'
import dva from 'dva'
import * as dayjs from 'dayjs'
import models from './models'
import router from './router'

import 'dayjs/locale/zh-cn' // 导入本地化语言
// 设置中文日期
dayjs.locale('zh-cn') // 使用本地化语言

// 1. 创建dva实例
const app = dva({
  history: createBrowserHistory(),
  namespacePrefixWarning: false,
  onError(e: Error) {
    console.error(e.stack)
  }
} as any)

// 2. 装载插件
app.use(createLoading())
app.use(createImmer())

models.forEach(model => {
  app.model(model)
})

// history 被esbuild 之后还会存在 require is not defined
// https://github.com/vitejs/vite/issues/3376
try {
  ;(window as any).require = function (id: string) {
    switch (id) {
      case 'react-dom':
        return ReactDom
      default:
        break
    }
  }
} catch (err) {
  console.log(err)
}

// 4. 路由配置
app.router(router)

// -> Start
app.start('#root')
