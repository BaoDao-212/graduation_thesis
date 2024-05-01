<template>
  <div style="width: 100%; margin-top: 10px">
    <Card>
      <div
        class="flex flex-row"
        style="
          margin-top: 10px;
          margin-bottom: 10px;
          align-items: center;
          justify-content: space-between;
        "
      >
        <div class="flex" style="flex-direction: column">
          <div class="ml-2" style="font-size: 18px; font-weight: bold">{{ props.exam.name }}</div>
          <span class="ml-2">{{ props.exam.content }}</span>
        </div>
        <Tag v-if="level" color="green">
          {{ level }}
        </Tag>
        <Button>{{ t('routes.post.start') }} </Button>
      </div>
    </Card>
  </div>
</template>
<script setup>
  import { Card, Avatar, Button, Tag } from 'ant-design-vue';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { useI18n } from '@/hooks';
  import DetailItem from './detail-item.vue';
  import { ref } from 'vue';
  const { t } = useI18n();
  const props = defineProps({
    exam: {
      type: Object,
      required: true,
    },
  });
  const level = ref(
    props.exam.level === '0'
      ? t('routes.post.easy')
      : props.exam.level === '1'
        ? t('routes.post.normal')
        : props.exam.level === '2'
          ? t('routes.post.hard')
          : t('routes.post.very_hard'),
  );
</script>
