import UploadImage from '@/components/Upload'
import { pinAdd, pinList } from '@/services/pin'
import type { IPin, IPinTable } from '@/services/typings'
import { modelEnName, modelType } from '@/utils'
import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable
} from '@ant-design/pro-components'
import { Button, message, Popconfirm, Popover } from 'antd'
import type { FC } from 'react'
import { useRef, useState } from 'react'

const { Item } = ProForm

const Pin: FC = () => {
  const actionRef = useRef<ActionType>()
  const [selectedRowsState, setSelectedRows] = useState<IPinTable[]>([])
  const [modalVisit, setModalVisit] = useState(false)
  const [editData, setEditData] = useState<IPinTable>()

  const del = (id?: number | string) => {
    console.log(id)
  }

  const columns: ProColumns<IPinTable>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      copyable: true,
      render: (_, entity) =>
        entity.aid ? (
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
        ) : (
          '-'
        )
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
      title: '模型',
      dataIndex: 'sid',
      valueEnum: modelType
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
    <PageContainer>
      <ProTable<IPinTable>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => setModalVisit(true)}>
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
        expandable={{
          expandedRowRender: record => <p style={{ margin: 0 }}>{record.content}</p>
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
        title="新建"
        autoFocusFirstInput
        modalProps={{
          onCancel: () => console.log('run')
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

export default Pin
