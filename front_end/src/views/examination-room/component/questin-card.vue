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
          <a-radio v-for="value in props.question.answers" class="mb-2" :value="value.id">
            {{ value.answer }}</a-radio
          >
        </div>
      </div>
    </Card>
  </div>
</template>
<script setup>
  import { Card } from 'ant-design-vue';
  import { useI18n } from '@/hooks';
  import { ref } from 'vue';
  const { t } = useI18n();
  const props = defineProps({
    question: {
      type: Object,
      required: true,
    },
  });
  const answer = ref();
</script>
