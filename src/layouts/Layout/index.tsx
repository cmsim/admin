import { Avatar, Dropdown, Menu } from 'antd'
import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import { MenuDataItem } from '@ant-design/pro-layout/lib/typings'
import { Route } from '@ant-design/pro-layout/es/typings'
import { pushUrl } from 'utils/util'
import { useHistory, useLocation } from 'dva'
import ProLayout, { PageContainer } from '@ant-design/pro-layout'
import React, { FC, PropsWithChildren } from 'react'
import defaultSetting from './defaultSetting'
import logo from 'assets/logo.svg'
import menu from 'config/menu'
import { useUserToken } from '@/hooks'
import styles from './index.module.less'

const dropdownMenu = (
  <Menu>
    <Menu.Item>
      <a>退出登录</a>
    </Menu.Item>
  </Menu>
)

const App: FC = ({ children }: PropsWithChildren<any>) => {
  const history = useHistory()
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

  const renderRightUser = () => {
    return (
      <Dropdown overlay={dropdownMenu}>
        <div>
          <Avatar shape='square' size='small' icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
          {userInfo?.username}
        </div>
      </Dropdown>
    )
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
        rightContentRender={renderRightUser}
        itemRender={breadcrumbItemRender}
        location={useLocation()}
        {...defaultSetting}>
        <PageContainer className={styles['page-container']}>{children}</PageContainer>
      </ProLayout>
    </div>
  )
}
export default App
