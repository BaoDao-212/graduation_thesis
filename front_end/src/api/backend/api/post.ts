// @ts-ignore
/* eslint-disable */
import { request, type RequestOptions } from '@/utils/request';

export async function listPublicPostAll(params: API.PostListParams, options?: RequestOptions) {
  return request<{
    posts: any;
    items?: API.TaskEntity[];
  }>('/api/post/list-all', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
// TODO: thêm bài viết mới
export async function createPost(body: API.PostDto, options?: RequestOptions) {
  return request<any>('/api/post/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
// TODO: xem chi tiết bài viết
export async function detailPost(id: number, options?: RequestOptions) {
  return request<any>(`/api/post/detail/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}