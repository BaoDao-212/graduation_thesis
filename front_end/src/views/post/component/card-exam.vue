<template>
  <div class="exam-card">
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
          <a-rate
            class="rating"
            :value="props.exam.averageRating / props.exam.numberReviews"
            disabled
          />
        </div>
      </div>
    </div>
    <div class="exam-info">
      <div class="info-item">
        <span class="info-label">{{ t('routes.exam.table.time') }}:</span>
        <span class="info-value">{{ props.exam.time }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{ t('routes.exam.table.number_question') }}:</span>
        <span class="info-value">{{ props.exam.numberQuestions }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{ t('routes.exam.table.content') }}:</span>
        <span class="info-value">{{ props.exam.content }}</span>
      </div>
    </div>
    <div class="exam-actions">
      <Tag v-if="level" color="green" class="level-tag">{{ level }}</Tag>
      <Button type="primary" @click="handleCreateResult">{{ t('routes.post.start') }}</Button>
    </div>
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
  });
  const result = ref();
  const router = useRouter();
  const createResultForExam = async () => {
    const [err, res] = await to(createResult({ examId: props.exam.id }));
    if (err) {
      notification.error({
        message: t('common.error'),
        description: err.message,
      });
      router.push('/dashboard/list');
    } else {
      result.value = res.result;
      router.push(`/exam/room/${result.value.id}`);
    }
  };
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
  .exam-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .info-item {
    display: flex;
    align-items: center;
  }
  .info-label {
    font-size: 14px;
    color: #8c8c8c;
    margin-right: 8px;
  }
  .info-value {
    font-size: 14px;
  }
  .exam-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
  }
  .level-tag {
    font-size: 14px;
  }
</style>
