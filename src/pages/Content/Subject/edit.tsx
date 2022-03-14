import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import { message, Cascader, Form } from 'antd'
import ProForm, {
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDigit,
  ProFormRate,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormTimePicker
} from '@ant-design/pro-form'
import { PageContainer } from '@ant-design/pro-layout'
import { EditableProTable } from '@ant-design/pro-table'
import type { ProColumns } from '@ant-design/pro-table'
import Field from '@ant-design/pro-field'

import styles from './style.less'
import { useModel } from 'umi'
import { areaEnum, getListFormat, languageEnum, yearEnum } from '@/utils'
import UploadImage from '@/components/Upload'

const { Item } = Form

type DataSourceType = {
  id: React.Key
  title?: string
  decs?: string
  state?: string
  created_at?: string
  children?: DataSourceType[]
}

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    title: '活动名称一',
    decs: '这个活动真好玩',
    state: 'open',
    created_at: '2020-05-26T09:42:56Z'
  },
  {
    id: 624691229,
    title: '活动名称二',
    decs: '这个活动真好玩',
    state: 'closed',
    created_at: '2020-05-26T08:19:22Z'
  }
]

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '活动名称',
    dataIndex: 'title',
    width: '30%'
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
        status: 'Error'
      },
      closed: {
        text: '已解决',
        status: 'Success'
      }
    }
  },
  {
    title: '描述',
    dataIndex: 'decs'
  },
  {
    title: '操作',
    valueType: 'option'
  }
]

const SubjectEdit: FC = () => {
  const [form] = ProForm.useForm()
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>()
  const [color, setColor] = useState('')
  const [bgColor, setBgColor] = useState('')
  const { categoryList, getCategoryList } = useModel('useList')
  const { mcat, getMcat } = useModel('useMcat')

  useEffect(() => {
    getMcat()
  }, [getMcat])

  useEffect(() => {
    getCategoryList()
  }, [getCategoryList])

  useEffect(() => {
    form.setFieldsValue({ color })
  }, [color, form])

  useEffect(() => {
    form.setFieldsValue({ bg_color: bgColor })
  }, [bgColor, form])

  return (
    <PageContainer>
      <ProForm<{
        name: string
        company: string
      }>
        form={form}
        onFinish={async values => {
          console.log(values)
          message.success('提交成功')
        }}
        layout="horizontal"
        style={{ backgroundColor: '#fff', padding: 16 }}
      >
        <ProForm.Group size={5}>
          <Item label="分类" name="cid">
            <Cascader options={getListFormat(categoryList)} placeholder="分类" style={{ width: 120 }} />
          </Item>
          <ProFormSelect name="area" width={100} valueEnum={areaEnum} placeholder="地区" />
          <ProFormSelect name="language" width={90} valueEnum={languageEnum} placeholder="语言" />
          <ProFormSelect name="year" width={80} valueEnum={yearEnum} placeholder="年份" />
          <ProFormSelect
            name="broadcast"
            width={80}
            valueEnum={{
              0: '未放',
              1: '已放'
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
                  <Field valueType="color" mode="edit" value={color} onChange={c => setColor(c)} />
                </div>
              )
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
                  <Field valueType="color" mode="edit" value={bgColor} onChange={c => setBgColor(c)} />
                </div>
              )
            }}
            width={110}
            name="bg_color"
            placeholder="背景色"
          />
          <ProFormText width={100} name="inputer" placeholder="发布人" />
          <ProFormSwitch name="isend" label="是否完结" />
        </ProForm.Group>
        <ProFormCheckbox.Group
          name="checkbox"
          label="小类"
          options={mcat.map(item => {
            return { label: item.name, value: item.id! }
          })}
        />
        <ProForm.Group size={5}>
          <ProFormText width="lg" name="name" label="名称" placeholder="名称" />
          <ProFormText width="lg" name="foreign" placeholder="外文名" />
          <ProFormDatePicker width={150} name="filmtime" placeholder="上映日期" fieldProps={{ format: 'YYYY-MM-DD' }} />
          <ProFormTimePicker width={110} name="time" fieldProps={{ format: 'HH:mm' }} placeholder="放送时间" />
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
              7: '日'
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
              4: '季番推荐'
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
          <Item name="pic" label="封面">
            <UploadImage />
          </Item>
          <Item name="pic_thumb" label="小图">
            <UploadImage />
          </Item>
          <Item name="bigpic" label="大图">
            <UploadImage />
          </Item>
          <Item name="bg" label="背景">
            <UploadImage />
          </Item>
        </ProForm.Group>

        <ProFormTextArea name="remark" label="简评" placeholder="简评" />
        <ProFormTextArea name="other" label="其他" placeholder="其他" />
        <ProFormTextArea name="url" label="播放" placeholder="播放" />
        <ProFormTextArea name="content" label="简介" placeholder="简介" />

        <ProForm.Item label="数组数据" name="dataSource" initialValue={defaultData} trigger="onValuesChange">
          <EditableProTable<DataSourceType>
            rowKey="id"
            toolBarRender={false}
            columns={columns}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              position: 'bottom',
              record: () => ({
                id: Date.now()
              })
            }}
            editable={{
              type: 'multiple',
              editableKeys,
              onChange: setEditableRowKeys,
              actionRender: (row, _, dom) => {
                return [dom.delete]
              }
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
  )
}

export default SubjectEdit
