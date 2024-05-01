import type { RouteRecordRaw } from 'vue-router';
import RouterView from '@/layout/routerView/index.vue';
import { t } from '@/hooks/useI18n';

const moduleName = 'question';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/post',
    name: moduleName,
    redirect: { name: `${moduleName}-list` },
    component: RouterView,
    meta: {
      title: t('routes.question.question'),
      icon: 'ant-design:desktop-outlined',
    },
    children: [
      {
        path: 'list',
        name: `${moduleName}-list`,
        meta: {
          title: t('routes.question.list'),
          icon: 'ant-design:desktop-outlined',
          keepAlive: true,
        },
        component: () => import('@/views/post/index.vue'),
      },
    ],
  },
];

export default routes;
