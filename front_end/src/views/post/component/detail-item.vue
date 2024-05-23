<template>
  <div style="width: 100%">
    <div class="flex" style="align-items: center;">
      <span class="ml-4">{{ formatToDateTime(props.post.createdAt) }}</span>
    </div>
  </div>
</template>
<script setup>
  import { Card, Avatar } from 'ant-design-vue';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { useI18n } from '@/hooks';
  const { t } = useI18n();
  const props = defineProps({
    post: {
      type: Object,
      required: true,
    },
  });
</script>
