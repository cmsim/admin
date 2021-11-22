import { settingAdd } from '@/services/setting';
import type { ISetting } from '@/services/typings';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { Button, message } from 'antd';
import { useCallback, useRef, useState, useEffect } from 'react';
import { Link, useModel } from 'umi';

const Setting = () => {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<ISetting[]>([]);
  const { setting, getSetting } = useModel('useSetting');

  const getData = useCallback(async () => {
    getSetting();
  }, [getSetting]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    actionRef.current?.reload?.();
  }, [setting]);

  const columns: ProColumns<ISetting>[] = [
    {
      title: 'key',
      dataIndex: 'key',
    },
    {
      title: '值',
      dataIndex: 'value',
    },
    {
      title: '备注',
      dataIndex: 'tag',
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
            action?.startEditable?.(record.id!);
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
  return (
    <PageContainer>
      <EditableProTable
        columns={columns}
        actionRef={actionRef}
        request={async () => {
          return {
            data: setting,
            success: true,
          };
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
          </Link>,
        ]}
        value={setting}
        recordCreatorProps={{
          record: () => ({ id: (Math.random() * 1000000).toFixed(0) } as ISetting),
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (_, data) => {
            if (typeof data.id === 'string') {
              delete data.id;
            }
            settingAdd({ ...data }).then((res) => {
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
          },
          onChange: setEditableRowKeys,
        }}
      />
    </PageContainer>
  );
};

export default Setting;
