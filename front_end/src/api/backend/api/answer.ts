import { request, type RequestOptions } from '@/utils/request';

/**
 *
 * @param body
 * @param options
 */
export async function createAnswer(body: API.CreateAnswerDto, options?: RequestOptions) {
  return request<any>('/api/answer/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
// TODO: lấy danh sách tất cả câu hỏi đề thi theo examId
export async function getAnswerList(examId: number, options?: RequestOptions) {
  return request<any>(`/api/answer/list/${examId}`, {
    method: 'GET',
    ...(options || {}),
  });
}
// TODO: cập nhật thông tin của một câu hỏi
export async function updateAnswer(
  id: number,
  body: API.CreateAnswerDto,
  options?: RequestOptions,
) {
  return request<any>(`/api/answer/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
// TODO: xóa một câu hỏi
export async function deleteAnswer(id: number, options?: RequestOptions) {
  return request<any>(`/api/answer/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
