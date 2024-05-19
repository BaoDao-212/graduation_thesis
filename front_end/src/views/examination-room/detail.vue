<template>
  <div>
    <Card style="margin: 0 6px 0px 6px; min-width: fit-content">
      <template #title>
        <div class="flex" style="justify-content: space-between; align-items: center">
          <div v-if="result">{{ result.exam.name }}</div>
        </div>
      </template>
      <div v-if="exam" class="flex" style="flex-direction: column; justify-content: center">
        <DetailExam :detail="result" :question="exam.questions" :isGemini="isGeminiKey"/>
        <div style="width: 100%; margin-top: 10px; margin-bottom: 10px; overflow-y: auto">
          <QuestionCard
            v-for="q in exam.questions"
            :question="q"
            :answers="
              result.detailResult.filter((dr) => dr.question.id == q.id).length > 0
                ? result.detailResult
                    .filter((dr) => dr.question.id == q.id)[0]
                    .answer.map((a) => a.id)
                : []
            "
          />
        </div>
      </div>
    </Card>
    <ReviewExam v-if="exam"  :is-reviewed="isReviewed" :examId="exam.id"/>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue';
  import { Card, notification } from 'ant-design-vue';
  import { useI18n } from '@/hooks';
  import to from '@/utils/awaitTo';
  import { useRoute } from 'vue-router';
  import QuestionCard from './component/question-submited.vue';
  import DetailExam from './component/detail-exam.vue';
  import ReviewExam from './component/review-exam.vue';
  import { viewResult } from '@/api/backend/api/room';
  const exam = ref();
  const { t } = useI18n();
  const route = useRoute();
  const result = ref();
  const isReviewed=ref();
  const isGeminiKey=ref();
  
  const getResult = async () => {
    const [_err, res] = await to(viewResult(Number(route.params.id)));
    if (!res.ok) {
      notification.error({
        message: t('common.error'),
        description: res.error.message,
      });
    } else {
      result.value = res.result;
      exam.value = res.exam;
      isReviewed.value = res.isReviewed;
      isGeminiKey.value = res.isGeminiKey;
    }
  };
  onBeforeMount(async () => {
    await getResult();
  });
</script>
