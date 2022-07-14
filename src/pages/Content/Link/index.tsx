import UploadImage from '@/components/Upload'
import { linkAdd, linkList } from '@/services/link'
import type { ILink, ILinkTable } from '@/services/typings'
import { modelName } from '@/utils'
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
import { useModel } from '@umijs/max'
import { Button, FormInstance, message, Popconfirm, Popover } from 'antd'
import type { FC } from 'react'
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'

const { Item } = ProForm

const Pin: FC = () => {
  const actionRef = useRef<ActionType>()
  const formRef = useRef<FormInstance>()
  const [selectedRowsState, setSelectedRows] = useState<ILinkTable[]>([])
  const [modalVisit, setModalVisit] = useState(false)
  const [editData, setEditData] = useState<ILinkTable>()
  const [icons, setIcons] = useState('')
  const { categoryList, getCategoryList } = useModel('useList')

  useEffect(() => {
    getCategoryList({ sid: 18, pid: 4 })
  }, [getCategoryList])

  const del = (id?: number | string) => {
    console.log(id)
  }

  const cidList = useMemo(() => {
    return categoryList.reduce((obj, item) => {
      obj[item.id!] = item.name
      return obj
    }, {} as { [key: string]: number | string | undefined })
  }, [categoryList])

  const columns: ProColumns<ILinkTable>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      copyable: true,
      render: (name, entity) =>
        entity.icon ? (
          <Popover
            content={
              <img
                src={entity.icon}
                style={{
                  width: 200
                }}
              />
            }
          >
            {name}
          </Popover>
        ) : (
          '-'
        )
    },
    {
      title: '分类',
      dataIndex: 'cid',
      valueEnum: cidList
    },
    {
      title: '用户名',
      search: false,
      dataIndex: 'username',
      render: (_, entity) => entity.user?.username
    },
    {
      title: '颜色',
      search: false,
      dataIndex: 'color'
    },
    {
      title: '文字',
      search: false,
      dataIndex: 'text'
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
            setIcons(entity.icon)
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
  const icon = (file: string) => {
    formRef.current?.setFieldsValue({ icon: file })
    setIcons(file)
  }

  const url = (e: ChangeEvent<HTMLInputElement>) => {
    setIcons(e.target.value)
  }

  useEffect(() => {
    const params = { ...editData, cid: editData?.cid?.toString() }
    formRef.current?.setFieldsValue(params)
  }, [editData])

  return (
    <PageContainer>
      <ProTable<ILinkTable>
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
          const res = await linkList(params)
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
        // expandable={{
        //   expandedRowRender: record => <p style={{ margin: 0 }}>{record.content}</p>
        // }}
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
      <ModalForm<ILink>
        visible={modalVisit}
        formRef={formRef}
        title="新建"
        autoFocusFirstInput
        modalProps={{
          onCancel: () => {
            formRef.current?.resetFields()
            setIcons('')
            setEditData(undefined)
          }
        }}
        onFinish={async values => {
          console.log(values)
          const res = await linkAdd({ ...values, id: editData?.id, sid: modelName.LINK, cid: values.cid })
          if (res.status === 200) {
            if (editData?.id) {
              message.success('修改成功')
            } else {
              message.success('添加成功')
            }
            setIcons('')
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
        <ProFormSelect name="cid" label="分类" valueEnum={cidList} placeholder="请选择分类" rules={[{ required: true }]} />
        <ProFormText name="name" label="名称" placeholder="请输入名称" rules={[{ required: true }]} />
        <ProFormText name="url" label="网址" placeholder="请输入网址" rules={[{ required: true }]} />
        <ProFormText name="text" label="网标文字" placeholder="请输入网标文字" />
        <ProFormText name="color" label="网标颜色" placeholder="请输入网标颜色" fieldProps={{ type: 'color' }} />
        <ProFormTextArea label="简介" name="content" />
        <Item label="图标">
          <ProFormText name="icon" placeholder="请输入图标地址" fieldProps={{ onChange: url }} />
          <UploadImage onChange={icon} value={icons} />
        </Item>
      </ModalForm>
    </PageContainer>
  )
}

export default Pin
