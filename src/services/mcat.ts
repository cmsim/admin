import { request } from 'umi';
import type { IMcat } from './typings';

/** 小分类列表 GET /backend/mcat/list */
export async function mcatList(options?: Record<string, any>) {
  return request<{ data: IMcat[] }>('/backend/mcat/list', {
    method: 'GET',
    ...(options || {}),
  });
}
