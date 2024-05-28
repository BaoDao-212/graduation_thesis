<template>
  <div class="text-decoration-none" style="color: rgb(255, 0, 0)">
    <Button type="text" @click="showModal">
      <DeleteTwoTone two-tone-color="#ff0000" /> {{ $t('routes.post.delete') }}</Button
    >
  </div>
  <a-modal
    v-model:visible="visible"
    :title="$t('routes.post.delete')"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
  >
    <div class="text-uppercase text-blue-900 fw-bold fs-2">{{ modalText }}</div>
    <template #footer>
      <div class="flex justify-end mr-2 mb-3">
        <a-button @click="visible = false">
          {{ $t('common.cancelText') }}
        </a-button>
        <a-button html-type="submit" type="primary" danger @click="handleOk()">
          {{ $t('routes.post.delete') }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { DeleteTwoTone } from '@ant-design/icons-vue';
  import { useI18n } from '@/hooks';
  import to from '@/utils/awaitTo';
  import { deletePost } from '@/api/backend/api/post';
  import { usePostStore } from '@/store/modules/post';
  import { notification } from 'ant-design-vue';
  const  usePost  = usePostStore();
  const props = defineProps({
    post: {
      type: Object,
      required: true,
    },
  });
  const { t } = useI18n();
  const modalText = ref<string>(`${t('routes.post.post')}: ${props.post.post}`);
  const visible = ref<boolean>(false);
  const confirmLoading = ref<boolean>(false);
  const showModal = () => {
    visible.value = true;
  };
  const handleOk = async () => {
    confirmLoading.value = true;
    const [_err, res] = await to(deletePost(props.post.id));
    if (res.ok) {
      modalText.value += ' has removed';
      notification.success({
        message: t('common.success'),
        description: t('routes.post.notification.delete_success'),
      });
      usePost.deletePost(props.post.id);
    } else {
      notification.error({
        message: t('common.error'),
        description: res.error.message,
      });
    }
    setTimeout(() => {
      visible.value = false;
      confirmLoading.value = false;
    }, 2);
  };
</script>

<style lang="less" scoped></style>
