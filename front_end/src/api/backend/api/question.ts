import { request, type RequestOptions } from '@/utils/request';

/**
 * 创建试卷
 * @param body
 * @param options
 */
export async function createQuestion(body: API.CreateQuestionDto, options?: RequestOptions) {
  return request<any>('/api/question/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
// TODO: lấy danh sách tất cả câu hỏi đề thi theo examId
export async function getQuestionList(examId: number, options?: RequestOptions) {
  return request<any>(`/api/question/list/${examId}`, {
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
// TODO: lấy thông tin chi tiết của một câu hỏi
export async function getQuestionById(id: number, options?: RequestOptions) {
  return request<any>(`/api/question/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}
// TODO: cập nhật thông tin của một câu hỏi
export async function updateQuestion(
  id: number,
  body: API.CreateQuestionDto,
  options?: RequestOptions,
) {
  return request<any>(`/api/question/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
