import { Button } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import type { IList, IMcat } from '@/services/typings';
import { getListMcat, sidObj } from '@/utils';
import { list } from '@/services/list';
import { Link } from 'umi';
import { mcatList } from '@/services/mcat';

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
    render: (_, entity) => sidObj[entity.sid!],
  },
  {
    title: '状态',
    width: 120,
    dataIndex: 'status',
  },
  {
    title: '操作',
    width: 164,
    key: 'option',
    valueType: 'option',
    render: (_, entity) => [
      <Link to={`typelist/edit/${entity.id}`} key="edit">
        编辑
      </Link>,
      <a key="delete">删除</a>,
    ],
  },
];

const columnsMcat: ProColumns<IMcat>[] = [
  {
    title: '名称',
    dataIndex: 'name',
    width: 120,
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
    render: (_, entity) => [
      <Link to={`mcat/edit/${entity.id}`} key="edit">
        编辑
      </Link>,
      <a key="delete">删除</a>,
    ],
  },
];

const expandedRowRender = (data: any) => {
  console.log(data);
  if (!data.sub?.length) return;
  return (
    <ProTable
      rowKey="id"
      columns={columnsMcat}
      showHeader={false}
      search={false}
      options={false}
      pagination={false}
      bordered={false}
      dataSource={data.sub}
    />
  );
};

const Mcatlist = () => {
  return (
    <PageContainer>
      <ProTable<IList>
        columns={columns}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          console.log(params, sorter, filter);
          const res = await list();
          const mact = await mcatList();
          return {
            data: getListMcat(res.data, mact.data),
            success: true,
          };
        }}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
        }}
        expandable={{ indentSize: 100, expandedRowRender: (record) => expandedRowRender(record) }}
        search={false}
        dateFormatter="string"
        headerTitle="嵌套表格"
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
