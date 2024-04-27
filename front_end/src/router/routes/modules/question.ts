import type { RouteRecordRaw } from 'vue-router';
import RouterView from '@/layout/routerView/index.vue';
import { t } from '@/hooks/useI18n';

const moduleName = 'question';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/question',
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
        component: () => import('@/views/question/index.vue'),
      },
      {
        path: 'update/:id',
        name: `${moduleName}-update`,
        meta: {
          title: t('routes.question.update'),
          keepAlive: true,
          hideInMenu: true,
        },
        component: () => import('@/views/question/crud/update.vue'),
      },
    ],
  },
];

export default routes;
