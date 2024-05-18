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
          <div v-for="value in props.question.answers" :value="value.id">
            {{ value.answer }}
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
<script lang="ts" setup>
  import { Card } from 'ant-design-vue';
  import { useI18n } from '@/hooks';
  const { t } = useI18n();
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
</script>
