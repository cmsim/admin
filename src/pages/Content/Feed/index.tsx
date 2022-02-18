import { useRef, useState } from 'react'
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout'
import type { ProColumns, ActionType } from '@ant-design/pro-table'
import type { FC } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, Popover } from 'antd'
import { feedList } from '@/services/feed'
import { Link, useHistory } from 'umi'
import type { IFeedTable } from '@/services/typings'
import { PlusOutlined } from '@ant-design/icons'
import { modelEnName, modelType } from '@/utils'

const Feed: FC = () => {
  const history = useHistory()
  const actionRef = useRef<ActionType>()
  const [selectedRowsState, setSelectedRows] = useState<IFeedTable[]>([])

  const columns: ProColumns<IFeedTable>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      copyable: true,
      render: (_, entity) => (
        <Popover
          content={
            <img
              src={entity[modelEnName[entity.sid!]]?.pic}
              style={{
                width: 200
              }}
            />
          }
        >
          {entity[modelEnName[entity.sid!]]?.name}
        </Popover>
      )
    },
    {
      title: '模型',
      dataIndex: 'sid',
      valueEnum: modelType
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueEnum: {
        1: { text: '关注', status: 1 },
        2: { text: '评分', status: 2 },
        3: { text: '评价', status: 3 },
        4: { text: '添加', status: 4 },
        5: { text: '更新', status: 5 }
      }
    },
    {
      title: '用户名',
      search: false,
      dataIndex: 'username',
      render: (_, entity) => entity.user?.username
    },
    {
      title: '更新时间',
      search: false,
      dataIndex: 'updated_at'
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updated_at',
      valueType: 'dateRange',
      hideInTable: true
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'created_at',
      search: false
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, entity) => [
        <Link key="edit" to={`feed/edit/${entity.id}`}>
          编辑
        </Link>,
        <a key="delete">删除</a>
      ]
    }
  ]
  return (
    <PageContainer>
      <ProTable<IFeedTable, IFeedTable>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              history.push('feed/add')
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
          const res = await feedList(param)
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

export default Feed
