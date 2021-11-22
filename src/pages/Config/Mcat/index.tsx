import { Button, message } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { EditableProTable } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import type { IList, IMcat } from '@/services/typings';
import { getListMcat, sidEnum } from '@/utils';
import { Link, useModel } from 'umi';
import { mcatAdd } from '@/services/mcat';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const columns: ProColumns<IList>[] = [
  {
    title: '名称',
    width: 120,
    dataIndex: 'name',
  },
  {
    title: '目录',
    width: 120,
    dataIndex: 'dir',
  },
  {
    title: '排序',
    width: 120,
    dataIndex: 'rank',
  },
  {
    title: '模型',
    width: 140,
    dataIndex: 'sid',
    valueType: 'select',
    valueEnum: sidEnum(),
  },
  {
    title: '状态',
    width: 120,
    dataIndex: 'status',
  },
];

const Mcatlist = () => {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<IMcat[]>([]);
  const { categoryList, getCategoryList } = useModel('useList');
  const { mcat, getMcat } = useModel('useMcat');
  const [mcatData, setMcatData] = useState<any[]>([]);

  const getData = useCallback(async () => {
    await getCategoryList();
    await getMcat();
  }, [getCategoryList, getMcat]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    setMcatData(getListMcat(categoryList, mcat));
  }, [mcat, categoryList]);

  useEffect(() => {
    actionRef.current?.reload?.();
  }, [mcatData]);

  const cateEnum = useMemo(() => {
    let obj = {};
    categoryList.forEach((item) => {
      obj = {
        ...obj,
        [item.id!]: {
          text: item.name,
        },
      };
    });
    return obj;
  }, [categoryList]);

  const columnsMcat: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '父类',
      dataIndex: 'cid',
      valueType: 'select',
      valueEnum: cateEnum,
    },
    {
      title: '目录',
      dataIndex: 'title',
      width: 120,
    },
    {
      title: '排序',
      dataIndex: 'rank',
      width: 120,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  const expandedRowRender = (record: any) => {
    if (!record.sub?.length) return;
    return (
      <EditableProTable
        rowKey="id"
        columns={columnsMcat}
        showHeader={false}
        pagination={false}
        request={async () => ({
          data: record.sub,
          success: true,
        })}
        value={record.sub}
        recordCreatorProps={{
          record: () => ({ id: (Math.random() * 1000000).toFixed(0), cid: '1' } as IMcat),
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            if (typeof data.id === 'string') {
              delete data.id;
            }
            mcatAdd({ ...data }).then((res) => {
              if (res.status === 200) {
                if (data.id) {
                  message.success('修改成功');
                } else {
                  message.success('添加成功');
                }
                getData();
              } else {
                message.error(res.message);
              }
            });
            console.log(rowKey, data, row);
          },
          onChange: setEditableRowKeys,
        }}
      />
    );
  };
  return (
    <PageContainer>
      <ProTable<IList>
        actionRef={actionRef}
        columns={columns}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          console.log(params, sorter, filter, mcatData);
          return {
            data: mcatData,
            success: true,
          };
        }}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
        }}
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
        }}
        search={false}
        dateFormatter="string"
        headerTitle="小分类列表"
        options={false}
        toolBarRender={() => [
          <Link key="primary" to="mcat/add">
            <Button type="primary">创建应用</Button>
          </Link>,
        ]}
      />
    </PageContainer>
  );
};

export default Mcatlist;
