import { useRef, useState } from 'react'
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout'
import type { ProColumns, ActionType } from '@ant-design/pro-table'
import type { FC } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, Popover } from 'antd'
import { Link, useHistory } from 'umi'
import type { IUser } from '@/services/typings'
import { PlusOutlined } from '@ant-design/icons'
import { userList } from '@/services/user'
import moment from 'moment'

const UserList: FC = () => {
  const history = useHistory()
  const actionRef = useRef<ActionType>()
  const [selectedRowsState, setSelectedRows] = useState<IUser[]>([])

  const columns: ProColumns<IUser>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      copyable: true,
      render: (text, entity) => (
        <Popover
          content={
            <img
              src={entity.avatar}
              style={{
                width: 200
              }}
            />
          }
        >
          {text}
        </Popover>
      )
    },
    {
      title: '昵称',
      dataIndex: 'nickname'
    },
    {
      title: '登录次数',
      dataIndex: 'login',
      search: false
    },
    {
      title: '注册IP',
      dataIndex: 'register_ip'
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updated_at',
      valueType: 'dateRange',
      hideInTable: true,
      initialValue: [moment(), moment().add(1, 'day')]
    },
    {
      title: '创建时间',
      search: false,
      sorter: true,
      dataIndex: 'created_at'
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, entity) => [
        <Link key="edit" to={`edit/${entity.id}`}>
          编辑
        </Link>,
        <a key="delete">删除</a>
      ]
    }
  ]
  return (
    <PageContainer>
      <ProTable<IUser>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              history.push('add')
            }}
          >
            <PlusOutlined /> 新建
          </Button>
        ]}
        request={async params => {
          console.log(params, 'params')
          const { current, pageSize } = params
          const param = {
            current,
            pageSize
          }
          const res = await userList(param)
          return {
            data: res.data?.list,
            total: res.data?.total,
            success: true
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows)
          }
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项
            </div>
          }
        >
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
    </PageContainer>
  )
}

export default UserList
