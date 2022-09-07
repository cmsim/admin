import { linkCategoryAdd } from '@/services/linkCategory'
import type { ILinkCategory } from '@/services/typings'
import { getList } from '@/utils'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { EditableProTable, PageContainer } from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import { message } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const LinkCategory = () => {
  const actionRef = useRef<ActionType>()
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])
  const [dataSource, setDataSource] = useState<ILinkCategory[]>([])
  const { linkCategory, getLinkCategorylist } = useModel('useLinkCategory')

  const getData = useCallback(async () => {
    await getLinkCategorylist()
  }, [getLinkCategorylist])

  useEffect(() => {
    getData()
  }, [getData])

  useEffect(() => {
    actionRef.current?.reload?.()
  }, [linkCategory])

  const cateEnum = useMemo(() => {
    return linkCategory
      .filter(item => item.pid === 0)
      .reduce(
        (pre, cur) => {
          pre[cur.id!] = cur.name
          return pre
        },
        { '0': '无' }
      )
  }, [linkCategory])

  const columns: ProColumns<ILinkCategory>[] = [
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
      title: '目录',
      dataIndex: 'dir'
    },
    {
      title: '密码',
      dataIndex: 'password'
    },
    {
      title: '简介',
      dataIndex: 'content'
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

  const expandedRowRender = (record: { sub?: ILinkCategory[] } & ILinkCategory) => {
    return (
      <EditableProTable<ILinkCategory>
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
          record: () => ({ id: (Math.random() * 1000000).toFixed(0) } as ILinkCategory)
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            if (typeof data.id === 'string') {
              delete data.id
            }
            linkCategoryAdd({ ...data }).then(res => {
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
      <EditableProTable<ILinkCategory>
        columns={columns}
        actionRef={actionRef}
        request={async () => {
          return {
            data: getList(linkCategory),
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
        options={false}
        value={getList<ILinkCategory>(linkCategory)}
        recordCreatorProps={{
          record: () => ({ id: (Math.random() * 1000000).toFixed(0) } as ILinkCategory)
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            if (typeof data.id === 'string') {
              delete data.id
            }
            linkCategoryAdd({ ...data }).then(res => {
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

export default LinkCategory
