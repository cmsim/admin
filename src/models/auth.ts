import { login, init, exist } from '@/services/api.auth'
import { DvaModel } from '@/utils/types'
/**
 * demo Models
 */
export default {
  /* 全局唯一不可重复 */
  namespace: 'auth',

  /* 初始化state */
  state: {},

  /* 用于处理异步操作和业务逻辑 不直接修改 state 就是获取从服务端获取数据，并且发起一个 action 交给 reducer */
  /* put: 用于触发action  call: 用于调用异步逻辑 支持promise  select: 用于从state里获取数据 */
  effects: {
    /** 方法需要两个参数 1. 页面传递的参数payload  2. call, put, select(可选) */
    *login({ params }, { call, put }) {
      const response = yield call(login, params)
      console.log(response, 'login')

      return response.data
    },
    *exist({ params }, { call, put }) {
      const response = yield call(exist, params)
      console.log(response, 'exist')

      return response.data
    },
    *init({ params }, { call, put }) {
      const response = yield call(init, params)
      console.log(response, 'init')

      return response.data
    }
  },

  reducers: {}
} as DvaModel
