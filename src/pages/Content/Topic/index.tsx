import { useRef, useState } from 'react'
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout'
import type { ProColumns, ActionType } from '@ant-design/pro-table'
import type { FC } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, message, Popover } from 'antd'
import type { ITopic, ITopicTable } from '@/services/typings'
import { PlusOutlined } from '@ant-design/icons'
import { modelType } from '@/utils'
import { topicAdd, topicList } from '@/services/topic'
import ProForm, { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form'
import UploadImage from '@/components/Upload'

const { Item } = ProForm

const Topic: FC = () => {
  const actionRef = useRef<ActionType>()
  const [selectedRowsState, setSelectedRows] = useState<ITopicTable[]>([])
  const [modalVisit, setModalVisit] = useState(false)
  const [editData, setEditData] = useState<ITopicTable>()

  const columns: ProColumns<ITopicTable>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      copyable: true,
      render: (_, entity) => (
        <Popover
          content={
            <img
              src={entity.icon}
              style={{
                width: 50
              }}
            />
          }
        >
          {entity.name}
        </Popover>
      )
    },
    {
      title: '模型',
      dataIndex: 'sid',
      valueEnum: modelType
    },
    {
      title: '目录',
      search: false,
      dataIndex: 'dir'
    },
    {
      title: '动态数',
      search: false,
      dataIndex: 'pin_count'
    },
    {
      title: '关注数',
      search: false,
      dataIndex: 'follow_count'
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
        <a
          key="edit"
          onClick={() => {
            setModalVisit(true)
            setEditData(entity)
          }}
        >
          编辑
        </a>,
        <a key="delete">删除</a>
      ]
    }
  ]
  return (
    <PageContainer>
      <ProTable<ITopicTable, ITopicTable>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            onClick={() => {
              setModalVisit(true)
            }}
          >
            <PlusOutlined />
            新建
          </Button>
        ]}
        request={async params => {
          console.log(params, 'params')
          const { current, pageSize } = params
          const param = {
            current,
            pageSize
          }
          const res = await topicList(param)
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
      <ModalForm<ITopic>
        visible={modalVisit}
        title="新建"
        autoFocusFirstInput
        modalProps={{
          onCancel: () => console.log('run')
        }}
        onFinish={async values => {
          console.log(values)
          const res = await topicAdd({ ...values, id: editData?.id })
          if (res.status === 200) {
            if (editData?.id) {
              message.success('修改成功')
            } else {
              message.success('添加成功')
            }
            actionRef.current?.reload()
            return true
          } else {
            return message.error(res.message)
          }
        }}
        onVisibleChange={setModalVisit}
      >
        <ProFormText name="name" label="名称" placeholder="请输入名称" rules={[{ required: true }]} />
        <ProFormSelect options={Object.keys(modelType).map(item => ({ label: modelType[item], value: item }))} name="sid" label="模型" />
        <ProFormText name="dir" label="目录" placeholder="请输入目录" />
        <ProFormTextArea label="简介" name="summary" />
        <Item label="Icon" name="icon">
          <UploadImage btnName="上传图片" />
        </Item>
      </ModalForm>
    </PageContainer>
  )
}

export default Topic
