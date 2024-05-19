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
  formData.append('file', file[0]);
  return request<any>(`/exam/generate/${examId}`, {
    method: 'POST',
    data: formData,
    ...(options || {}),
  });
}
// TODO: thêm câu hỏi và đáp án vào 1 đề thi
export async function createQuestionAndExam(
  examId: number,
  body: API.CreateQuestionAndAnswerDto,
  options?: RequestOptions,
) {
  return request<any>(`/api/question/question-answer/${examId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
//TODO: đánh giá đề thi
export async function reviewExam(body: API.ReviewExamDto, options?: RequestOptions) {
  return request<any>(`/api/exam/review`, {
    method: 'PATCH',
    data: body,
    ...(options || {}),
  });
}
// TODO: tạo ra đánh giá tổng quan về bài làm của mình bằng gemini
export async function generateReviewGemini(body: API.GenerateReviewGeminiDto, options?: RequestOptions) {
  return request<any>(`/api/openai/review`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}