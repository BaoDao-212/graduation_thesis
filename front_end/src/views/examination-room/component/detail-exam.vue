<template>
  <div style="width: 100%; margin-top: 10px">
    <Card
      :style="{
        width: '100%',
        marginTop: '10px',
      }"
    >
      <div class="flex flex-row justify-between">
        <div>
          <div class="mb-2">
            <span class="mr-1" style="font-weight: bold"> {{ t('routes.exam.exam') }}: </span>
            {{ props.detail.exam.name }}
          </div>
          <div class="mb-2">
            <span class="mr-1" style="font-weight: bold"> {{ t('routes.exam.time') }}: </span>
            {{ props.detail.time }} {{ t('routes.exam.minute') }}
          </div>
          <div class="mb-2">
            <span class="mr-1" style="font-weight: bold"> {{ t('routes.exam.score') }}: </span>
            {{ props.detail.score }}/{{ props.question.length }}
          </div>
        </div>
        <VueApexCharts
          type="radar"
          height="350"
          width="500"
          :options="chartOptions"
          :series="series"
        />
      </div>
      <a-popconfirm placement="top" ok-text="Yes" cancel-text="No" :title="t('routes.exam.review')">
        <template #description>
          <Assistant v-if="!props.isGemini" />
          <div v-else>
            <Button @click="handleGenerateReview">{{ t('routes.exam.generate_review') }}</Button>
          </div>
        </template>
        <Button @click="review">{{ t('routes.exam.review') }}</Button>
      </a-popconfirm>
      <div v-if="showReview">
        {{ props.detail.review }}
      </div>
    </Card>
  </div>
</template>
<script lang="ts" setup>
  import { Button, Card, notification } from 'ant-design-vue';
  import { useI18n } from '@/hooks';
  import VueApexCharts from 'vue3-apexcharts';
  import Assistant from './assistant.vue';
  import { ref } from 'vue';
  import { generateReviewGemini } from '@/api/backend/api/exam';
  const { t } = useI18n();
  const review = () => {
    if (!props.detail.review) {
      showReview.value = true;
    }
  };
  interface FomState {
    questionCorrect: number[];
    questionIncorrect: number[];
  }
  const formState = ref<FomState>({
    questionCorrect: [],
    questionIncorrect: [],
  });
  const handleGenerateReview = async () => {
    formState.value.questionCorrect = props.detail.detailResult
      .filter((dr) => dr.score == 1)
      .map((dr) => dr.question.id);
    formState.value.questionIncorrect = props.question
      .filter((q) => !formState.value.questionCorrect.includes(q.id))
      .map((q) => q.id);
    // call api to generate review
    const res = await generateReviewGemini(formState.value);
    if (res.ok) {
      showReview.value = true;
    }else{
      notification.error({
        message: t('common.error'),
        description: res.error.message,
      });
    }
  };
  const showReview = ref(false);

  const props = defineProps({
    detail: {
      type: Object,
      required: true,
    },
    question: {
      type: Object,
      required: true,
    },
    isGemini: {
      type: Boolean,
      required: true,
    },
  });
  const series = ref([
    {
      name: t('routes.exam.amount'),
      data: [0, 0, 0, 0, 0],
    },
  ]);
  // tính toán số câu đúng theo mức độ
  props.detail.detailResult.forEach((dr) => {
    if (dr.question.level == 0) {
      series.value[0].data[1] += dr.score;
    } else if (dr.question.level == 1) {
      series.value[0].data[2] += dr.score;
    } else if (dr.question.level == 2) {
      series.value[0].data[3] += dr.score;
    } else if (dr.question.level == 3) {
      series.value[0].data[4] += dr.score;
    }
  });
  series.value[0].data[0] = Math.round((props.detail.score / props.question.length) * 100);
  series.value[0].data[1] = Math.round(
    (series.value[0].data[1] / props.question.filter((q) => q.level == 0).length) * 100,
  );
  series.value[0].data[2] = Math.round(
    (series.value[0].data[2] / props.question.filter((q) => q.level == 1).length) * 100,
  );
  series.value[0].data[3] = Math.round(
    (series.value[0].data[3] / props.question.filter((q) => q.level == 2).length) * 100,
  );
  series.value[0].data[4] = Math.round(
    (series.value[0].data[4] / props.question.filter((q) => q.level == 3).length) * 100,
  );
  const chartOptions = {
    chart: {
      height: 350,
      type: 'radar',
    },
    title: {
      text: '',
    },
    yaxis: {
      stepSize: 100,
    },
    xaxis: {
      categories: ['OVERVIEW', 'EASY', 'MEDIUM', 'HARD', 'VERY HARD'],
    },
  };
</script>
