import type { IList, IMcat } from '@/services/typings'

/**
 * 返回逗号隔开的小分类ID
 * @param mcat 小分类列表
 * @param find 查找的小分类
 * @param format 是否需要格式化成字符串
 * @returns string
 */

export const findMcat = (mcat: IMcat[], find: string, format = false) => {
  const findArr = find.split(',')
  const arr: IMcat[] = []
  mcat.forEach(item => {
    if (findArr.includes(String(item.id))) {
      arr.push(item)
    }
  })
  return format ? arr.map(item => item.name).join(',') : arr
}

/**
 * 格式化分类列表
 * @param list 分类列表
 * @returns array
 */

export const getListFormat = (list: IList[]) => {
  const data: { value: number | string; label: string; children?: any[] }[] = []
  list.forEach(item => {
    if (item.pid === '0') {
      data.push({ value: item.id!, label: item.name!, children: [] })
    }
    const i = data.findIndex(s => s.value === item.pid)
    if (i !== -1 && data[i].children) {
      data[i].children?.push({ value: item.id!, label: item.name! })
    }
  })
  return data
}

/**
 * 格式化分类列表
 * @param list 分类列表
 * @returns array
 */

export const getList = (list: IList[]) => {
  const data: ({ sub?: IList[] } & IList)[] = []
  list.forEach(item => {
    if (item.pid === '0') {
      data.push({ ...item, sub: [] })
    }
  })
  data.forEach(item => {
    const arr = list.filter(s => s.pid === item.id)
    if (arr.length) {
      item.sub = arr
    }
  })
  return data
}

/**
 * 格式化分类和小分类合并
 * @param list 分类列表
 * @param sub 小分类列表
 * @returns array
 */

export const getListMcat = (list: IList[], sub: IMcat[]) => {
  const data: ({ sub?: IMcat[] } & IList)[] = []
  list.forEach(item => {
    if (item.pid === '0') {
      data.push({ ...item, sub: [] })
    }
  })
  data.forEach(item => {
    const arr = sub.filter(s => s.cid === item.id)
    if (arr.length) {
      item.sub = arr
    }
  })
  return data
}

/**
 * 判断是否是数字
 * @param val 参数
 * @returns boolean
 */

export const isRealNum = (val: any) => {
  // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
  if (val === '' || val == null) {
    return false
  }
  if (!isNaN(val) && typeof val === 'number') {
    return true
  } else {
    return false
  }
}

/**
 * 把id转成string
 * @param data 需要转换的数据
 * @returns 返回id转成string
 */
export const idToStr = (data: any[]) => {
  data.forEach(item => {
    if (isRealNum(item.id)) {
      item.id = String(item.id)
    }
    if (isRealNum(item.pid)) {
      item.pid = String(item.pid)
    }
    if (isRealNum(item.cid)) {
      item.cid = String(item.cid)
    }
    if (isRealNum(item.mid)) {
      item.mid = String(item.mid)
    }
    if (isRealNum(item.sid)) {
      item.sid = String(item.sid)
    }
  })
  return data
}

/* 模型sid */
export enum modelName {
  SUBJECT = 1, // 剧集
  NEWS, // 新闻
  STAR, // 明星
  STORY, // 剧情
  EPISODE, // 分集
  ROLE, // 角色
  FAVORITE, // 收藏评分表
  TAG, // 标签
  PINS, // 动态
  FORWARD, // 转发
  COMMENT, // 评论表
  REPLY, // 评论回复表
  FEED, // 关联动态表
  TOPIC, // 话题表
  DETAILEDLIST, // 清单
  ACOTR, // 演员表
  USER
}

export const modelEnName = {
  [modelName.SUBJECT]: 'subject',
  [modelName.NEWS]: 'news',
  [modelName.STAR]: 'star',
  [modelName.STORY]: 'story',
  [modelName.EPISODE]: 'episode',
  [modelName.ROLE]: 'role',
  [modelName.FAVORITE]: 'favorite',
  [modelName.TAG]: 'tag',
  [modelName.PINS]: 'pins',
  [modelName.FORWARD]: 'forward',
  [modelName.COMMENT]: 'comment',
  [modelName.REPLY]: 'reply',
  [modelName.FEED]: 'feed',
  [modelName.TOPIC]: 'topic',
  [modelName.DETAILEDLIST]: 'detailedlist',
  [modelName.ACOTR]: 'actor',
  [modelName.USER]: 'user'
}

export const modelType = {
  [modelName.SUBJECT]: '剧集',
  [modelName.NEWS]: '新闻',
  [modelName.STAR]: '明星',
  [modelName.STORY]: '剧情',
  [modelName.EPISODE]: '分集',
  [modelName.ROLE]: '角色',
  [modelName.FAVORITE]: '评分',
  [modelName.TAG]: '标签',
  [modelName.PINS]: '动态',
  [modelName.FORWARD]: '转发',
  [modelName.COMMENT]: '评论',
  [modelName.REPLY]: '回复',
  [modelName.FEED]: '动态',
  [modelName.TOPIC]: '话题',
  [modelName.DETAILEDLIST]: '清单',
  [modelName.ACOTR]: '演员',
  [modelName.USER]: '用户'
}

export const sidObj = [
  { label: '动漫', value: modelName.SUBJECT },
  { label: '新闻', value: modelName.NEWS },
  { label: '明星', value: modelName.STAR },
  { label: '剧情', value: modelName.STORY },
  { label: '剧集', value: modelName.EPISODE },
  { label: '角色', value: modelName.ROLE },
  { label: '收藏', value: modelName.FAVORITE },
  { label: '标签', value: modelName.TAG },
  { label: '动态', value: modelName.PINS },
  { label: '转发', value: modelName.FORWARD },
  { label: '评论', value: modelName.COMMENT },
  { label: '回复', value: modelName.REPLY },
  { label: '动态', value: modelName.FEED },
  { label: '话题', value: modelName.TOPIC },
  { label: '清单', value: modelName.DETAILEDLIST },
  { label: '演员', value: modelName.ACOTR },
  { label: '用户', value: modelName.USER }
]
/**
 * 格式模型
 * @returns 返回模型名称
 */
export const sidEnum = () => {
  let obj = {}
  sidObj.forEach(item => {
    obj = {
      ...obj,
      [item.value!]: {
        text: item.label
      }
    }
  })
  return obj
}

export const statusType = {
  0: { text: '正常', status: 'Success' },
  1: { text: '禁用', status: 'Error' },
  2: { text: '审核中', status: 'Processing' },
  3: { text: '审核拒绝', status: 'Warning' },
  4: { text: '审核忽略', status: 'Warning' },
  '-1': { text: '删除', status: 'Default' }
}
