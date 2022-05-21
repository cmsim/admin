import { attachmentList } from '@/services/attachment'
import type { IAttachment } from '@/services/typings'
import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components'
import { Button, Popconfirm, Popover } from 'antd'
import type { FC } from 'react'
import { useRef, useState } from 'react'
import { Link, useHistory } from 'umi'

const Attachment: FC = () => {
  const history = useHistory()
  const actionRef = useRef<ActionType>()
  const [selectedRowsState, setSelectedRows] = useState<IAttachment[]>([])

  const del = (id?: number | string) => {
    console.log(id)
  }

  const columns: ProColumns<IAttachment>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      copyable: true,
      render: (_, entity) => (
        <Popover
          content={
            <img
              src={entity.url}
              style={{
                width: 200
              }}
            />
          }
        >
          {entity.file_name}
        </Popover>
      )
    },
    {
      title: '类型',
      search: false,
      dataIndex: 'file_type'
    },
    {
      title: '大小',
      search: false,
      dataIndex: 'file_size'
    },
    {
      title: '路径',
      search: false,
      dataIndex: 'file_path'
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updated_at',
      valueType: 'dateRange',
      hideInTable: true
    },
    {
      title: '上传时间',
      sorter: true,
      dataIndex: 'created_at',
      search: false
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, entity) => [
        <Link key="edit" to={`attachment/edit/${entity.id}`}>
          编辑
        </Link>,
        <Popconfirm key="delete" onConfirm={() => del(entity.id)} title="确定要删除吗？">
          <a>删除</a>
        </Popconfirm>
      ]
    }
  ]
  return (
    <PageContainer>
      <ProTable<IAttachment>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              history.push('attachment/add')
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
          const res = await attachmentList(param)
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

export default Attachment
