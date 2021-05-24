import React, { FC } from 'react'
import { Popover, Avatar } from 'antd'
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { useUserToken } from '@/hooks'
import { useHistory } from 'dva'

import { PopContent } from './popContent'
import styles from './index.module.less'

const UserData = [
  {
    icon: <SettingOutlined />,
    label: '系统设置',
    value: 'setting'
  },
  {
    icon: <LogoutOutlined />,
    label: '退出登录',
    value: 'logout'
  }
]

export const UserInfo: FC = props => {
  const { userInfo, clearTokenCall } = useUserToken()
  const history = useHistory()

  const onChange = (value: string) => {
    if (value === 'setting') {
      history.push('/home/setting')
    } else {
      clearTokenCall()
    }
  }

  return (
    <Popover placement='bottom' content={<PopContent source={UserData} onChange={onChange} />} trigger='hover'>
      <div className={`${styles.list}`}>
        <Avatar size={30} icon={<UserOutlined />} src={userInfo?.avatar} />
        <label>{userInfo?.username}</label>
      </div>
    </Popover>
  )
}
