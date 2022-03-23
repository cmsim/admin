import { FC, useMemo, useState, useEffect, useRef } from 'react'
import { message, Cascader, Form, Button } from 'antd'
import ProForm, {
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormInstance,
  ProFormList,
  ProFormRate,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormTimePicker
} from '@ant-design/pro-form'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import Field from '@ant-design/pro-field'

import styles from './style.less'
import { useModel, useParams, useHistory } from 'umi'
import { areaEnum, getListFormat, languageEnum, statusType } from '@/utils'
import UploadImage from '@/components/Upload'
import { CloseOutlined, SnippetsOutlined } from '@ant-design/icons'
import { subjectAdd, subjectDetail, subjectName } from '@/services/subject'
import { ISubject } from '@/services/typings'
import { getVideo } from '@/services/video'
import moment from 'moment'

const { Item } = Form

const SubjectEdit: FC = () => {
  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const formRef = useRef<ProFormInstance<ISubject>>()
  const [color, setColor] = useState('')
  const [bgColor, setBgColor] = useState('')
  const [loading, setLoading] = useState(false)
  const [doubanLoading, setDoubanLoading] = useState(false)
  const [biliLoading, setBiliLoading] = useState(false)
  const { categoryList, getCategoryList } = useModel('useList')
  const { mcat, getMcat } = useModel('useMcat')
  const { play, getPlay } = useModel('usePlay')

  useEffect(() => {
    getMcat()
  }, [getMcat])

  useEffect(() => {
    getCategoryList()
  }, [getCategoryList])

  useEffect(() => {
    getPlay()
  }, [getPlay])

  useEffect(() => {
    formRef.current?.setFieldsValue({ color })
  }, [color])

  useEffect(() => {
    formRef.current?.setFieldsValue({ bg_color: bgColor })
  }, [bgColor])

  const playEunm = useMemo(() => {
    return play.reduce((obj, item) => {
      obj[item.title!] = item.name
      return obj
    }, {}) as { [key: string]: string }
  }, [play])

  const getMedia = async (index: number) => {
    setLoading(true)
    const play = formRef.current?.getFieldValue('play')
    const { title, id } = play[index] || {}
    const res = await getVideo({ title, id })
    play[index].urls = res.data.join('')
    formRef.current?.setFieldsValue({ play })
    setLoading(false)
  }

  const findMcid = (arr: string[]) => {
    return mcat.reduce((list, item) => {
      if (arr.includes(item.name)) {
        list.push(item.id!)
      }
      return list
    }, [] as (string | number)[])
  }

  const getBili = async (index: number) => {
    setBiliLoading(true)
    const play = formRef.current?.getFieldValue('play')
    const { id } = play[index] || {}
    if (!id) {
      setBiliLoading(false)
      return message.warn('ID未填')
    }
    const res = await getVideo({ title: 'biliinfo', id })
    const removPlace = (str: string) => str.replace(/\s*/g, '')
    const { actors, staff, title, alias, origin_name, evaluate, areas, styles, publish, episode_index } = res.data
    const actorsArr = actors ? actors.split(/\n/) : []
    const actor: string[] = []
    const role: string[] = []
    const params: any = {}
    params.name = title
    params.aliases = alias
    params.foreign = origin_name
    params.content = evaluate
    params.area = areas[0].name
    params.mcid = findMcid(styles.map((item: { name: string }) => item.name))
    params.filmtime = publish.pub_date ? publish.pub_date : null
    const day = moment(params.filmtime).day()
    params.weekday = params.filmtime ? [String(day === 0 ? 7 : day)] : null
    params.broadcast = episode_index.id !== 0
    params.isend = episode_index.is_new === 1
    params.serialized = +episode_index.index || null
    params.year = '' + moment(publish.pub_date).year()
    params.tag = `${params.name}${params.foreign ? `,${params.foreign}` : ''}${
      params.aliases && params.aliases !== params.name ? `,${params.aliases}` : ''
    }`
    params.status = 'normal'
    actorsArr?.forEach((item: string) => {
      const arr = item.split('：')
      actor.push(removPlace(arr[1].split('（')[0]))
      role.push(removPlace(arr[0]))
      params.star = actor.join(',')
      params.role = role.join(',')
    })
    const staffArr = staff ? staff.split(/\n/) : []
    staffArr?.forEach((item: string) => {
      const arr = item.split('：')
      if (arr[0] === '监督' || arr[0] === '导演') {
        params.director = arr[1]
      }
      if (arr[0] === '动画制作') {
        params.company = arr[1]
      }
      if (arr[0] === '原作') {
        params.original = arr[1]
      }
    })
    formRef.current?.setFieldsValue(params)
    setBiliLoading(false)
  }

  const getDouban = async () => {
    setDoubanLoading(true)
    const id = formRef.current?.getFieldValue('douban')
    if (!id) {
      setDoubanLoading(false)
      return message.warn('豆瓣ID未填')
    }
    const res = await getVideo({ title: 'douban', id })
    console.log(res, 'res')
    if (res) {
      const {
        title,
        original_title,
        intro,
        languages,
        actors,
        aka,
        countries,
        directors,
        pubdate,
        year,
        durations,
        genres,
        episodes_count,
        rating
      } = res.data
      const filmtime = pubdate?.[0]?.split('(')?.[0] || null
      const params: any = {
        name: title,
        aliases: aka.join(','),
        foreign: original_title,
        content: intro,
        language: languages[0] === '汉语普通话' ? '国语' : languages[0],
        star: actors.map((item: { name: string }) => item.name).join(','),
        area: countries[0],
        director: directors.map((item: { name: string }) => item.name).join(','),
        filmtime,
        year,
        length: durations[0].match(/^(\d)*/)?.[0],
        mcid: findMcid(genres),
        total: episodes_count || null,
        tag: `${title}${aka.length ? `,${aka.join(',')}` : ''}`,
        gold: rating.value || null,
        weekday: filmtime ? [String(moment(filmtime).day())] : null
      }
      formRef.current?.setFieldsValue(params)
    }
    setDoubanLoading(false)
  }

  return (
    <PageContainer>
      <ProForm<ISubject>
        formRef={formRef}
        onFinish={async values => {
          console.log(values)
          subjectAdd({ ...values, id }).then(res => {
            if (res.status === 200) {
              message.success('保存成功')
              history.push('/content/subject')
            }
          })
        }}
        request={async () => {
          let data = {} as ISubject
          if (id) {
            const subject = await subjectDetail({ id })
            data = subject.data
            setColor(data.color)
            setBgColor(data.bg_color)
          }
          return data
        }}
        layout="horizontal"
        style={{ backgroundColor: '#fff', padding: 16 }}
      >
        <ProForm.Group size={5}>
          <Item label="分类" name="cid" rules={[{ required: true }]} required={false}>
            <Cascader options={getListFormat(categoryList)} placeholder="分类" style={{ width: 120 }} />
          </Item>
          <ProFormSelect name="area" width={100} valueEnum={areaEnum} placeholder="地区" />
          <ProFormSelect name="language" width={90} valueEnum={languageEnum} placeholder="语言" />
          <ProFormDatePicker width={90} name="year" placeholder="年份" fieldProps={{ picker: 'year', format: 'YYYY' }} />
          <ProFormText allowClear={false} width={80} name="letter" placeholder="首字母" />
          <ProFormText allowClear={false} width={150} name="letters" placeholder="拼音" />
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
          <ProFormSelect name="status" width={90} valueEnum={statusType} placeholder="状态" />
          <ProFormSwitch name="broadcast" label="是否放送" />
          <ProFormSwitch name="isend" label="是否连载" />
        </ProForm.Group>
        <ProFormCheckbox.Group
          name="mcid"
          label="小类"
          options={mcat.map(item => {
            return { label: item.name, value: item.id! }
          })}
        />
        <ProForm.Group size={5}>
          <ProFormText
            allowClear={false}
            width="lg"
            name="name"
            label="名称"
            placeholder="名称"
            rules={[{ required: true }]}
            required={false}
            fieldProps={{
              onBlur: async e => {
                const result = await subjectName({ name: e.target.value })
                if (result.data) {
                  return message.warn('名称已存在')
                }
              }
            }}
          />
          <ProFormText allowClear={false} width="lg" name="foreign" placeholder="外文名" />
          <ProFormDatePicker width={150} name="filmtime" placeholder="上映日期" fieldProps={{ format: 'YYYY-MM-DD' }} />
          <ProFormTimePicker width={110} name="time" fieldProps={{ format: 'HH:mm' }} placeholder="放送时间" />
        </ProForm.Group>
        <ProFormText allowClear={false} name="aliases" label="别名" placeholder="别名" />
        <ProFormText allowClear={false} name="star" label="明星" placeholder="明星" />
        <ProForm.Group size={5}>
          <ProFormText allowClear={false} width="lg" name="tag" label="标签" placeholder="标签" />
          <ProFormText allowClear={false} name="original" placeholder="原作" />
          <ProFormText allowClear={false} name="director" placeholder="监督/导演" />
          <ProFormText allowClear={false} name="company" placeholder="动画制作" />
          <ProFormText allowClear={false} name="title" placeholder="副标题" />
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
              home: '首页推荐',
              list: '列表推荐',
              thumb: '封面推荐',
              quarter: '季番推荐'
            }}
            placeholder="推荐级别"
          />
          <ProFormText allowClear={false} width={150} name="label" placeholder="关联别名" />
          <ProFormText allowClear={false} width={80} name="uid" placeholder="用户id" />
          <ProFormText allowClear={false} width={120} name="inputer" placeholder="发布人" />
          <ProFormDigit width={80} name="serialized" placeholder="连载" />
          <ProFormDigit width={80} name="total" placeholder="总集数" />
          <ProFormDigit allowClear={false} width={60} name="gold" placeholder="评分" />
          <ProFormText allowClear={false} width={130} name="douban" placeholder="豆瓣" />
          <Button type="link" onClick={getDouban} loading={doubanLoading}>
            获取
          </Button>
          <ProFormText allowClear={false} width={130} name="imdb" placeholder="IMDB" />
        </ProForm.Group>
        <ProForm.Group size={5}>
          <ProFormText allowClear={false} width="lg" name="website" label="官网" placeholder="官网" />
          <ProFormText allowClear={false} width="lg" name="baike" placeholder="百科" />
          <ProFormSelect width="lg" mode="tags" name="associate" placeholder="关联剧集" />
        </ProForm.Group>
        <ProForm.Group>
          <Item name="pic" label="封面" rules={[{ required: true }]} required={false}>
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
        <ProFormList
          name="play"
          copyIconProps={{
            Icon: SnippetsOutlined
          }}
          deleteIconProps={{
            Icon: CloseOutlined
          }}
          min={1}
          max={4}
          creatorRecord={{
            title: 'bilibili'
          }}
          actionGuard={{
            beforeAddRow: async (defaultValue, insertIndex, count) => {
              return new Promise(resolve => {
                console.log(defaultValue, insertIndex, count)
                setTimeout(() => resolve(true), 100)
              })
            },
            beforeRemoveRow: async (index, count) => {
              console.log('--->', index, count)
              return new Promise(resolve => {
                if (index === 0) {
                  resolve(false)
                  return
                }
                setTimeout(() => resolve(true), 100)
              })
            }
          }}
          itemRender={({ listDom, action }, { record, index }) => {
            return (
              <ProCard
                bordered
                extra={
                  <div style={{ display: 'flex' }}>
                    <Button type="link" onClick={() => getMedia(index)} loading={loading}>
                      获取
                    </Button>
                    {record?.title === 'bilibili' && (
                      <Button type="link" onClick={() => getBili(index)} loading={biliLoading}>
                        获取信息
                      </Button>
                    )}
                    {action}
                  </div>
                }
                title={playEunm[record?.title]}
                style={{
                  marginBottom: 8
                }}
              >
                {listDom}
              </ProCard>
            )
          }}
        >
          <ProForm.Group key="group">
            <ProFormSelect key="title" width="md" name="title" label="来源" valueEnum={playEunm} />
            <ProFormText key="id" width="md" name="id" label="源id" />
          </ProForm.Group>
          <ProFormTextArea key="urls" width={1000} fieldProps={{ rows: 6 }} name="urls" label="链接" placeholder="链接" />
        </ProFormList>
        <ProFormTextArea name="content" label="简介" placeholder="简介" />
        <ProFormSwitch name="isShowMore" label="是否显示更多" />
        <ProFormDependency name={['isShowMore']}>
          {({ isShowMore }) => {
            if (isShowMore) {
              return (
                <>
                  <ProFormTextArea name="remark" label="简评" placeholder="简评" />
                  <ProFormTextArea name="other" label="其他" placeholder="其他" />
                  <ProForm.Group>
                    <ProFormText allowClear={false} name="seo_title" label="标题" placeholder="seo标题" />
                    <ProFormText allowClear={false} name="seo_keywords" label="关键字" placeholder="seo关键字" />
                    <ProFormText allowClear={false} width="lg" name="jumpurl" label="跳转链接" placeholder="跳转链接" />
                    <ProFormRate name="stars" label="星级" />
                  </ProForm.Group>
                  <ProFormTextArea name="seo_description" label="简介" placeholder="seo简介" />
                  <ProForm.Group>
                    <ProFormDatePicker
                      name="updated_at"
                      placeholder="更新时间"
                      label="更新"
                      fieldProps={{ format: 'YYYY-MM-DD HH:mm:ss' }}
                    />
                    <ProFormDatePicker
                      name="created_at"
                      placeholder="更新时间"
                      label="创建"
                      fieldProps={{ format: 'YYYY-MM-DD HH:mm:ss' }}
                    />
                    <ProFormDigit width="xs" label="访问" name="hits" placeholder="总" />
                    <ProFormDigit width="xs" label="日" name="hits_day" placeholder="日" />
                    <ProFormDigit width="xs" label="周" name="hits_week" placeholder="周" />
                    <ProFormDigit width="xs" label="月" name="hits_month" placeholder="月" />
                    <ProFormDigit width="xs" label="顶" name="up" placeholder="顶" />
                    <ProFormDigit width="xs" label="踩" name="down" placeholder="踩" />
                  </ProForm.Group>
                </>
              )
            }
            return null
          }}
        </ProFormDependency>
      </ProForm>
    </PageContainer>
  )
}

export default SubjectEdit
