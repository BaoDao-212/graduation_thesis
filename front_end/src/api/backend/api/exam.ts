import { request, type RequestOptions } from '@/utils/request';

/**
 * 创建试卷
 * @param body
 * @param options
 */
export async function createExam(body: API.CreateExamDto, options?: RequestOptions) {
  return request<any>('/api/exam/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
// TODO: lấy danh sách tất cả đề thi exam của current user
export async function getExamList(page?: number, pageSize?: number, options?: RequestOptions) {
  return request<any>(`/api/exam/list/?page=${page}&pageSize=${pageSize}`, {
    method: 'GET',
    ...(options || {}),
  });
}
// TODO: lấy danh sách tên tất cả đề thi exam của current user
export async function getExamNameList(options?: RequestOptions) {
  return request<any>(`/api/exam/list_name`, {
    method: 'GET',
    ...(options || {}),
  });
}
