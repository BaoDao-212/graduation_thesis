<template>
  <div>
    <Card style="margin: 0 6px 0px 6px; min-width: fit-content">
      <template #title>
        <div class="flex" style="justify-content: space-between; align-items: center">
          <ProfileUser v-if="owner" :owner="owner"></ProfileUser>
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
          <CardPost :post="item" :exam="listExamName" />
        </div>
        <div style="color:red; font-weight: 800;font-size: large;" v-if="listPost && listPost.length == 0">
          {{ t('routes.post.not_found') }}
        </div>

        <a-pagination
          @change="changePage"
          :current="paperSetting.page"
          :simple="true"
          :total="paperSetting.total"
        />
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue';
  import { Card, notification } from 'ant-design-vue';
  import CardPost from './component/card-post.vue';
  import { listPublicPost } from '@/api/backend/api/post';
  import { useRoute } from 'vue-router';
  import Storage from '@/utils/Storage';
  import { getExamNameList } from '@/api/backend/api/exam';
  import to from '@/utils/awaitTo';
  import ProfileUser from './component/profile-user.vue';
  import { useI18n } from '@/hooks';
  const listExamName = ref();
  const listPost = ref();
  const paperSetting = ref({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const { t } = useI18n();
  const user = ref(Storage.get('PROFILE'));
  console.log(user.value);
  const route = useRoute();
  const changePage = async (page: number) => {
    paperSetting.value.page = page;
    const res = await listPublicPost(Number(route.params.id), paperSetting.value);
    if (!res.ok) {
      notification.error({
        message: t('common.error'),
        description: res.error.message,
      });
    } else {
      listPost.value = res.posts;
      paperSetting.value.total = res.total;
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
  const owner = ref();
  onBeforeMount(async () => {
    const res = await listPublicPost(Number(route.params.id), paperSetting.value);
    if (!res.ok) {
      notification.error({
        message: 'Error',
        description: res.error.message,
      });
    } else {
      listPost.value = res.posts;
      paperSetting.value.total = res.total;
      owner.value = res.user;
    }
    await getListExamName();
  });
</script>
