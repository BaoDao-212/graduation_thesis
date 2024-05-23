<template>
  <div>
    <Card style="margin: 0 6px 0px 6px; min-width: fit-content">
      <template #title>
        <div class="flex" style="justify-content: space-between; align-items: center">
          <div v-if="result">{{ result.exam.name }}</div>
          <div>
            <a-statistic-countdown
              v-if="result"
              title="Countdown"
              :value="dealine"
              style="margin-right: 50px"
              @finish="onFinish"
            />
          </div>
        </div>
      </template>
      <div v-if="exam" class="flex" style="flex-direction: column; justify-content: center">
        <div style="width: 100%; margin-top: 10px; margin-bottom: 10px; overflow-y: auto">
          <QuestionCard
            v-for="q in exam.questions.slice((current - 1) * 2, current * 2)"
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
          <a-popconfirm
            :title="t('routes.exam.confirm_submited')"
            @confirm="finishExamFunc"
            :okText="t('common.okText')"
            :cancelText="t('common.cancelText')"
          >
            <Button type="primary" style="margin-top: 10px; width: 160px">
              {{ t('routes.exam.finish') }}
            </Button>
          </a-popconfirm>
        </div>
        <a-pagination
          style="margin-top: 10px; display: flex; justify-content: end"
          v-model:current="current"
          :total="exam.questions.length"
          :pageSize="2"
          show-less-items
        />
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
  import QuestionCard from './component/question-card.vue';
  import { finishResult, getResultDetail } from '@/api/backend/api/room';
  import { useRouter } from 'vue-router';
  const exam = ref();
  const { t } = useI18n();
  const route = useRoute();
  const finishExamFunc = async () => {
    const [_err, res] = await to(finishResult(Number(route.params.id)));
    if (!res.ok) {
      notification.error({
        message: t('common.error'),
        description: res.error.message,
      });
    } else {
      exam.value = res.exam;
      router.push('/exam/result/view/' + route.params.id);
    }
  };
  const onFinish = () => {
    console.log('finished!');
  };
  // const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
  const dealine = ref();
  const getExam = async () => {
    const [_err, res] = await to(getExamDetail(Number(result.value.exam.id)));
    if (!res.ok) {
      notification.error({
        message: t('common.error'),
        description: res.error.message,
      });
      router.push('/dashboard/list');
    } else {
      exam.value = res.exam;
    }
  };
  const current = ref(1);
  const result = ref();
  const router = useRouter();
  const getResult = async () => {
    const [_err, res] = await to(getResultDetail(Number(route.params.id)));
    if (!res.ok) {
      notification.error({
        message: t('common.error'),
        description: res.error.message,
      });

      if (res.error.mainReason == 'ER') router.push('/exam/result/view/' + route.params.id);
      else router.push('/dashboard/list');
    } else {
      if (res.result.score !== -1) {
        router.push('/dashboard/list');
      }
      result.value = res.result;
    }
  };
  onBeforeMount(async () => {
    await getResult();
    await getExam();
    console.log(result.value.createdAt);
    dealine.value =
      new Date(result.value.createdAt).getTime() + 1000 * 60 * result.value.time + 7 * 1000 * 3600;
  });
</script>
