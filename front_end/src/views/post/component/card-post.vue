<template>
  <div style="width: 100%; margin-top: 10px">
    <Card>
      <div class="flex flex-row" style="margin-top: 10px; margin-bottom: 10px; align-items: center">
        <Avatar size="64" style="color: #f56a00; background-color: #fde3cf; font-size: 40px">
          {{ props.post.user.username.slice(0, 1) }}
        </Avatar>
        <router-link :to="`/post/detail/${props.post.id}`">
          <a style="margin-left: 10px; font-size: 16px;font-weight: 800;">{{ props.post.user.username }}/{{ props.post.name }}</a>
        </router-link>
      </div>
      <div>
        <span class="ml-2">{{ props.post.content }}</span>
        <!-- <div
          class="flex"
          style="justify-content: flex-start; margin-top: 10px; align-items: center"
        >
          <span class="ml-2">{{ props.post.numberReviews }} {{ t('routes.post.reviews') }}</span>
          <a-rate class="ml-4" v-model:value="props.post.averageRating" disabled />
          <span class="ml-4">{{ formatToDateTime(props.post.createdAt) }}</span>
        </div> -->
      <DetailItem :post="props.post"/>
      </div>
    </Card>
  </div>
</template>
<script setup>
  import { Card, Avatar } from 'ant-design-vue';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { useI18n } from '@/hooks';
  import DetailItem from "./detail-item.vue";
  const { t } = useI18n();
  const props = defineProps({
    post: {
      type: Object,
      required: true,
    },
  });
</script>
