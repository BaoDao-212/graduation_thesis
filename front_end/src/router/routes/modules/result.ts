import type { RouteRecordRaw } from 'vue-router';
import RouterView from '@/layout/routerView/index.vue';
import { t } from '@/hooks/useI18n';

const moduleName = 'result';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/result',
    name: moduleName,
    redirect: '/result',
    component: RouterView,
    meta: {
      title: t('routes.post.list_result'),
      icon: 'ant-design:dashboard-outlined',
    },
    children: [
      {
        path: 'list',
        name: `${moduleName}-list`,
        meta: {
          title: t('routes.post.list_result'),
          icon: 'ant-design:dashboard-outlined',
          keepAlive: true,
        },
        component: () => import('@/views/result/index.vue'),
      },
    ],
  },
];

export default routes;
