import type { FC } from 'react';
import { useCallback, useEffect } from 'react';
import React, { useState } from 'react';
import { message, Cascader, Form } from 'antd';
import ProForm, {
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDigit,
  ProFormRate,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormTimePicker,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { EditableProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { list } from '@/services/list';
import type { IList } from '@/services/typings';
import { mcatList } from '@/services/mcat';
import Field from '@ant-design/pro-field';

import styles from './style.less';

const { Item } = Form;

type DataSourceType = {
  id: React.Key;
  title?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    title: '活动名称一',
    decs: '这个活动真好玩',
    state: 'open',
    created_at: '2020-05-26T09:42:56Z',
  },
  {
    id: 624691229,
    title: '活动名称二',
    decs: '这个活动真好玩',
    state: 'closed',
    created_at: '2020-05-26T08:19:22Z',
  },
];

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '活动名称',
    dataIndex: 'title',
    width: '30%',
  },
  {
    title: '状态',
    key: 'state',
    dataIndex: 'state',
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
      },
    },
  },
  {
    title: '描述',
    dataIndex: 'decs',
  },
  {
    title: '操作',
    valueType: 'option',
  },
];

type ITypeList = { value: number; label: string; children?: any }[];

const SubjectEdit: FC = () => {
  const [form] = ProForm.useForm();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map((item) => item.id),
  );
  const [typelist, setTypelist] = useState<ITypeList>([]);
  const [mcat, setMcat] = useState<{ label: string; value: string }[]>([]);
  const [color, setColor] = useState('');
  const [bgColor, setBgColor] = useState('');
  const getList = useCallback(async () => {
    const res = await list();
    const data: ITypeList = [];
    res.data.forEach((item) => {
      if (item.pid === 0) {
        data.push({ value: item.id, label: item.name });
      }
    });
    data.forEach((item) => {
      const d: IList[] = res.data.filter((s) => s.pid === item.value);
      item.children = d.map((s) => {
        return { value: s.id, label: s.name };
      });
    });
    setTypelist(data);
  }, []);
  const getMcat = useCallback(async () => {
    const res = await mcatList();
    const data: any = res.data.map((item) => {
      return { label: item.name, value: item.id };
    });
    setMcat(data);
  }, []);
  useEffect(() => {
    getList();
    getMcat();
  }, [getList, getMcat]);

  useEffect(() => {
    form.setFieldsValue({ color });
  }, [color, form]);

  useEffect(() => {
    form.setFieldsValue({ bg_color: bgColor });
  }, [bgColor, form]);

  return (
    <PageContainer>
      <ProForm<{
        name: string;
        company: string;
      }>
        form={form}
        onFinish={async (values) => {
          console.log(values);
          message.success('提交成功');
        }}
        layout="horizontal"
        style={{ backgroundColor: '#fff', padding: 16 }}
      >
        <ProForm.Group size={5}>
          <Item label="分类" name="cid">
            <Cascader options={typelist} placeholder="分类" style={{ width: 130 }} />
          </Item>
          <ProFormSelect
            name="area"
            width={80}
            valueEnum={{
              open: '解决',
              closed: '已解',
            }}
            placeholder="地区"
          />
          <ProFormSelect
            name="language"
            width={80}
            valueEnum={{
              open: '未解',
              closed: '已解',
            }}
            placeholder="语言"
          />
          <ProFormSelect
            name="year"
            width={80}
            valueEnum={{
              open: '未解',
              closed: '解决',
            }}
            placeholder="年份"
          />
          <ProFormSelect
            name="broadcast"
            width={80}
            valueEnum={{
              0: '未放',
              1: '已放',
            }}
            placeholder="开播"
          />
          <ProFormText width={90} name="letter" placeholder="首字母" />
          <ProFormText width={150} name="letters" placeholder="拼音" />
          <ProFormDigit width={80} name="length" placeholder="片长" />

          <ProFormText
            allowClear={false}
            fieldProps={{
              suffix: (
                <div className={styles.editcolor}>
                  <Field
                    valueType="color"
                    mode="edit"
                    value={color}
                    onChange={(c) => setColor(c)}
                  />
                </div>
              ),
            }}
            width={110}
            name="color"
            placeholder="文字"
          />
          <ProFormText
            allowClear={false}
            fieldProps={{
              suffix: (
                <div className={styles.editcolor}>
                  <Field
                    valueType="color"
                    mode="edit"
                    value={bgColor}
                    onChange={(c) => setBgColor(c)}
                  />
                </div>
              ),
            }}
            width={110}
            name="bg_color"
            placeholder="背景色"
          />
          <ProFormText width={100} name="inputer" placeholder="编辑" />
          <ProFormSwitch name="isend" label="是否完结" />
        </ProForm.Group>
        <ProFormCheckbox.Group name="checkbox" label="小类" options={mcat} />
        <ProForm.Group size={5}>
          <ProFormText width="lg" name="name" label="名称" placeholder="名称" />
          <ProFormText width="lg" name="foreign" placeholder="外文名" />
          <ProFormDatePicker width={150} name="time" placeholder="放送时间" />
          <ProFormTimePicker
            width={110}
            name="filmtime"
            fieldProps={{ format: 'HH:mm' }}
            placeholder="上映日期"
          />
        </ProForm.Group>
        <ProFormText name="aliases" label="别名" placeholder="别名" />
        <ProFormText name="star" label="明星" placeholder="明星" />
        <ProForm.Group size={5}>
          <ProFormText width="lg" name="tag" label="标签" placeholder="标签" />
          <ProFormText name="original" placeholder="原作" />
          <ProFormText name="director" placeholder="监督/导演" />
          <ProFormText name="company" placeholder="公司" />
          <ProFormText name="title" placeholder="副标题" />
        </ProForm.Group>
        <ProForm.Group size={5}>
          <ProFormSelect
            mode="tags"
            label="星期"
            name="weekday"
            width={180}
            valueEnum={{
              1: '一',
              2: '二',
              3: '三',
              4: '四',
              5: '五',
              6: '六',
              7: '日',
            }}
            placeholder="星期"
          />
          <ProFormSelect
            name="prty"
            width={120}
            valueEnum={{
              1: '首页推荐',
              2: '列表推荐',
              3: '封面推荐',
              4: '季番推荐',
            }}
            placeholder="推荐级别"
          />
          <ProFormText width={150} name="label" placeholder="关联别名" />
          <ProFormText width={100} name="uid" placeholder="用户id" />
          <ProFormDigit width={110} name="serialized" placeholder="连载" />
          <ProFormDigit width={110} name="total" placeholder="总集数" />
          <ProFormText width={110} name="douban" placeholder="豆瓣" />
          <ProFormText width={110} name="imdb" placeholder="IMDB" />
          <ProFormRate name="stars" label="星级" />
        </ProForm.Group>
        <ProForm.Group size={5}>
          <ProFormText width="lg" name="website" label="官网" placeholder="官网" />
          <ProFormText width="lg" name="baike" placeholder="百科" />
          <ProFormText width="lg" name="jumpurl" placeholder="跳转" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormUploadButton
            name="pic"
            label="封面"
            max={2}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
            }}
            action="/upload.do"
          />
          <ProFormUploadButton
            name="pic_thumb"
            label="小图"
            max={2}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
            }}
            action="/upload.do"
          />
          <ProFormUploadButton
            name="bigpic"
            label="大图"
            max={2}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
            }}
            action="/upload.do"
          />
        </ProForm.Group>

        <ProFormTextArea name="remark" label="简评" placeholder="简评" />
        <ProFormTextArea name="other" label="其他" placeholder="其他" />
        <ProFormTextArea name="url" label="播放" placeholder="播放" />
        <ProFormTextArea name="content" label="简介" placeholder="简介" />

        {/**
         * id: { type: INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, comment: '自增id' },
      cid: { type: INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, comment: '分类id' },
      uid: { type: INTEGER.UNSIGNED, defaultValue: 0, comment: '用户id' },
      mcid: { type: STRING(255), defaultValue: '', comment: '小分类' },
      name: { type: STRING(255), allowNull: false, defaultValue: '', comment: '名字' },
      foreign: { type: STRING(255), defaultValue: '', comment: '外文名' },
      aliases: { type: STRING(255), defaultValue: '', comment: '别名' },
      title: { type: STRING(255), allowNull: false, defaultValue: '', comment: '副标题' },
      tag: { type: STRING(255), defaultValue: '', comment: '标签' },
      label: { type: STRING(255), defaultValue: '', comment: '关联别名例:第1季|第2季' },
      color: { type: CHAR(8), defaultValue: '', comment: '标题颜色' },
      bg_color: { type: CHAR(8), defaultValue: '', comment: '背景颜色' },
      star: { type: TEXT, defaultValue: '', comment: '明星' },
      director: { type: STRING(255), defaultValue: '', comment: '导演' },
      pic: { type: STRING(255), defaultValue: '', comment: '封面' },
      pic_thumb: { type: STRING(255), defaultValue: '', comment: '小图' },
      bigpic: { type: STRING(255), defaultValue: '', comment: '大图' },
      website: { type: STRING(255), defaultValue: '', comment: '官网' },
      original: { type: STRING(255), defaultValue: '', comment: '漫画原作' },
      company: { type: STRING(255), defaultValue: '', comment: '制作公司' },
      remark: { type: STRING(255), defaultValue: '', comment: '简评' },
      baike: { type: STRING(255), defaultValue: '', comment: '百科网址' },
      time: { type: CHAR(10), defaultValue: '', comment: '放送时间' },
      area: { type: CHAR(10), defaultValue: '', comment: '地区' },
      language: { type: CHAR(10), defaultValue: '', comment: '语言' },
      play: { type: STRING(255), defaultValue: '', comment: '播放源英文名，以$$$分隔' },
      inputer: { type: STRING(30), defaultValue: '', comment: '录入人' },
      jumpurl: { type: STRING(150), defaultValue: '', comment: '跳转url' },
      letter: { type: CHAR(2), defaultValue: '', comment: '首字母' },
      letters: { type: STRING(255), defaultValue: '', comment: '拼音' },
      seo_title: { type: STRING(255), defaultValue: '', comment: 'seo标题' },
      seo_keywords: { type: STRING(255), defaultValue: '', comment: 'seo关键字' },
      seo_description: { type: STRING(255), defaultValue: '', comment: 'seo简介' },
      filmtime: { type: STRING(255), defaultValue: '', comment: '上映日期' },
      length: { type: STRING(255), defaultValue: '', comment: '片长' },
      url: { type: TEXT('long'), defaultValue: '', comment: '播放集合，以$$$分隔' },
      content: { type: TEXT, defaultValue: '', allowNull: false, comment: '简介' },
      other: { type: TEXT('long'), defaultValue: '', allowNull: false, comment: '其他项' },
      prty: { type: TINYINT.UNSIGNED, defaultValue: 0, comment: '推荐级别' },
      year: { type: INTEGER.UNSIGNED, defaultValue: 0, comment: '年份' },
      serialized: { type: INTEGER.UNSIGNED, defaultValue: 0, comment: '连载' },
      total: { type: INTEGER.UNSIGNED, defaultValue: 0, comment: '总集数' },
      isend: { type: TINYINT.UNSIGNED, defaultValue: 0, comment: '是否完结' },
      stars: { type: TINYINT.UNSIGNED, defaultValue: 0, comment: '星级' },
      up: { type: INTEGER.UNSIGNED, defaultValue: 0, comment: '顶' },
      down: { type: INTEGER.UNSIGNED, defaultValue: 0, comment: '踩' },
      rank: { type: TINYINT.UNSIGNED, defaultValue: 0, comment: '播放源排序' },
      gold: { type: DECIMAL(3, 1), defaultValue: 0.0, comment: '评分' },
      weekday: { type: TINYINT.UNSIGNED, defaultValue: 0, comment: '星期' },
      douban: { type: INTEGER.UNSIGNED, defaultValue: 0, comment: '豆瓣id' },
      imdb: { type: INTEGER.UNSIGNED, defaultValue: 0, comment: 'IMDB' },
      broadcast: { type: TINYINT.UNSIGNED, defaultValue: 1, comment: '是否开播0:未放送1:已放送' },
      ip: { type: INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, comment: 'IP' },
      status: { type: INTEGER.UNSIGNED, allowNull: true, defaultValue: 0, comment: '状态：0正常 1禁用 2审核中 3审核拒绝 4审核忽略 -1删除' },
      comment_count: { type: BIGINT.UNSIGNED, allowNull: false, defaultValue: 0, comment: '评论数' },
      like_count: { type: BIGINT.UNSIGNED, allowNull: false, defaultValue: 0, comment: '点赞数' },
      forward_count: { type: BIGINT.UNSIGNED, allowNull: false, defaultValue: 0, comment: '转发数' },
      hits: { type: BIGINT.UNSIGNED, allowNull: true, defaultValue: 0, comment: '总' },
      hits_day: { type: BIGINT.UNSIGNED, allowNull: true, defaultValue: 0, comment: '日' },
      hits_week: { type: BIGINT.UNSIGNED, allowNull: true, defaultValue: 0, comment: '周' },
      hits_month: { type: BIGINT.UNSIGNED, allowNull: true, defaultValue: 0, comment: '月' },
      hits_lasttime: { type: DATE, allowNull: false, defaultValue: NOW, comment: '热度更新时间' },
      created_at: { type: DATE, allowNull: false, defaultValue: NOW, comment: '创建时间' },
      updated_at: { type: DATE, allowNull: false, defaultValue: NOW, comment: '更新时间' },
      deleted_at: { type: DATE, defaultValue: 'NULL', comment: '删除时间' }
         *
         */}

        <ProForm.Item
          label="数组数据"
          name="dataSource"
          initialValue={defaultData}
          trigger="onValuesChange"
        >
          <EditableProTable<DataSourceType>
            rowKey="id"
            toolBarRender={false}
            columns={columns}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              position: 'bottom',
              record: () => ({
                id: Date.now(),
              }),
            }}
            editable={{
              type: 'multiple',
              editableKeys,
              onChange: setEditableRowKeys,
              actionRender: (row, _, dom) => {
                return [dom.delete];
              },
            }}
          />
        </ProForm.Item>
        <ProForm.Group>
          <ProFormText name="seo_title" label="标题" placeholder="seo标题" />
          <ProFormText name="seo_keywords" label="关键字" placeholder="seo关键字" />
        </ProForm.Group>
        <ProFormTextArea name="seo_description" label="简介" placeholder="seo简介" />
      </ProForm>
    </PageContainer>
  );
};

export default SubjectEdit;
