<template>
  <Card class="post-card" :bordered="false">
    <div class="post-header">
      <div class="author-info">
        <Avatar :size="48" :src="props.post.user.avatarUrl" class="author-avatar">
          {{ props.post.user.username.slice(0, 1) }}
        </Avatar>
        <div class="author-details">
          <router-link :to="`/dashboard/detail-user/${props.post.user.id}`" class="author-name">
            {{ props.post.user.username }}
          </router-link>
          <div class="post-name">{{ props.post.name }}</div>
        </div>
      </div>
      <div class="header-right">
        <div class="post-date">{{ formatToDateTime(props.post.createdAt) }}</div>
        <a-dropdown trigger="click" v-if="uId == props.post.user.id">
          <a class="ant-dropdown-link" @click.prevent>
            <MoreOutlined class="more-icon" />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <UpdatePost :post="props.post" :exam="props.exam" />
              </a-menu-item>
              <a-menu-item>
                <DeletePost :post="props.post" />
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    <div class="post-content">
      <span>{{ props.post.content }}</span>
    </div>
    <div class="exams-section">
      <CardExam v-for="e in props.post.exams" :key="e.id" :exam="e" :postId="props.post.id" />
    </div>
  </Card>
</template>

<script setup>
  import { Card, Avatar } from 'ant-design-vue';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { useI18n } from '@/hooks';
  import DetailItem from './detail-item.vue';
  import { ref } from 'vue';
  import CardExam from './card-overview-card.vue';
  import { MoreOutlined } from '@ant-design/icons-vue';
  import UpdatePost from './../crud/update.vue';
  import DeletePost from './../crud/delete.vue';
  import Storage from '@/utils/Storage';
  const { t } = useI18n();
  const props = defineProps({
    post: {
      type: Object,
      required: true,
    },
    exam: {
      type: Array,
      required: true,
    },
  });
  const uId = ref(Storage.get('PROFILE').id);
</script>

<style scoped>
  .post-card {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 16px;
    margin-bottom: 16px;
    transition: box-shadow 0.3s ease;
    width: 100%;
  }

  .post-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .author-info {
    display: flex;
    align-items: center;
  }

  .author-avatar {
    margin-right: 12px;
    background-color: #fde3cf;
    color: #f56a00;
    font-size: 24px;
    border-radius: 50%;
    /* Add a subtle shadow for depth */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .author-details {
    display: flex;
    flex-direction: column;
  }

  .author-name {
    font-weight: 600;
    text-decoration: none;
    color: #262626;
    font-size: 16px;
    margin-bottom: 4px;
    transition: color 0.3s ease;
    /* Add a slight underline on hover */
    text-decoration: none;
    text-underline-offset: 2px;
  }

  .author-name:hover {
    color: #1890ff;
    text-decoration: underline;
  }

  .post-name {
    font-size: 14px;
    color: #8c8c8c;
  }

  .post-date {
    font-size: 14px;
    color: #8c8c8c;
  }

  .post-content {
    font-size: 16px;
    color: #595959;
    margin-bottom: 16px;
    line-height: 1.5;
    /* Add more space between lines */
    letter-spacing: 0.5px;
  }

  .exams-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 16px;
  }

  .header-right {
    display: flex;
    align-items: center;
  }

  .more-icon {
    font-size: 18px;
    color: #8c8c8c;
    transition: color 0.3s ease;
    /* Add a slight rotation on hover */
    transform: rotate(0deg);
  }

  .more-icon:hover {
    color: #595959;
    transform: rotate(45deg);
  }

  .ant-dropdown-link {
    padding: 0;
    margin-right: 12px;
  }

  /* Style for the Dropdown Menu */
  .ant-dropdown-menu {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .ant-dropdown-menu-item {
    padding: 8px 12px;
    font-size: 14px;
    color: #262626;
  }

  .ant-dropdown-menu-item:hover {
    background-color: #f0f0f0;
  }
</style>
