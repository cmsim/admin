import { list } from '@/services/list'
import type { IList } from '@/services/typings'
import { idToStr } from '@/utils'
import { useCallback, useState } from 'react'

export default function useList() {
  const [categoryList, setCategoryList] = useState<IList[]>([])

  const getCategoryList = useCallback(async () => {
    const res = await list()
    setCategoryList(res.data)
  }, [])

  return {
    categoryList: idToStr(categoryList) as IList[],
    getCategoryList
  }
}
