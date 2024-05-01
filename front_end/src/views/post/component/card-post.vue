// write component base by composition api vue 3
<template>
  <div>
    <Card>
      {{ props.post }}
      <div class="flex flex-row">
        <Avatar size="64" style="color: #f56a00; background-color: #fde3cf; font-size: 40px">
          {{ props.post.user.username.slice(0, 1) }}
        </Avatar>
        <h3 style="margin-left: 10px">{{ props.post.user.username }}/{{ props.post.name }}</h3>
        <span>{{ formatToDateTime(props.post.createdAt) }}</span>
      </div>
      <div>
        <span>{{ props.post.content }}</span>
      </div>
    </Card>
  </div>
</template>
<script setup>
  import { Card, Avatar } from 'ant-design-vue';
  const props = defineProps({
    post: {
      type: Object,
      required: true,
    },
  });
</script>
