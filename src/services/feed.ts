import { request } from 'umi';
import type { IFeed, IListResponse, IFeedTable } from './typings';

/** 添加动态 POST /backend/feed/add */
export async function feedAdd(body: IFeed, options?: Record<string, any>) {
  return request<{ data: IFeed }>('/backend/feed/add', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 获取动态列表 GET /backend/feed/list */
export async function feedList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: Record<string, any>,
) {
  return request<IListResponse<IFeedTable>>('/backend/feed/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
