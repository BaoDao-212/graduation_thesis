import { request, type RequestOptions } from '@/utils/request';

/**
 * 创建试卷
 * @param body
 * @param options
 */
export async function updateApiKeyOpenAI(body: API.OpenAIKey, options?: RequestOptions) {
  return request<any>('/account/update-apikey', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
