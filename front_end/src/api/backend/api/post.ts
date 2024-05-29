// @ts-ignore
/* eslint-disable */
import { request, type RequestOptions } from '@/utils/request';

export async function listPublicPostAll(params: API.PostListParams, options?: RequestOptions) {
  return request<{
    total: number | undefined;
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
//TODO: cập nhật thông tin bài viết
export async function updatePost(id: number, body: API.PostDto, options?: RequestOptions) {
  return request<any>(`/api/post/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
//TODO: xóa bài viết
export async function deletePost(id: number, options?: RequestOptions) {
  return request<any>(`/api/post/delete/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
//TODO: danh sách bài viết của người dùng khác với id
export async function listPublicPost(id: number, params: API.PostListParams, options?: RequestOptions) {
  return request<any>(`/api/post/list/${id}`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
//TODO: lấy danh sách kết quả bài thi của nguời này
export async function listResult(options?: RequestOptions) {
  return request<any>('/api/result', {
    method: 'GET',
    ...(options || {}),
  });
}