import { request } from 'umi'
import type { IAttachment, IListResponse, ISts } from './typings'

/** 异步获取临时密钥 GET /backend/sts/init */
export async function stsInit(params?: { prefix?: string }, options?: Record<string, any>) {
  return request<{ data: ISts }>('/backend/sts/init', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 添加附件 POST /backend/attachment/add */
export async function attachmentAdd(body: IAttachment, options?: Record<string, any>) {
  return request<{ data: IAttachment }>('/backend/attachment/add', {
    method: 'POST',
    data: body,
    ...(options || {})
  })
}

/** 获取附件列表 GET /backend/attachment/list */
export async function attachmentList(
  params: {
    // query
    /** 当前的页码 */
    current?: number
    /** 页面的容量 */
    pageSize?: number
  },
  options?: Record<string, any>
) {
  return request<IListResponse<IAttachment>>('/backend/attachment/list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}
