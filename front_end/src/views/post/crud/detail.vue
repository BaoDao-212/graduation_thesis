<template>
  <div>
    <Card v-if="post" style="margin: 0 6px 0px 6px; min-width: fit-content">
      <template #title>
        <div class="flex" style="align-items: center; justify-content: space-between">
          <div class="ml-1 flex flex-row">
            <Avatar
              :size="40"
              style="color: #f56a00; background-color: #fde3cf; font-size: 40px; margin-right: 10px"
            >
              {{ post.user.username.slice(0, 1) }}
            </Avatar>
            <div style="font-size: 20px">{{ post.user.username }}/{{ post.name }}</div>
          </div>
          <div>
            <span class="ml-2">{{ post.numberReviews }} {{ t('routes.post.reviews') }}</span>
            <a-rate class="ml-4" v-model:value="post.averageRating" disabled />
            <span class="ml-4">{{ formatToDateTime(post.createdAt) }}</span>
          </div>
        </div>
      </template>
      <div class="mt-2"> {{ post.content }}</div>
      <div>
        <CardExam v-for= "e in post.exams" :exam="e" />
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue';
  import { Card, notification, Avatar } from 'ant-design-vue';
  import { useI18n } from '@/hooks';
  import to from '@/utils/awaitTo';
  import { detailPost } from '@/api/backend/api/post';
  import { useRoute } from 'vue-router';
  import { formatToDateTime } from '@/utils/dateUtil';
  import CardExam from './../component/card-exam.vue';
  const post = ref();
  const { t } = useI18n();
  const route = useRoute();
  const getDetailPost = async () => {
    const [err, res] = await to(detailPost(Number(route.params.id)));
    if (err) {
      notification.error({
        message: t('common.error'),
        description: err.message,
      });
    } else {
      post.value = res.posts;
    }
  };
  onBeforeMount(async () => {
    await getDetailPost();
  });
</script>
