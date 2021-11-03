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
  const data: { value: number; label: string; children?: any[] }[] = [];
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
