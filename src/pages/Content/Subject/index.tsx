import { useEffect, useMemo, useRef, useState } from 'react'
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout'
import type { ProColumns, ActionType } from '@ant-design/pro-table'
import type { FC } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, Popover } from 'antd'
import { subjectList } from '@/services/subject'
import { Link, useHistory, useModel } from 'umi'
import type { ISubject } from '@/services/typings'
import { PlusOutlined } from '@ant-design/icons'
import { findMcat } from '@/utils'

const Subject: FC = () => {
  const history = useHistory()
  const actionRef = useRef<ActionType>()
  const [selectedRowsState, setSelectedRows] = useState<ISubject[]>([])
  const { mcat, getMcat } = useModel('useMcat')

  useEffect(() => {
    getMcat()
  }, [getMcat])

  const mcatEnum = useMemo(() => {
    let obj = {}
    mcat.forEach(item => {
      obj = {
        ...obj,
        [item.id!]: {
          text: item.name,
          status: item.id
        }
      }
    })
    return obj
  }, [mcat])
  const columns: ProColumns<ISubject>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      copyable: true,
      render: (_, entity) => (
        <Popover
          content={
            <img
              src={entity.pic}
              style={{
                width: 200
              }}
            />
          }
        >
          {entity.name}
        </Popover>
      )
    },
    {
      title: '小分类',
      dataIndex: 'mcid',
      render: (_, entity) => findMcat(mcat, entity.mcid, true),
      valueEnum: mcatEnum
    },
    {
      title: '语言',
      dataIndex: 'language'
    },
    {
      title: '地区',
      dataIndex: 'area'
    },
    {
      title: '连载',
      dataIndex: 'isend',
      hideInForm: true,
      render: (_, entity) => (entity.isend ? <>"连载"({entity.serialized})</> : '完结'),
      valueEnum: {
        1: {
          text: '连载',
          status: true
        },
        0: {
          text: '完结',
          status: false
        }
      }
    },
    {
      title: '人气',
      sorter: true,
      search: false,
      dataIndex: 'hits'
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updated_at',
      valueType: 'dateRange'
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, entity) => [
        <Link key="edit" to={`subject/edit/${entity.id}`}>
          编辑
        </Link>,
        <a key="delete">删除</a>
      ]
    }
  ]
  return (
    <PageContainer>
      <ProTable<ISubject>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              history.push('add')
            }}
          >
            <PlusOutlined /> 新建
          </Button>
        ]}
        request={async params => {
          console.log(params, 'params')
          const { current, pageSize, name: wd, mcid, language, area, isend, updated_at } = params
          const param = {
            current,
            pageSize,
            filter: JSON.stringify({
              wd,
              mcid,
              language,
              area,
              isend,
              created_at: updated_at?.join(',')
            })
          }
          const res = await subjectList(param)
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

export default Subject
