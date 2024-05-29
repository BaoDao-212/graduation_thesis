import type { RouteRecordRaw } from 'vue-router';
import RouterView from '@/layout/routerView/index.vue';
import { t } from '@/hooks/useI18n';

const moduleName = 'dashboard';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    name: moduleName,
    redirect: '/dashboard/welcome',
    component: RouterView,
    meta: {
      title: t('routes.dashboard.dashboard'),
      icon: 'ant-design:dashboard-outlined',
    },
    children: [
      {
        path: 'post',
        name: `${moduleName}-post`,
        meta: {
          title: t('routes.post.post'),
          icon: 'ant-design:home-filled',
        },
        component: () => import('@/views/post/index.vue'),
      },
      {
        path: 'detail/:id',
        name: `${moduleName}-detail`,
        meta: {
          title: t('routes.post.detail'),
          keepAlive: true,
          hideInMenu: true,
        },
        component: () => import('@/views/post/crud/detail.vue'),
      },
      {
        path: 'detail-user/:id',
        name: `${moduleName}-detail-user`,
        meta: {
          title: t('routes.post.detail_user'),
          keepAlive: true,
          hideInMenu: true,
        },
        component: () => import('@/views/post/profile-owner.vue'),
      },
    ],
  },
];

export default routes;
