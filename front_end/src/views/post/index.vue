<template>
  <div>
    <Card style="margin: 0 6px 0px 6px; min-width: fit-content">
      <template #title>
        <div class="flex" style="justify-content: space-between; align-items: center">
          <SearchSortCard v-if="listExamName" :exams="listExamName" />
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
          <CardPost :post="item" :exam="listExamName"/>
        </div>
        <a-pagination @change="changePage" />
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue';
  import { Card, notification } from 'ant-design-vue';
  import { useI18n } from '@/hooks';
  import to from '@/utils/awaitTo';
  import CardPost from './component/card-post.vue';
  import SearchSortCard from './component/search-sort-card.vue';
  import { getExamNameList } from '@/api/backend/api/exam';
  import { usePostStore } from '@/store/modules/post';
  import { storeToRefs } from 'pinia';
  const listExamName = ref();
  const { t } = useI18n();
  const usePost = usePostStore();
  const { listPost, pageSetting } = storeToRefs(usePost);

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
  const changePage = async (page: number) => {
  usePost.setPageSetting(page, 10,pageSetting.value.search,pageSetting.value.sort);
    await usePost.getListExam();
  };
  onBeforeMount(async () => {
    await usePost.getListExam();
    await getListExamName();
    // listPost.value = getListPost();
  });
</script>
