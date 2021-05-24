import { HomeOutlined } from '@ant-design/icons'
import { MenuDataItem } from '@ant-design/pro-layout/lib/typings'
import { Route } from '@ant-design/pro-layout/es/typings'
import { pushUrl } from 'utils/util'
import { useHistory, useLocation } from 'dva'
import ProLayout, { PageContainer } from '@ant-design/pro-layout'
import React, { FC, PropsWithChildren, useState } from 'react'
import defaultSetting from './defaultSetting'
import logo from 'assets/logo.svg'
import menu from 'config/menu'
import { useUserToken } from '@/hooks'
import styles from './index.module.less'

import Header from '@/pages/Home/Header'

const App: FC = ({ children }: PropsWithChildren<any>) => {
  const history = useHistory()
  const [collapse, setCollapse] = useState(false)
  const { refreshToken, userInfo } = useUserToken()
  const waitTime = (time = 100) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true)
      }, time)
    })
  }

  const renderMenu = (menuItem: MenuDataItem, dom: React.ReactNode) => {
    return <a onClick={() => pushUrl(history, menuItem.path!)}>{dom}</a>
  }

  const renderBreadcrumb = (routers: Route[] = []) => {
    return [
      {
        path: '/',
        breadcrumbName: (<HomeOutlined />) as any
      },
      ...routers
    ]
  }

  const breadcrumbItemRender = (route: Route, params: any, routes: Route[]) => {
    const first = routes.indexOf(route) === 0
    return first ? <a onClick={() => pushUrl(history, route.path!)}>{route.breadcrumbName}</a> : <span>{route.breadcrumbName}</span>
  }

  if (!refreshToken) history.push('/auth/login')
  return (
    <div className={styles.layout}>
      <ProLayout
        className={styles['antd-layout']}
        logo={logo}
        menu={{
          request: async () => {
            await waitTime(1000)
            return menu
          },
          autoClose: false
        }}
        menuItemRender={renderMenu}
        breadcrumbRender={renderBreadcrumb as any}
        onMenuHeaderClick={() => pushUrl(history, '/')}
        rightContentRender={() => <Header />}
        itemRender={breadcrumbItemRender}
        location={useLocation()}
        {...defaultSetting}>
        <PageContainer className={styles['page-container']}>{children}</PageContainer>
      </ProLayout>
    </div>
  )
}
export default App
