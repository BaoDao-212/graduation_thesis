import type { RouteRecordRaw } from 'vue-router';
import RouterView from '@/layout/routerView/index.vue';
import { t } from '@/hooks/useI18n';

const moduleName = 'exam';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/exam',
    name: moduleName,
    redirect: { name: `${moduleName}-list` },
    component: RouterView,
    meta: {
      title: t('routes.exam.exam'),
      icon: 'ant-design:desktop-outlined',
    },
    children: [
      {
        path: 'list',
        name: `${moduleName}-list`,
        meta: {
          title: t('routes.exam.list'),
          icon: 'ant-design:desktop-outlined',
          keepAlive: true,
        },
        component: () => import('@/views/exam/index.vue'),
      },
    ],
  },
];

export default routes;
