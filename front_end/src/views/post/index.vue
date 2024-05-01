<template>
  <div>
    <Card style="margin: 0 6px 0px 6px; min-width: fit-content">
      <template #title>
        <div class="flex" style="justify-content: space-between; align-items: center">
          <AddPost :exam="listExamName" />
        </div>
      </template>
      <div
        class="flex"
        style="
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        "
      >
        <div v-for="item in listPost" style="display: flex; align-items: center; width: 100%">
          <CardPost :post="item" />
        </div>
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue';
  import { Card, notification } from 'ant-design-vue';
  import { useI18n } from '@/hooks';
  import to from '@/utils/awaitTo';
  import { listPublicPostAll } from '@/api/backend/api/post';
  import CardPost from './component/card-post.vue';
  import AddPost from './crud/add.vue';
  import { getExamNameList } from '@/api/backend/api/exam';
  const listPost = ref();
  const listExamName = ref();
  const { t } = useI18n();
  type PageSetting = {
    total?: number;
    page: number;
    pageSize: number;
  };
  const pageSetting = ref<PageSetting>({
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const getListExam = async () => {
    const [err, res] = await to(
      listPublicPostAll({
        page: pageSetting.value.page,
        pageSize: pageSetting.value.pageSize,
      }),
    );
    if (err) {
      notification.error({
        message: t('common.error'),
        description: err.message,
      });
    } else {
      listPost.value = res.posts;
    }
  };
  const getListExamName = async () => {
    const [err, res] = await to(getExamNameList());
    if (err) {
      notification.error({
        message: t('common.error'),
        description: err.message,
      });
    } else {
      listExamName.value = res.exams;
    }
  };
  onBeforeMount(async () => {
    await getListExam();
    await getListExamName();
  });
</script>
