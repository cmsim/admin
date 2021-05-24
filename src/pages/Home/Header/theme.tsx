import React, { FC, useContext } from 'react'
import { Popover } from 'antd'
import { BgColorsOutlined, LayoutOutlined, LayoutFilled } from '@ant-design/icons'
import { ConfigContext } from '@/contexts'
import { PopContent } from './popContent'
import styles from './index.module.less'

const LanguageData = [
  {
    icon: <LayoutOutlined />,
    label: '亮色风格',
    value: 'light'
  },
  {
    icon: <LayoutFilled />,
    label: '暗黑风格',
    value: 'dark'
  }
]

export const Theme: FC = () => {
  const { state, methods } = useContext(ConfigContext)
  const { changeTheme } = methods

  const themeSync = (value: string) => {
    changeTheme(value as 'light' | 'dark')
    if (value !== state.theme) {
      localStorage.setItem('theme', value)
    }
  }

  return (
    <Popover placement='bottomRight' content={<PopContent source={LanguageData} onChange={themeSync} />} trigger='hover'>
      <div className={`${styles.list} ${styles.small}`}>
        <BgColorsOutlined />
      </div>
    </Popover>
  )
}
