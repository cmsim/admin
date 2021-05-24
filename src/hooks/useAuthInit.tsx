import { useState } from 'react'
import { useAsync } from 'react-use'
import { useDispatch } from 'dva'

export const useAuthInit = () => {
  const dispatch = useDispatch()
  const [init, setInit] = useState(false)

  useAsync(async () => {
    const res: any = await dispatch({
      type: 'auth/exist'
    })
    setInit(res === 'init')
  }, [])

  return [init]
}
