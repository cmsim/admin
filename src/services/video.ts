import { request } from 'umi'

/** 获取视频网站URL GET /backend/video/${title} */
export async function getVideo(
  params: {
    title?: string
    id?: string
  },
  options?: Record<string, any>
) {
  const { title } = params
  delete params.title
  return request<{
    data: any
  }>(`/backend/video/${title}`, {
    method: 'GET',
    params,
    ...(options || {})
  })
}
