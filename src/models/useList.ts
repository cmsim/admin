import { list } from '@/services/list';
import type { IList } from '@/services/typings';
import { useState, useCallback } from 'react';

export default function useList() {
  const [categoryList, setCategoryList] = useState<IList[]>([]);

  const getCategoryList = useCallback(async () => {
    const res = await list();
    setCategoryList(res.data);
  }, []);

  return {
    categoryList,
    getCategoryList,
  };
}
