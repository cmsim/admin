import { request } from 'umi'
import type { ISubject, IListResponse } from './typings'

/** 获取剧集详情 GET /backend/subject/:id */
export async function subjectDetail(options?: Record<string, any>) {
  return request<{
    data: ISubject
  }>('/backend/subject/:id', {
    method: 'GET',
    ...(options || {})
  })
}

/** 获取剧集列表 GET /backend/subject/list */
export async function subjectList(
  params: {
    // query
    /** 当前的页码 */
    current?: number
    /** 页面的容量 */
    pageSize?: number
  },
  options?: Record<string, any>
) {
  return request<IListResponse<ISubject>>('/backend/subject/list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 添加/编辑剧集 POST /api/subject/add */
export async function subjectAdd(body: ISubject, options?: Record<string, any>) {
  return request<{ data: ISubject; status: number; message: string }>('/backend/subject/add', {
    method: 'POST',
    data: body,
    ...(options || {})
  })
}

/** 删除剧集 DELETE /api/subject/delete */
export async function subjectDelete(options?: Record<string, any>) {
  return request<Record<string, any>>('/backend/subject/delete', {
    method: 'DELETE',
    ...(options || {})
  })
}
