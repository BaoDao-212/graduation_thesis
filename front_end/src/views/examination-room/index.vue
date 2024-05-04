<template>
    <div>
      <Card style="margin: 0 6px 0px 6px; min-width: fit-content">
        <template #title>
          <div class="flex" style="justify-content: space-between; align-items: center">
          </div>
        </template>
        <div v-if= "exam"
          class="flex"
          style="
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 4px;
          "
        >
          <div style="width: 100%; margin-top: 10px">
            <QuestionCard v-for= "q in exam.questions" :question="q" />
          </div>
        </div>
      </Card>
    </div>
  </template>
  
  <script lang="ts" setup>
    import { onBeforeMount, ref } from 'vue';
    import { Card, notification } from 'ant-design-vue';
    import { useI18n } from '@/hooks';
    import to from '@/utils/awaitTo';
    import { getExamDetail } from '@/api/backend/api/exam';
    import { useRoute } from 'vue-router';
    import QuestionCard from './component/questin-card.vue';
import { createResult } from '@/api/backend/api/room';
import { useRouter } from 'vue-router';
    const exam = ref();
    const { t } = useI18n();
    const route= useRoute();
    const getExam = async () => {
      const [err, res] = await to(
        getExamDetail(Number(route.params.id))
      );
      if (err) {
        notification.error({
          message: t('common.error'),
          description: err.message,
        });
      } else {
        exam.value = res.exam;
      }
    };
    const router = useRouter();
    const createResultForExam = async () => {
      const [err, res] = await to(
        createResult({examId: Number(route.params.id)})
      );
      if (err) {
        notification.error({
          message: t('common.error'),
          description: err.message,
        });
        router.push('/exam/list');
      } else {
        exam.value = res.exam;
      }
    };
    onBeforeMount(async () => {
        await createResultForExam();
      await getExam();
    });
  </script>
  