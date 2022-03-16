import { playAdd } from '@/services/play'
import type { IPlay } from '@/services/typings'
import { statusType } from '@/utils'
import { PageContainer } from '@ant-design/pro-layout'
import type { ActionType, ProColumns } from '@ant-design/pro-table'
import { EditableProTable } from '@ant-design/pro-table'
import { Button, message } from 'antd'
import { useCallback, useRef, useState, useEffect } from 'react'
import { Link, useModel } from 'umi'

const Setting = () => {
  const actionRef = useRef<ActionType>()
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])
  const [dataSource, setDataSource] = useState<IPlay[]>([])
  const { play, getPlay } = useModel('usePlay')

  const getData = useCallback(async () => {
    getPlay()
  }, [getPlay])

  useEffect(() => {
    getData()
  }, [getData])

  useEffect(() => {
    actionRef.current?.reload?.()
  }, [play])

  const columns: ProColumns<IPlay>[] = [
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '英文名',
      dataIndex: 'title'
    },
    {
      title: '排序',
      dataIndex: 'rank'
    },
    {
      title: '显示',
      dataIndex: 'display',
      valueType: 'switch'
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: statusType
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
  return (
    <PageContainer>
      <EditableProTable<IPlay>
        columns={columns}
        actionRef={actionRef}
        request={async () => {
          return {
            data: play,
            success: true
          }
        }}
        rowKey="id"
        pagination={false}
        search={false}
        dateFormatter="string"
        headerTitle="配置列表"
        options={false}
        toolBarRender={() => [
          <Link key="primary" to="typelist/add">
            <Button type="primary">创建应用</Button>
          </Link>
        ]}
        value={play}
        recordCreatorProps={{
          record: () => ({ id: (Math.random() * 1000000).toFixed(0) } as IPlay)
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (_, data) => {
            if (typeof data.id === 'string') {
              delete data.id
            }
            playAdd({ ...data }).then(res => {
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
          },
          onChange: setEditableRowKeys
        }}
      />
    </PageContainer>
  )
}

export default Setting