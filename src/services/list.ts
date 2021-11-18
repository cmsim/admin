import { request } from 'umi';
import type { IList } from './typings';

/** 小分类列表 GET /backend/list/list */
export async function list(options?: Record<string, any>) {
  return request<{ data: IList[] }>('/backend/list/list', {
    method: 'GET',
    ...(options || {}),
  });
}
