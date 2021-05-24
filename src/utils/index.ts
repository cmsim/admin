import request from '@/utils/request'
import qs from 'qs'

export const prefix = ''

export function fetch(url: string, params: any, opts?: any, method = 'post') {
  return (request as any)[method](url, Object.assign({}, params), opts)
}

/**
 *  get请求url 参数
 * @param {*} path
 * @param {*} query
 */
export function getQueryPath(path = '', query = {}) {
  const search = qs.stringify(query)
  if (search.length) {
    return `${path}?${search}`
  }
  return path
}
