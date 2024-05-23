<template>
  <Card style="width:100%">
    <div class="post-header">
      <div class="author-info">
        <Avatar :size="48" :src="props.post.user.avatarUrl" class="author-avatar">
          {{ props.post.user.username.slice(0, 1) }}
        </Avatar>
        <div>
          <router-link :to="`/dashboard/detail/${props.post.id}`" class="author-name">
            {{ props.post.user.username }}
          </router-link>
          <div class="post-name">{{ props.post.name }}</div>
        </div>
      </div>
      <div class="post-date">{{ formatToDateTime(props.post.createdAt) }}</div>
    </div>
    <div class="post-content">
      <span>{{ props.post.content }}</span>
    </div>
    <div class="exams-section">
      <CardExam v-for="e in props.post.exams" :exam="e" :postId="props.post.id" />
    </div>
  </Card>
</template>

<script setup>
  import { Card, Avatar } from 'ant-design-vue';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { useI18n } from '@/hooks';
  import DetailItem from './detail-item.vue';
  import { ref } from 'vue';
  import CardExam from './card-overview-card.vue';
  const { t } = useI18n();
  const props = defineProps({
    post: {
      type: Object,
      required: true,
    },
  });
</script>

<style scoped>
  .post-card {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 16px;
    margin-bottom: 16px;

  }

  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .author-info {
    display: flex;
    align-items: center;
  }

  .author-avatar {
    margin-right: 12px;
    background-color: #fde3cf;
    color: #f56a00;
    font-size: 24px;
  }

  .author-name {
    font-weight: bold;
    text-decoration: none;
    color: #262626;
    font-size: 16px;
  }

  .post-name {
    font-size: 14px;
    color: #8c8c8c;
  }

  .post-date {
    font-size: 14px;
    color: #8c8c8c;
  }

  .post-content {
    font-size: 16px;
    color: #595959;
    margin-bottom: 16px;
  }

  .exams-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 16px;
  }
</style>
