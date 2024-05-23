<template>
  <div class="exam-card">
    <router-link :to="`/dashboard/detail/${props.postId}`" class="exam-content">
      <div class="exam-header">
        <h3 class="exam-name">{{ props.exam.name }}</h3>
        <div class="exam-details">
          <div class="detail">
            <span class="detail-label">{{ t('routes.post.interaction') }}:</span>
            <span class="detail-value">{{ props.exam.numberUserTest }}</span>
          </div>
          <div class="detail">
            <span class="detail-label">{{ t('routes.post.reviews') }}:</span>
            <span class="detail-value">{{ props.exam.numberReviews }}</span>
          </div>
          <div class="detail">
            <a-rate class="rating" :value="props.exam.averageRating" disabled />
          </div>
        </div>
      </div>
      <div class="exam-description">
        <span>{{ props.exam.content }}</span>
      </div>
    </router-link>
  </div>
</template>

<script setup>
  import { Card, Avatar, Button, Tag } from 'ant-design-vue';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { useI18n } from '@/hooks';
  import DetailItem from './detail-item.vue';
  import { ref } from 'vue';
  import { createResult } from '@/api/backend/api/room';
  import to from '@/utils/awaitTo';
  import { useRouter } from 'vue-router';
  const { t } = useI18n();
  const props = defineProps({
    exam: {
      type: Object,
      required: true,
    },
    postId: {
      type: Number,
      required: true,
    },
  });
  const result = ref();
  const router = useRouter();
  const handleCreateResult = async () => {
    await createResultForExam();
  };
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

<style scoped>
  .exam-card {
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    overflow: hidden;
    transition: box-shadow 0.3s ease;
  }

  .exam-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .exam-content {
    display: block;
    text-decoration: none;
    color: inherit;
    padding: 16px;
  }

  .exam-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .exam-name {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
  }

  .exam-details {
    display: flex;
    align-items: center;
  }

  .detail {
    display: flex;
    align-items: center;
    margin-left: 16px;
  }

  .detail-label {
    font-size: 14px;
    color: #8c8c8c;
    margin-right: 4px;
  }

  .detail-value {
    font-size: 14px;
    font-weight: bold;
  }

  .rating {
    margin-left: 16px;
  }

  .exam-description {
    font-size: 14px;
    color: #595959;
  }
</style>
