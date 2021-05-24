import React, { FC } from 'react'
import { Config } from '@/constants'
import styles from './index.less'

const Copyright: FC = () => {
  return (
    <div className={styles.footer}>
      Copyright ©{new Date().getFullYear()}{' '}
      <a href={Config.copyright} target='_blank'>
        8ana
      </a>
      提供技术支持
    </div>
  )
}

export default Copyright
