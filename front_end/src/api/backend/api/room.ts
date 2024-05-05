import { request, type RequestOptions } from '@/utils/request';

/**
 * 创建试卷
 * @param body
 * @param options
 */
// TODO: tạo ra một chỗ lưu kết quả
export async function createResult(body: API.ResultDto, options?: RequestOptions) {
  return request<any>('/api/result/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
//TODO: lấy thông tin chi tiết của kết quả
export async function getResultDetail(id: number, options?: RequestOptions) {
  return request<any>(`/api/result/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}
//TODO: nộp đáp án của một câu hỏi lên server
export async function submitAnswer(body: API.SubmitAnswerDto, options?: RequestOptions) {
  return request<any>('/api/result/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function finishResult(id: number, options?: RequestOptions) {
  return request<any>(`/api/result/finish/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}
