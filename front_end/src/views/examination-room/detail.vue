<template>
  <div>
    <Card style="margin: 0 6px 0px 6px; min-width: fit-content">
      <template #title>
        <div class="flex" style="justify-content: space-between; align-items: center">
          <div v-if="result">{{ result.exam.name }}</div>
        </div>
      </template>
      <div v-if="exam" class="flex" style="flex-direction: column; justify-content: center">
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
        <div style="margin-top: 10px; display: flex; justify-content: end">
          <Button type="primary" style="margin-top: 10px; width: 160px"> Xem đánh giá </Button>
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
  import { useRoute } from 'vue-router';
  import QuestionCard from './component/question-submited.vue';
import { viewResult } from '@/api/backend/api/room';
  const exam = ref();
  const { t } = useI18n();
  const route = useRoute();
  const result = ref();
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
    }
  };
  onBeforeMount(async () => {
    await getResult();
  });
</script>
