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
    search: string;
    sort: string;
  };
  const pageSetting = ref<PageSetting>({
    total: 0,
    page: 1,
    pageSize: 10,
    search: '',
    sort: 'normal',
  });
  const setPageSetting = (page, pageSize, search, sort) => {
    pageSetting.value = {
      ...pageSetting.value,
      page,
      pageSize,
      search,
      sort,
    };
  };
  const { t } = useI18n();
  const getListExam = async () => {
    const [err, res] = await to(
      listPublicPostAll({
        page: pageSetting.value.page,
        pageSize: pageSetting.value.pageSize,
        search: pageSetting.value.search,
        sortBy: pageSetting.value.sort,
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
  const getListPost = () => {
    return listPost.value;
  };
  const deletePost = async (id: number) => { 
    listPost.value = listPost.value.filter((item: { id: number }) => item.id !== id); // Add type annotation for 'item'
  }
  return {
    getListExam,
    getListPost,
    listPost,
    setPageSetting,
    deletePost,
    pageSetting,
  };
});

// 在组件setup函数外使用
export function usePostStoreWithOut() {
  return usePostStore(store);
}
