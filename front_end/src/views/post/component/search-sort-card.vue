<template>
  <div class="search-container">
    <div class="search-bar">
      <a-input-search
        v-model:value="searchTerm"
        :placeholder="t('routes.exam.search_placeholder')"
        style="width: 200px; margin-top: 20px"
        @search="onSearch"
      />
    </div>
    <div class="sort-container">
      <span class="sort-label" style="margin-top: 20px">{{ t('routes.exam.sort_by') }}:</span>
      <Select v-model:value="sortBy" @change="handleSort" class="sort-select" style="margin-top: 20px">
        <a-select-option value="normal">{{ t('routes.exam.normal') }}</a-select-option>
        <a-select-option value="numberUserTest">{{ t('routes.exam.interaction') }}</a-select-option>
        <a-select-option value="numberReviews">{{ t('routes.exam.reviews') }}</a-select-option>
        <a-select-option value="averageRating">{{
          t('routes.exam.average_rating')
        }}</a-select-option>
      </Select>
    </div>
    <AddPost :exam="props.exams.filter((e) => e.status == 0)" />
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useI18n } from '@/hooks';
  import { Card, Avatar, Button, Tag, Select, Input } from 'ant-design-vue';
  import CardExam from './card-overview-card.vue';
  import AddPost from './../crud/add.vue';
  import { listPublicPostAll } from '@/api/backend/api/post';
import { usePostStore } from '@/store/modules/post';

  const { t } = useI18n();
  const props = defineProps({
    exams: {
      type: Array,
      required: true,
    },
  });

  const searchTerm = ref('');
  const sortBy = ref('normal');

  const formState = ref({
    search: '',
    sort: '',
  });
  const usePost= usePostStore();
  const onSearch = async () => {
    formState.value.search = searchTerm.value;
    console.log(formState.value.search);
    await usePost.getListExam(1,10,formState.value.search,formState.value.sort);
  };

  const handleSort = async () => {
    formState.value.sort = sortBy.value;
    await usePost.getListExam();
  };
</script>

<style scoped>
  .search-container {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 24px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    align-items: center;
  }

  .search-bar {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
  }

  .search-input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 16px;
    margin-right: 16px;
    transition: border-color 0.3s;
  }

  .search-input:focus {
    outline: none;
    border-color: #40a9ff;
  }

  .search-button {
    white-space: nowrap;
  }

  .sort-container {
    display: flex;
    margin-bottom: 24px;
  }

  .sort-label {
    margin-right: 12px;
    font-size: 16px;
    color: #595959;
  }

  .sort-select {
    margin-right: 16px;
    width: 180px;
  }

  .sort-button {
    white-space: nowrap;
  }

  .exam-list {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }

  .exam-card {
    flex: 1 0 300px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 16px;
  }
</style>
