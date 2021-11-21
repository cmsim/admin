import type { IList, IMcat } from '@/services/typings';

export const findMcat = (mcat: IMcat[], find: string, format = false) => {
  const findArr = find.split(',');
  const arr: IMcat[] = [];
  mcat.forEach((item) => {
    if (findArr.includes(String(item.id))) {
      arr.push(item);
    }
  });
  return format ? arr.map((item) => item.name).join(',') : arr;
};

/**
 * 格式化分类列表
 * @param list 分类列表
 * @returns 返回级联组件需要的格式
 */

export const getListFormat = (list: IList[]) => {
  const data: { value: number | string; label: string; children?: any[] }[] = [];
  list.forEach((item) => {
    if (item.pid === 0) {
      data.push({ value: item.id!, label: item.name!, children: [] });
    }
    const i = data.findIndex((s) => s.value === item.pid);
    if (i !== -1 && data[i].children) {
      data[i].children?.push({ value: item.id!, label: item.name! });
    }
  });
  return data;
};

/**
 * 格式化分类列表
 * @param list 分类列表
 * @returns 返回级联组件需要的格式
 */

export const getList = (list: IList[]) => {
  const data: ({ sub?: IList[] } & IList)[] = [];
  list.forEach((item) => {
    if (item.pid === 0) {
      data.push({ ...item, sub: [] });
    }
  });
  data.forEach((item) => {
    const arr = list.filter((s) => s.pid === item.id);
    if (arr.length) {
      item.sub = arr;
    }
  });
  return data;
};

/**
 * 格式化分类和小分类合并
 * @param list 分类列表
 * @param sub 小分类列表
 * @returns 返回级联组件需要的格式
 */

export const getListMcat = (list: IList[], sub: IMcat[]) => {
  const data: ({ sub?: IList[] } & IList)[] = [];
  list.forEach((item) => {
    if (item.pid === 0) {
      data.push({ ...item, sub: [] });
    }
  });
  data.forEach((item) => {
    const arr = sub.filter((s) => s.cid === item.id);
    if (arr.length) {
      item.sub = arr;
    }
  });
  return data;
};

/* 模型sid */
export enum modelName {
  SUBJECT = 1, // 剧集
  NEWS, // 新闻
  STAR, // 明星
  STORY, // 剧情
  EPISODE, // 剧集
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
  USER,
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
  { label: '用户', value: modelName.USER },
];
