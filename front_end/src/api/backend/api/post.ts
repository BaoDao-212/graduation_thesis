// @ts-ignore
/* eslint-disable */
import { request, type RequestOptions } from '@/utils/request';

/** 获取任务列表 GET /api/post/list-all */
export async function listPublicPostAll(
  params: API.TaskListParams,
  options?: RequestOptions,
) {
  return request<{
    items?: API.TaskEntity[];
    meta?: {
      itemCount?: number;
      totalItems?: number;
      itemsPerPage?: number;
      totalPages?: number;
      currentPage?: number;
    };
  }>('/api/post/list-all', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // pageSize has a default value: 10
      pageSize: '10',
      ...params,
    },
    ...(options || {}),
  });
}

// /** 添加任务 POST /api/system/tasks */
// export async function taskCreate(body: API.TaskDto, options?: RequestOptions) {
//   return request<any>('/api/system/tasks', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     data: body,
//     ...(options || {}),
//   });
// }

// /** 查询任务详细信息 GET /api/system/tasks/${param0} */
// export async function taskInfo(
//   // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
//   params: API.TaskInfoParams,
//   options?: RequestOptions,
// ) {
//   const { id: param0, ...queryParams } = params;
//   return request<API.TaskEntity>(`/api/system/tasks/${param0}`, {
//     method: 'GET',
//     params: { ...queryParams },
//     ...(options || {}),
//   });
// }

