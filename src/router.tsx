import { Router as IRouter, RouterAPI, router as dvaRouter } from 'dva'
import React, { Suspense, lazy } from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'

const Home = lazy(() => import('@/pages/Home'))
const Auth = lazy(() => import('@/pages/Auth'))

const { Route, Router, Switch, Redirect } = dvaRouter

const router: IRouter = (routerApi?: RouterAPI) => {
  if (!routerApi) return {}
  return (
    <ConfigProvider locale={zhCN}>
      <Router history={routerApi.history}>
        <Suspense fallback={null}>
          <Switch>
            <Route path='/home' component={Home} />
            <Route path='/auth' component={Auth} />
            <Redirect to='/home/overview' />
          </Switch>
        </Suspense>
      </Router>
    </ConfigProvider>
  )
}

export default router
