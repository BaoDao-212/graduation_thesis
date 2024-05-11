import 'nprogress/css/nprogress.css'; // 进度条样式
import { createRouter, createWebHistory } from 'vue-router';

import { createRouterGuards } from './router-guards';

import { whiteNameList } from './constant';
import { basicRoutes } from './routes';
import type { App } from 'vue';

export const router = createRouter({
  // process.env.BASE_URL
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: basicRoutes,
});

// reset router
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name && !whiteNameList.some((n) => n === name)) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

export async function setupRouter(app: App) {
  // 创建路由守卫
  createRouterGuards(router, whiteNameList);

  app.use(router);

  // 路由准备就绪后挂载APP实例
  await router.isReady();
}
export default router;
