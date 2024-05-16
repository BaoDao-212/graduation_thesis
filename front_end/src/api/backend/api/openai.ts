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
export async function generateQuestions(file: FileList, examId: number, options?: RequestOptions) {
  const formData = new FormData();
  formData.append('files', file[0]);
  if (file.length > 1) formData.append('files', file[1]);
  formData.append('storagePath', 'docx');
  return request<any>(`/api/openai/generate/${examId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
    ...(options || {}),
  });
  // const res = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/api/openai/generate/${examId}`, formData, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   },
  // });
  // return res.data;
}
