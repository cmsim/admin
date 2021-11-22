import { request } from 'umi';
import type { ISetting } from './typings';

/** 配置列表 GET /backend/setting/list */
export async function settingList(options?: Record<string, any>) {
  return request<{ data: ISetting[] }>('/backend/setting/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 添加配置 POST /backend/setting/add */
export async function settingAdd(body: ISetting, options?: Record<string, any>) {
  return request<{ data: ISetting[]; status: number; message: string }>('/backend/setting/add', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
