import { router as dvaRouter, useRouteMatch } from 'dva'
import Layout from '@/layouts/Layout'
import React, { FC, lazy } from 'react'

const Overview = lazy(() => import('./Overview'))
const List = lazy(() => import('./List'))
const Demo = lazy(() => import('./Demo'))

const { Route, Switch, Redirect } = dvaRouter

export const Pages: FC = () => {
  const { path } = useRouteMatch()
  console.log(path)
  return (
    <Layout>
      <Switch>
        <Route exact path={`${path}/overview`} component={Overview} />
        <Route exact path={`${path}/list`} component={List} />
        <Route exact path={`${path}/demo`} component={Demo} />
        {/* <Redirect to={`${path}/overview`} /> */}
      </Switch>
    </Layout>
  )
}

export default Pages
