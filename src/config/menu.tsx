import { BarsOutlined, HeartOutlined, SmileOutlined } from '@ant-design/icons'
import React from 'react'
export default [
  {
    path: '/home/overview',
    name: '概览',
    icon: <SmileOutlined />
  },
  {
    path: '/home/list',
    name: '列表',
    icon: <BarsOutlined />,
    children: [
      {
        path: '/home/list/list1',
        name: '列表1'
      },
      {
        path: '/home/list/list2',
        name: '列表2'
      }
    ]
  },
  {
    path: '/home/demo',
    name: 'demo',
    icon: <HeartOutlined />
  }
]
