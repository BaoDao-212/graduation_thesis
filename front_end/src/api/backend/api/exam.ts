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
// TODO: cập nhật thông tin của một một đề thi
export async function updateExam(id: number, body: API.CreateExamDto, options?: RequestOptions) {
  return request<any>(`/api/exam/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
// TODO: lấy thông tin chi tiết của một đề thi
export async function getExamDetail(id: number, options?: RequestOptions) {
  return request<any>(`/api/exam/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}
// cho phép gửi file qua form data để tạo đề thi
export async function generateQuestions(file: any, examId: number, options?: RequestOptions) {
  const formData = new FormData();
  console.log(file);
  formData.append('file', file[0]);
  return request<any>(`/api/openai/generate/${examId}`, {
    method: 'POST',
    data: formData,
    ...(options || {}),
  });
}
