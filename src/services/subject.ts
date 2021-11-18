import { request } from 'umi';
import type { ISubject, ISubjectList } from './typings';

/** 获取剧集详情 GET /backend/subject/:id */
export async function subjectDetail(options?: Record<string, any>) {
  return request<{
    data: ISubject;
  }>('/backend/subject/:id', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取剧集列表 GET /backend/subject/list */
export async function subjectList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: Record<string, any>,
) {
  return request<ISubjectList>('/backend/subject/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 添加剧集 POST /api/subject/add */
export async function subjectAdd(body: API.LoginParams, options?: Record<string, any>) {
  return request<API.LoginResult>('/backend/subject/add', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 编辑剧集 POST /api/subject/add */
export async function subjectEdit(body: API.LoginParams, options?: Record<string, any>) {
  return request<API.LoginResult>('/backend/subject/edit', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 删除剧集 DELETE /api/subject/delete */
export async function subjectDelete(options?: Record<string, any>) {
  return request<Record<string, any>>('/backend/subject/delete', {
    method: 'DELETE',
    ...(options || {}),
  });
}
