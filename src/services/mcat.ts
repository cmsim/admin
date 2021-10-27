import { request } from 'umi';
import type { IMcat } from './typings';

/** 小分类列表 GET /api/mcat/list */
export async function mcatList(options?: Record<string, any>) {
  return request<{ data: IMcat[] }>('/api/mcat/list', {
    method: 'GET',
    ...(options || {}),
  });
}
