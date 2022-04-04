import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout'
import type { ProColumns, ActionType } from '@ant-design/pro-table'
import type { FC } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, FormInstance, message, Popconfirm, Popover } from 'antd'
import { linkAdd, linkList } from '@/services/link'
import type { ILink, ILinkTable } from '@/services/typings'
import { PlusOutlined } from '@ant-design/icons'
import { modelName } from '@/utils'
import ProForm, { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form'
import UploadImage from '@/components/Upload'
import { useModel } from 'umi'

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
    getCategoryList()
  }, [getCategoryList])

  const del = (id?: number | string) => {
    console.log(id)
  }

  const cidList = useMemo(() => {
    // 获取sid为18的分类
    const list = categoryList.filter(item => +item.sid! === 18 && +item.pid! !== 0)
    return list.reduce((obj, item) => {
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
          const { current, pageSize } = params
          const param = {
            current,
            pageSize
          }
          const res = await linkList(param)
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
          onCancel: () => console.log('run')
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
            return message.error(res.message)
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
