import TagForm from '@/components/TagForm'
import { pinAdd, pinList } from '@/services/pin'
import type { IPin, IPinTable } from '@/services/typings'
import { PlusOutlined } from '@ant-design/icons'
import {
  ActionType,
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProColumns,
  ProForm,
  ProFormSelect,
  ProFormTextArea,
  ProTable
} from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import { Button, FormInstance, message, Popconfirm, Popover } from 'antd'
import { FC, useEffect, useRef, useState } from 'react'

const { Item } = ProForm

const Pin: FC = () => {
  const actionRef = useRef<ActionType>()
  const formRef = useRef<FormInstance>()
  const [selectedRowsState, setSelectedRows] = useState<IPinTable[]>([])
  const [modalVisit, setModalVisit] = useState(false)
  const [editData, setEditData] = useState<IPinTable>()
  const { topicList, getTopicList } = useModel('useTopic')

  const del = (id?: number | string) => {
    console.log(id)
  }

  useEffect(() => {
    const params = { ...editData, cid: editData?.cid?.toString() }
    formRef.current?.setFieldsValue(params)
  }, [editData])

  useEffect(() => {
    getTopicList()
  }, [getTopicList])

  const onSearchForAid = (value: string) => {
    console.log(value)
  }

  console.log(topicList, 'topicList')

  useEffect(() => {
    const params = { ...editData, cid: editData?.cid?.toString() }
    formRef.current?.setFieldsValue(params)
  }, [editData])

  const columns: ProColumns<IPinTable>[] = [
    {
      title: '名称',
      dataIndex: 'content',
      copyable: true,
      ellipsis: true,
      render: content => <Popover content={content}>{content}</Popover>
    },
    {
      title: '话题',
      dataIndex: 'tid',
      search: false,
      render: (_, entity) => (
        <>
          <img src={entity.topic?.icon} style={{ width: 50 }} />
          {entity.topic?.name}
        </>
      )
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
        <Popconfirm key="delete" onConfirm={() => del(entity.id)} title="确定要删除吗？">
          <a>删除</a>
        </Popconfirm>
      ]
    }
  ]
  return (
    <PageContainer
      extra={
        <Button type="primary" key="primary" onClick={() => setModalVisit(true)}>
          <PlusOutlined /> 新建
        </Button>
      }
    >
      <ProTable<IPinTable>
        actionRef={actionRef}
        rowKey="id"
        request={async params => {
          console.log(params, 'params')
          const { current, pageSize } = params
          const param = {
            current,
            pageSize
          }
          const res = await pinList(param)
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
      <ModalForm<IPin>
        visible={modalVisit}
        formRef={formRef}
        title="新建"
        autoFocusFirstInput
        modalProps={{
          onCancel: () => {
            formRef.current?.resetFields()
            setEditData(undefined)
          }
        }}
        onFinish={async values => {
          console.log(values)
          const res = await pinAdd({ ...values, id: editData?.id })
          if (res.status === 200) {
            if (editData?.id) {
              message.success('修改成功')
            } else {
              message.success('添加成功')
            }
            formRef.current?.resetFields()
            actionRef.current?.reload()
            return true
          } else {
            message.error(res.message)
            return false
          }
        }}
        onVisibleChange={setModalVisit}
      >
        <ProFormSelect showSearch name="aid" label="关联内容ID" fieldProps={{ onSearch: onSearchForAid }} />
        {/* <ProFormSelect showSearch name="tid" label="关联话题ID" fieldProps={{ onSearch: onSearchForTid }} /> */}
        <Item name="tid" label="关联话题ID">
          <TagForm list={topicList} />
        </Item>
        <ProFormTextArea name="content" label="内容" rules={[{ required: true }]} />
      </ModalForm>
    </PageContainer>
  )
}

export default Pin
