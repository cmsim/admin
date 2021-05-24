import { notification, message } from 'antd'
import { getQueryPath } from '.'
const codeMessage: any = {
  200: '服务器成功返回请求的数据。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

const checkStatus = (response: any) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const errortext = codeMessage[response.status] || response.statusText
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext
  })
  const error: any = new Error(errortext)
  error.name = response.status
  error.response = response
  throw error
}

/**
 *  fetch 请求封装
 * @param {*} url
 * @param {*} method
 * @param {*} data
 * @param {*} timeout
 */
const request = (url: string, method = 'POST', data: any, options = { isShowMsg: true }, timeout = 5000) => {
  const token = sessionStorage.getItem('token')
  const opts: any = {
    method,
    timeout,
    credentials: 'include',
    headers: {
      'Content-Type': method == 'POST' ? 'application/json; charset=utf-8' : 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: `Bearer ${token}`
    }
  }

  if (method == 'POST') {
    opts.body = JSON.stringify(data)
  } else if (method == 'GET') {
    data && url == getQueryPath(url, data)
  }
  return fetch(url, opts)
    .then(checkStatus)
    .then(response => {
      return response.json()
    })
    .then(response => {
      if (response.status === 200) {
        return response
      } else {
        if (options.isShowMsg) {
          // message.warning(response.errmsg);
          message.warning(response.message || '网络异常 请重试 !')
        }
        return Promise.reject(response)
      }
    })
    .catch(e => {
      return Promise.reject(e)
    })
}

export default {
  get(url: string, data?: any, opts?: any) {
    return request(url, 'GET', data, opts)
  },
  post(url: string, data?: any, opts?: any) {
    return request(url, 'POST', data, opts)
  }
}
