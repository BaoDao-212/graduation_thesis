<template>
  <div style="width: 100%; margin-top: 10px">
    <Card>
      <div
        class="flex flex-row"
        style="
          margin-bottom: 10px;
          align-items: center;
          justify-content: space-between;
        "
      >
        <div class="flex" style="flex-direction: column">
         <div class="flex flex-row justify-between mb-2">
           <div class="ml-2" style="font-size: 18px; font-weight: bold">{{ props.exam.name }}</div>
           <div class="ml-4">
             <span class="ml-2">{{ props.exam.numberReviews }} {{ t('routes.post.reviews') }}</span>
             <a-rate class="ml-4" v-model:value="props.exam.averageRating" disabled />
            </div>
          </div>
          <span class="ml-2">{{ props.exam.content }}</span>
        </div>
        <Tag v-if="level" color="green">
          {{ level }}
        </Tag>
        <Button type="primary" @click="handleCreateResult">{{ t('routes.post.start') }} </Button>
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
      router.push('/post/list');
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
