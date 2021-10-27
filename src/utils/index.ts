import type { IMcat } from '@/services/typings';

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
