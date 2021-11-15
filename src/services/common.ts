import { request } from 'umi';
import type { IAttachment, IAttachmentList, ISts } from './typings';

/** 异步获取临时密钥 GET /api/sts/init */
export async function stsInit(params?: { prefix?: string }, options?: Record<string, any>) {
  return request<{ data: ISts }>('/api/sts/init', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 添加附件 POST /api/attachment/add */
export async function attachmentAdd(body: IAttachment, options?: Record<string, any>) {
  return request<{ data: IAttachment }>('/api/attachment/add', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 获取附件列表 GET /api/attachment/list */
export async function attachmentList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: Record<string, any>,
) {
  return request<IAttachmentList>('/api/attachment/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
