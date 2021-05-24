import { Urls, Methods } from '@/constants'
import { fetch, prefix } from '@/utils'

/**
 * 登录
 * @param {* 参数 } params
 */
export async function login(params?: any, opts?: any) {
  return fetch(`${prefix}${Urls.queryAuthLogin}`, params, opts)
}

/**
 * 注册
 * @param {* 参数 } params
 */
export async function init(params?: any, opts?: any) {
  return fetch(`${prefix}${Urls.queryAuthReg}`, params, opts)
}

/**
 * 判断是否有管理员
 * @param {* 参数 } params
 */
export async function exist(params?: any, opts?: any) {
  return fetch(`${prefix}${Urls.queryBaseInit}`, params, opts, Methods.GET)
}
