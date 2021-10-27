import { request } from 'umi';
import type { ISubject, ISubjectList } from './typings';

/** 获取剧集详情 GET /api/subject/:id */
export async function subjectDetail(options?: Record<string, any>) {
  return request<{
    data: ISubject;
  }>('/api/subject/:id', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取剧集列表 GET /api/subject/list */
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
  return request<ISubjectList>('/api/subject/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 添加剧集 POST /api/subject/add */
export async function subjectAdd(body: API.LoginParams, options?: Record<string, any>) {
  return request<API.LoginResult>('/api/subject/add', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 编辑剧集 POST /api/subject/add */
export async function subjectEdit(body: API.LoginParams, options?: Record<string, any>) {
  return request<API.LoginResult>('/api/subject/edit', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 删除剧集 DELETE /api/subject/delete */
export async function subjectDelete(options?: Record<string, any>) {
  return request<Record<string, any>>('/api/subject/delete', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: Record<string, any>) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: Record<string, any>,
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: Record<string, any>) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: Record<string, any>) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}
