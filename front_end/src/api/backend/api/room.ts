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