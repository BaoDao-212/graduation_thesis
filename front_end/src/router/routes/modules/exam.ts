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
      {
        path: 'generate_question',
        name: `${moduleName}-generate-question`,
        meta: {
          title: t('routes.generate_question.generate_with_ai'),
          icon: 'ant-design:desktop-outlined',
          keepAlive: true,
        },
        component: () => import('@/views/generate_question_with_AI/index.vue'),
      },
      {
        path: 'room/:id',
        name: `${moduleName}-room`,
        meta: {
          title: t('routes.exam.table.room'),
          icon: 'ant-design:desktop-outlined',
          keepAlive: true,
          hideInMenu: true,
        },
        component: () => import('@/views/examination-room/index.vue'),
      },
      {
        path: 'result/view/:id',
        name: `${moduleName}-result-exam`,
        meta: {
          title: t('routes.exam.table.result_exam'),
          icon: 'ant-design:desktop-outlined',
          keepAlive: true,
          hideInMenu: true,
        },
        component: () => import('@/views/examination-room/detail.vue'),
      },
    ],
  },
];

export default routes;
