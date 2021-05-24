import React, { FC } from 'react'
import Copyright from '@/components/Copyright'
import styles from './index.module.less'

export const AuthLayout: FC = props => {
  const { children } = props

  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>
        <h1>cms</h1>
        <p className={styles.title}>后台管理面板</p>
        {children}
      </div>
      <Copyright />
    </div>
  )
}
