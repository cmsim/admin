import { useEffect, useMemo, useRef, useState } from 'react'
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout'
import type { ProColumns, ActionType } from '@ant-design/pro-table'
import type { FC } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, Popconfirm, Popover } from 'antd'
import { subjectList } from '@/services/subject'
import { Link, useHistory, useModel } from 'umi'
import type { ISubject } from '@/services/typings'
import { PlusOutlined } from '@ant-design/icons'
import { areaEnum, findMcat, languageEnum, statusType } from '@/utils'

const weekdayEnum = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '日'
}

const Subject: FC = () => {
  const history = useHistory()
  const actionRef = useRef<ActionType>()
  const [selectedRowsState, setSelectedRows] = useState<ISubject[]>([])
  const { mcat, getMcat } = useModel('useMcat')

  const del = (id?: number | string) => {
    console.log(id)
  }

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
      dataIndex: 'language',
      valueEnum: languageEnum
    },
    {
      title: '地区',
      dataIndex: 'area',
      valueEnum: areaEnum
    },
    {
      title: '星期',
      dataIndex: 'weekday',
      render: (_, entity) => weekdayEnum[entity.weekday?.[0]],
      valueEnum: weekdayEnum
    },
    {
      title: '连载',
      dataIndex: 'isend',
      hideInForm: true,
      render: (_, entity) => (entity.isend ? '完结' : <>连载({entity.serialized})</>),
      valueEnum: {
        1: {
          text: '连载',
          status: 'success'
        },
        0: {
          text: '完结',
          status: 'error'
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
      title: '状态',
      dataIndex: 'status',
      valueEnum: statusType
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, entity) => [
        <Link key="edit" to={`subject/edit/${entity.id}`}>
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
      <ProTable<ISubject>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              history.push('subject/add')
            }}
          >
            <PlusOutlined /> 新建
          </Button>
        ]}
        request={async params => {
          console.log(params, 'params')
          const { current, pageSize, name: wd, mcid, language, area, isend, updated_at, weekday } = params
          const param = {
            current,
            pageSize,
            filter: JSON.stringify({
              wd,
              mcid,
              language,
              area,
              isend,
              weekday,
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
