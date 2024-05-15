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
// cho phép gửi file qua form data để tạo đề thi
export async function generateQuestions(file: any, examId: number, options?: RequestOptions) {
  const formData = new FormData();
  formData.append('file', file[0]);
  formData.append('storagePath', 'docx');
  return request<any>(`/api/openai/generate/${examId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
    ...(options || {}),
  });
}
