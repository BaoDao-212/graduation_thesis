import { request, type RequestOptions } from '@/utils/request';

/**
 * 创建试卷
 * @param body
 * @param options
 */
export async function updateApiKeyOpenAI(body: API.OpenAIKey, options?: RequestOptions) {
  return request<any>('/api/openai/update-apikey', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
