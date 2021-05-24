import React, { FC, useEffect, useCallback } from 'react'
import { Popover, Empty } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import styles from './index.module.less'

import { GlobalType } from '@/types'

export const Message: FC = () => {
  return (
    <Popover placement='bottom' title='公告通知' content={<MessageContent list={[]} />} trigger='hover'>
      <div className={`${styles.list} ${styles.small}`}>
        <BellOutlined />
      </div>
    </Popover>
  )
}

interface ContentPropsType {
  list: GlobalType.MessageData[]
}

const MessageContent: FC<ContentPropsType> = props => {
  const { list } = props

  const goToLink = (value: string | undefined) => {
    if (!value) return
    window.open(value, 'newwindow')
  }

  return (
    <div className={styles.message}>
      {list?.length ? (
        <>
          {list?.map(item => (
            <div className={styles.list} onClick={() => goToLink(item.link)} key={item.time}>
              <div className={styles.header}>
                <h3>{item.title}</h3>
                <span>{dayjs(item.time).format('YYYY-MM-DD')}</span>
              </div>

              <p>{item.introduce}</p>
            </div>
          ))}
        </>
      ) : (
        <div className={styles.empty}>
          <Empty />
        </div>
      )}
    </div>
  )
}
