import React, { FC } from 'react'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Config } from '@/constants'
import styles from './index.module.less'

export const Docs: FC = () => {
  const goToDocs = () => {
    window.open(Config.docs)
  }
  return (
    <Tooltip placement='bottom' title='查看文档'>
      <div className={`${styles.list} ${styles.small}`} onClick={goToDocs}>
        <QuestionCircleOutlined />
      </div>
    </Tooltip>
  )
}
