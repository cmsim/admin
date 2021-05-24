import React, { FC } from 'react'
import { Tabs } from 'antd'
import { AuthLayout } from '@/layouts'
import { Login } from './Login'
import { Init } from './Init'
import { useAuthInit } from '@/hooks'

const Auth: FC = () => {
  const [init] = useAuthInit()

  return (
    <AuthLayout>
      <Tabs defaultActiveKey='login' centered>
        <Tabs.TabPane tab='账户密码登录' key='login'>
          <Login />
        </Tabs.TabPane>
        {init && (
          <Tabs.TabPane tab='初始化用户' key='init'>
            <Init />
          </Tabs.TabPane>
        )}
      </Tabs>
    </AuthLayout>
  )
}

export default Auth
