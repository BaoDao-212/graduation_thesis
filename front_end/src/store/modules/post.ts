import { ref } from 'vue';
import { defineStore } from 'pinia';
import { notification } from 'ant-design-vue';
import { store } from '@/store';
import to from '@/utils/awaitTo';
import { listPublicPostAll } from '@/api/backend/api/post';
import { useI18n } from '@/hooks';

export const usePostStore = defineStore('post', () => {
  const listPost = ref([]);
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
  const { t } = useI18n();
  const getListExam = async (page, pageSize, search, sortBy) => {
    const [err, res] = await to(
      listPublicPostAll({
        page,
        pageSize,
        search,
        sortBy,
      }),
    );
    if (err) {
      notification.error({
        message: t('common.error'),
        description: err.message,
      });
    } else {
      listPost.value = res.posts;
      console.log(listPost.value);
    }
  };
const getListPost=()=>{
  return listPost.value;
}
  return {
    getListExam,
    getListPost,
    listPost,
    pageSetting
  };
});

// 在组件setup函数外使用
export function usePostStoreWithOut() {
  return usePostStore(store);
}
