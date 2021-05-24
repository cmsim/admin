import React, { FC } from 'react'

import { Docs } from './docs'
import { UserInfo } from './userInfo'
import { Message } from './message'
import { Theme } from './theme'
import styles from './index.module.less'

const Header: FC = props => {
  return (
    <div className={styles.wrapper}>
      <Docs />
      <Message />
      <UserInfo />
      <Theme />
    </div>
  )
}

export default Header
