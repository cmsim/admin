import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Popover } from 'antd';
import { subjectList } from '@/services/subject';
import { mcatList } from '@/services/mcat';

import { useIntl, FormattedMessage } from 'umi';
import type { IMcat, ISubject, ISubjectList } from '@/services/typings';
import { PlusOutlined } from '@ant-design/icons';
import { findMcat } from '@/utils';

export default (): React.ReactNode => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<ISubject[]>([]);
  const [mcat, setMcat] = useState<IMcat[]>([]);

  const getMcat = useCallback(async () => {
    const res = await mcatList();
    setMcat(res.data);
  }, []);

  useEffect(() => {
    getMcat();
  }, [getMcat]);

  const mcatEnum = useMemo(() => {
    let obj = {};
    mcat.forEach((item) => {
      obj = { ...obj, [item.id]: { text: item.name, status: item.id } };
    });
    return obj;
  }, [mcat]);

  const columns: ProColumns<ISubject>[] = [
    {
      title: <FormattedMessage id="pages.searchTable.name" />,
      dataIndex: 'name',
      render: (_, entity) => (
        <Popover content={<img src={entity.pic} style={{ width: 200 }} />}>{entity.name}</Popover>
      ),
    },
    {
      title: <FormattedMessage id="pages.searchTable.mcid" />,
      dataIndex: 'mcid',
      render: (_, entity) => findMcat(mcat, entity.mcid, true),
      valueEnum: mcatEnum,
    },
    {
      title: <FormattedMessage id="pages.searchTable.language" />,
      dataIndex: 'language',
    },
    {
      title: <FormattedMessage id="pages.searchTable.area" />,
      dataIndex: 'area',
    },
    {
      title: <FormattedMessage id="pages.searchTable.isend" />,
      dataIndex: 'isend',
      hideInForm: true,
      render: (_, entity) =>
        entity.isend ? (
          <>
            <FormattedMessage id="pages.searchTable.isend.default" />({entity.serialized})
          </>
        ) : (
          <FormattedMessage id="pages.searchTable.isend.done" />
        ),
      valueEnum: {
        1: {
          text: <FormattedMessage id="pages.searchTable.isend.default" />,
          status: true,
        },
        0: {
          text: <FormattedMessage id="pages.searchTable.isend.done" />,
          status: false,
        },
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.hits" />,
      sorter: true,
      dataIndex: 'hits',
    },
    {
      title: <FormattedMessage id="pages.searchTable.updatedAt" />,
      sorter: true,
      dataIndex: 'updated_at',
      valueType: 'dateTimeRange',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" />,
      dataIndex: 'option',
      valueType: 'option',
      render: () => [
        <a key="edit">
          <FormattedMessage id="pages.searchTable.edit" />
        </a>,
        <a key="delete">
          <FormattedMessage id="pages.searchTable.delete" />
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<ISubject, ISubjectList>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => {}}>
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={(params) => {
          console.log(params, 'params');
          return subjectList(params);
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
            </div>
          }
        >
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};
