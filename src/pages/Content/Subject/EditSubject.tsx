import UploadImage from '@/components/Upload'
import { subjectAdd, subjectDetail, subjectName } from '@/services/subject'
import { ISubject } from '@/services/typings'
import { getVideo } from '@/services/video'
import { areaEnum, getListFormat, languageEnum, modelName, statusType } from '@/utils'
import { CloseOutlined, SnippetsOutlined } from '@ant-design/icons'
import {
  ActionType,
  ModalForm,
  ProCard,
  ProForm,
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
} from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import { Button, Cascader, Form, message } from 'antd'
import moment from 'moment'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import Association from './Association'

const { Item } = Form

interface IEdit {
  actionRef: React.MutableRefObject<ActionType | undefined>
  visible: boolean
  setVisible: (visible: boolean) => void
  setEditData: (data: ISubject | undefined) => void
  editData: ISubject | undefined
}

const SubjectEdit: FC<IEdit> = props => {
  const formRef = useRef<ProFormInstance<ISubject>>()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ISubject>()
  const [doubanLoading, setDoubanLoading] = useState(false)
  const [biliLoading, setBiliLoading] = useState(false)
  const { categoryList, getCategoryList } = useModel('useList')
  const { mcat, getMcat } = useModel('useMcat')
  const { play, getPlay } = useModel('usePlay')
  const { actionRef, visible, setVisible, setEditData, editData } = props

  useEffect(() => {
    getMcat()
  }, [getMcat])

  useEffect(() => {
    getCategoryList()
  }, [getCategoryList])

  useEffect(() => {
    getPlay()
  }, [getPlay])

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
    if (res.data) {
      play[index].urls = res.data.join('')
      formRef.current?.setFieldsValue({ play })
    }
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
      return message.warn('ID??????')
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
      const arr = item.split('???')
      actor.push(removPlace(arr[1].split('???')[0]))
      role.push(removPlace(arr[0]))
      params.star = actor.join(',')
      params.role = role.join(',')
    })
    const staffArr = staff ? staff.split(/\n/) : []
    staffArr?.forEach((item: string) => {
      const arr = item.split('???')
      if (arr[0] === '??????' || arr[0] === '??????') {
        params.director = arr[1]
      }
      if (arr[0] === '????????????') {
        params.company = arr[1]
      }
      if (arr[0] === '??????') {
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
      return message.warn('??????ID??????')
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
        language: languages[0] === '???????????????' ? '??????' : languages[0],
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
    <ModalForm<ISubject>
      visible={visible}
      formRef={formRef}
      title={editData?.id ? editData.name : '??????'}
      autoFocusFirstInput
      width={1340}
      layout="horizontal"
      modalProps={{
        onCancel: () => {
          formRef.current?.resetFields()
          setEditData(undefined)
        }
      }}
      request={async () => {
        let data = {} as ISubject
        if (editData?.id) {
          const subject = await subjectDetail({ id: editData?.id })
          data = subject.data
          setData(data)
        }
        return data
      }}
      onFinish={async values => {
        console.log(values)
        const res = await subjectAdd({ ...values, id: editData?.id })
        if (res.status === 200) {
          if (editData?.id) {
            message.success('????????????')
          } else {
            message.success('????????????')
          }
          formRef.current?.resetFields()
          actionRef.current?.reload()
          return true
        } else {
          message.error(res.message)
          return false
        }
      }}
      onVisibleChange={setVisible}
    >
      <ProForm.Group size={5}>
        <Item label="??????" name="cid" rules={[{ required: true }]} required={false}>
          <Cascader options={getListFormat(categoryList)} placeholder="??????" style={{ width: 120 }} />
        </Item>
        <ProFormSelect name="area" width={100} valueEnum={areaEnum} placeholder="??????" />
        <ProFormSelect name="language" width={90} valueEnum={languageEnum} placeholder="??????" />
        <ProFormDatePicker width={90} name="year" placeholder="??????" fieldProps={{ picker: 'year', format: 'YYYY' }} />
        <ProFormText width={90} name="letter" placeholder="?????????" />
        <ProFormText width={150} name="letters" placeholder="??????" />
        <ProFormDigit width={80} name="length" placeholder="??????" />
        <ProFormSelect name="status" width={90} valueEnum={statusType} placeholder="??????" />
        <ProFormSwitch name="broadcast" label="????????????" />
        <ProFormSwitch name="isend" label="????????????" />
      </ProForm.Group>
      <ProFormCheckbox.Group
        name="mcid"
        label="??????"
        options={mcat.map(item => {
          return { label: item.name, value: item.id! }
        })}
      />
      <ProForm.Group size={5}>
        <ProFormText
          width="lg"
          name="name"
          label="??????"
          placeholder="??????"
          rules={[{ required: true }]}
          required={false}
          fieldProps={{
            onBlur: async e => {
              const name = e.target.value
              if (name) {
                const result = await subjectName({ name })
                if (result.data) {
                  return message.warn('???????????????')
                }
              }
            }
          }}
        />
        <ProFormText width="lg" name="foreign" placeholder="?????????" />
        <ProFormDatePicker width={150} name="filmtime" placeholder="????????????" fieldProps={{ format: 'YYYY-MM-DD' }} />
        <ProFormTimePicker width={110} name="time" fieldProps={{ format: 'HH:mm' }} placeholder="????????????" />
      </ProForm.Group>
      <ProFormText name="aliases" label="??????" placeholder="??????" />
      <ProFormText name="star" label="??????" placeholder="??????" />
      <ProForm.Group size={5}>
        <ProFormText width="lg" name="tag" label="??????" placeholder="??????" />
        <ProFormText name="original" placeholder="??????" />
        <ProFormText name="director" placeholder="??????/??????" />
        <ProFormText name="company" placeholder="????????????" />
        <ProFormText name="title" placeholder="?????????" />
      </ProForm.Group>
      <ProForm.Group size={5}>
        <ProFormSelect
          mode="tags"
          label="??????"
          name="weekday"
          width={180}
          valueEnum={{
            1: '???',
            2: '???',
            3: '???',
            4: '???',
            5: '???',
            6: '???',
            7: '???'
          }}
          placeholder="??????"
        />
        <ProFormSelect
          name="prty"
          width={120}
          valueEnum={{
            home: '????????????',
            list: '????????????',
            thumb: '????????????',
            quarter: '????????????'
          }}
          placeholder="????????????"
        />
        <ProFormText width={150} name="label" placeholder="????????????" />
        <ProFormDigit width={80} name="serialized" placeholder="??????" />
        <ProFormDigit width={80} name="total" placeholder="?????????" />
        <ProFormDigit width={60} name="gold" placeholder="??????" />
        <ProFormText width={130} name="douban" placeholder="??????" />
        <ProFormText width={130} name="imdb" placeholder="IMDB" />
        <Button type="link" onClick={getDouban} loading={doubanLoading}>
          ??????
        </Button>
        {editData?.id && <Association {...data!} />}
      </ProForm.Group>
      <ProForm.Group size={5}>
        <ProFormText width="lg" name="website" label="??????" placeholder="??????" />
        <ProFormText width="lg" name="baike" placeholder="??????" />
      </ProForm.Group>
      <ProForm.Group>
        <Item name="pic" label="??????" rules={[{ required: true }]} required={false}>
          <UploadImage sid={modelName.SUBJECT} />
        </Item>
        <Item name="pic_thumb" label="??????">
          <UploadImage sid={modelName.SUBJECT} />
        </Item>
        <Item name="bigpic" label="??????">
          <UploadImage sid={modelName.SUBJECT} />
        </Item>
        <Item name="bg" label="??????">
          <UploadImage sid={modelName.SUBJECT} />
        </Item>
        <ProFormText width={110} label="????????????" name="color" placeholder="????????????" fieldProps={{ type: 'color' }} />
        <ProFormText width={110} label="?????????" name="bg_color" placeholder="?????????" fieldProps={{ type: 'color' }} />
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
                    ??????
                  </Button>
                  {record?.title === 'bilibili' && (
                    <Button type="link" onClick={() => getBili(index)} loading={biliLoading}>
                      ????????????
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
          <ProFormSelect key="title" width="md" name="title" label="??????" valueEnum={playEunm} />
          <ProFormText key="id" width="md" name="id" label="???id" />
        </ProForm.Group>
        <ProFormTextArea key="urls" width={1200} fieldProps={{ rows: 6 }} name="urls" label="??????" placeholder="??????" />
      </ProFormList>
      <ProFormTextArea name="content" label="??????" placeholder="??????" fieldProps={{ rows: 6 }} />
      <ProFormSwitch name="isShowMore" label="??????????????????" />
      <ProFormDependency name={['isShowMore']}>
        {({ isShowMore }) => {
          if (isShowMore) {
            return (
              <>
                <ProFormTextArea name="remark" label="??????" placeholder="??????" />
                <ProFormTextArea name="other" label="??????" placeholder="??????" />
                <ProForm.Group>
                  <ProFormText name="seo_title" label="??????" placeholder="seo??????" />
                  <ProFormText name="seo_keywords" label="?????????" placeholder="seo?????????" />
                  <ProFormText width="lg" name="jumpurl" label="????????????" placeholder="????????????" />
                  <ProFormRate name="stars" label="??????" />
                </ProForm.Group>
                <ProFormTextArea name="seo_description" label="??????" placeholder="seo??????" />
                <ProForm.Group>
                  <ProFormDatePicker name="updated_at" placeholder="????????????" label="??????" fieldProps={{ format: 'YYYY-MM-DD HH:mm:ss' }} />
                  <ProFormDatePicker name="created_at" placeholder="????????????" label="??????" fieldProps={{ format: 'YYYY-MM-DD HH:mm:ss' }} />
                  <ProFormDigit width="xs" label="??????" name="hits" placeholder="???" />
                  <ProFormDigit width="xs" label="???" name="hits_day" placeholder="???" />
                  <ProFormDigit width="xs" label="???" name="hits_week" placeholder="???" />
                  <ProFormDigit width="xs" label="???" name="hits_month" placeholder="???" />
                  <ProFormDigit width="xs" label="???" name="up" placeholder="???" />
                  <ProFormDigit width="xs" label="???" name="down" placeholder="???" />
                  <ProFormText width="xs" name="uid" placeholder="??????id" />
                  <ProFormText width="xs" name="inputer" placeholder="?????????" />
                </ProForm.Group>
              </>
            )
          }
          return null
        }}
      </ProFormDependency>
    </ModalForm>
  )
}

export default SubjectEdit
