import { Button, message } from 'antd'
import type { ActionType, ProColumns } from '@ant-design/pro-table'
import { EditableProTable } from '@ant-design/pro-table'
import { PageContainer } from '@ant-design/pro-layout'
import type { IList } from '@/services/typings'
import { getList, sidEnum } from '@/utils'
import { listAdd } from '@/services/list'
import { Link, useModel } from 'umi'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const Typelist = () => {
  const actionRef = useRef<ActionType>()
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])
  const [dataSource, setDataSource] = useState<IList[]>([])
  const { categoryList, getCategoryList } = useModel('useList')

  const getData = useCallback(async () => {
    await getCategoryList()
  }, [getCategoryList])

  useEffect(() => {
    getData()
  }, [getData])

  useEffect(() => {
    actionRef.current?.reload?.()
  }, [categoryList])

  const cateEnum = useMemo(() => {
    let obj = { '0': '无' }
    categoryList.forEach(item => {
      obj = {
        ...obj,
        [item.id!]: {
          text: item.name
        }
      }
    })
    return obj
  }, [categoryList])

  const columns: ProColumns<IList>[] = [
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '父类',
      dataIndex: 'pid',
      valueType: 'select',
      valueEnum: cateEnum
    },
    {
      title: '模型',
      dataIndex: 'sid',
      valueType: 'select',
      valueEnum: sidEnum()
    },
    {
      title: '目录',
      dataIndex: 'dir'
    },
    {
      title: '排序',
      dataIndex: 'rank'
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: { text: '正常', status: 'Success' },
        1: { text: '禁用', status: 'Error' }
      }
    },
    {
      title: '操作',
      width: 164,
      key: 'option',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id!)
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter(item => item.id !== record.id))
          }}
        >
          删除
        </a>
      ]
    }
  ]

  const expandedRowRender = (record: any) => {
    if (!record.sub?.length) return
    return (
      <EditableProTable
        rowKey="id"
        columns={columns}
        showHeader={false}
        search={false}
        options={false}
        pagination={false}
        bordered={false}
        request={async () => ({
          data: record.sub,
          success: true
        })}
        value={record.sub}
        recordCreatorProps={{
          record: () => ({ id: (Math.random() * 1000000).toFixed(0), cid: '1' } as IList)
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            if (typeof data.id === 'string') {
              delete data.id
            }
            listAdd({ ...data }).then(res => {
              if (res.status === 200) {
                if (data.id) {
                  message.success('修改成功')
                } else {
                  message.success('添加成功')
                }
                getData()
              } else {
                message.error(res.message)
              }
            })
            console.log(rowKey, data, row)
          },
          onChange: setEditableRowKeys
        }}
      />
    )
  }
  return (
    <PageContainer>
      <EditableProTable<IList>
        columns={columns}
        actionRef={actionRef}
        request={async () => {
          return {
            data: getList(categoryList),
            success: true
          }
        }}
        rowKey="id"
        pagination={false}
        expandable={{
          expandedRowRender: record => expandedRowRender(record)
        }}
        search={false}
        dateFormatter="string"
        headerTitle="栏目列表"
        options={false}
        toolBarRender={() => [
          <Link key="primary" to="typelist/add">
            <Button type="primary">创建应用</Button>
          </Link>
        ]}
        value={getList(categoryList)}
        recordCreatorProps={{
          record: () => ({ id: (Math.random() * 1000000).toFixed(0) } as IList)
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            if (typeof data.id === 'string') {
              delete data.id
            }
            listAdd({ ...data }).then(res => {
              if (res.status === 200) {
                if (data.id) {
                  message.success('修改成功')
                } else {
                  message.success('添加成功')
                }
                getData()
              } else {
                message.error(res.message)
              }
            })
            console.log(rowKey, data, row)
          },
          onChange: setEditableRowKeys
        }}
      />
    </PageContainer>
  )
}

export default Typelist
