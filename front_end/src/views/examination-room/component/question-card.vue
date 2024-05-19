<template>
  <div style="width: 100%; margin-top: 10px">
    <Card style="width: 100%; margin-top: 10px">
      <div
        v-if="props.question"
        class="flex"
        style="margin-top: 10px; margin-bottom: 10px; flex-direction: column"
      >
        <div class="flex flex-row">
          <span class="mr-1" style="font-weight: bold"> {{ t('routes.question.question') }}: </span>
          {{ props.question.content }}
        </div>
        <div class="flex mt-2" style="flex-direction: column">
          <a-checkbox-group
            v-model:value="form.answerId"
            style="width: 100%; display: flex; flex-direction: column"
            @change="changeAnswer"
          >
            <a-checkbox v-for="value in props.question.answers" :value="value.id">
              {{ value.answer }}
            </a-checkbox>
          </a-checkbox-group>
        </div>
        <Button
          v-if="isSubmit"
          type="primary"
          style="margin-top: 10px; width: 100px"
          @click="submit"
        >
          {{ t('routes.exam.submit') }}
        </Button>
        <Button v-else type="primary" style="margin-top: 10px; width: 100px" disabled>
          {{ t('routes.exam.submit') }}
        </Button>
      </div>
    </Card>
  </div>
</template>
<script lang="ts" setup>
  import { Button, Card, notification } from 'ant-design-vue';
  import { useI18n } from '@/hooks';
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { submitAnswer } from '@/api/backend/api/room';
  const { t } = useI18n();
  const route = useRoute();
  const props = defineProps({
    question: {
      type: Object,
      required: true,
    },
    answers: {
      type: Array,
      required: true,
    },
  });
  interface DetailAnswerForm {
    questionId: number;
    answerId: number[];
    resultId: number;
  }
  const isSubmit = ref(false);
  const form = ref<DetailAnswerForm>({
    questionId: props.question.id,
    answerId: props.answers.length > 0 ? (props.answers as number[]) : [],
    resultId: Number(route.params.id),
  });
  const submit = async () => {
    form.value.questionId = props.question.id;
    const res = await submitAnswer(form.value);
    if (!res.ok) {
      notification.error({
        message: t('common.error'),
        description: res.error.message,
      });
      form.value.answerId = props.answers.length > 0 ? (props.answers as number[]) : [];
      isSubmit.value = true;
    }
    else isSubmit.value = false;
  };
  const changeAnswer = (value: number[]) => {
    if (
      !(form.value.answerId.length === props.answers.length &&
      form.value.answerId.every((value, index) => value === props.answers[index]))
    )
      isSubmit.value = true;
  };
</script>
