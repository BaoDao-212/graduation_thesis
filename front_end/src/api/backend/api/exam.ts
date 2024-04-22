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
