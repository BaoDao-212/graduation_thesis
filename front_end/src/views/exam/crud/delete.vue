<template>
  <div class="text-decoration-none" style="color: rgb(255, 0, 0)" @click="showModal"
    ><DeleteTwoTone two-tone-color="#ff0000" /> {{ $t('routes.management.delete_user') }}</div
  >
  <a-modal
    v-model:visible="visible"
    :title="$t('routes.management.delete_user_title')"
    :confirm-loading="confirmLoading"
    :content="$t('routes.management.delete.content_delete_user')"
    @ok="handleOk"
  >
    <div class="text-uppercase text-blue-900 fw-bold fs-2">{{ modalText }}</div>
    <template #footer>
      <div class="flex justify-end mr-2 mb-3">
        <a-button @click="visible = false">
          {{ $t('common.cancelText') }}
        </a-button>
        <a-button html-type="submit" type="primary" danger @click="handleOk()">
          {{ $t('routes.management.delete_user') }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref, defineEmits } from 'vue';
  import { DeleteTwoTone } from '@ant-design/icons-vue';
  import { useI18n } from '@/hooks';
  const props = defineProps({
    user: {
      type: Object,
      required: true,
    },
  });
  const { t } = useI18n();
  const modalText = ref<string>(`${t('routes.management.user')}: ${props.user.name}`);
  const visible = ref<boolean>(false);
  const confirmLoading = ref<boolean>(false);
  const showModal = () => {
    visible.value = true;
  };
  const emit = defineEmits(['update-list']);
  const handleOk = async () => {
    confirmLoading.value = true;
    // const [err] = await to(deleteUser(props.user.id));
    // if (!err) {
    //   modalText.value += ' has removed';
    //   emit('update-list', props.user.id);
    //   notification.success({
    //     message: t('routes.error.success'),
    //     description: t('routes.management.success_message_delete'),
    //   });
    // }
    setTimeout(() => {
      visible.value = false;
      confirmLoading.value = false;
    }, 2000);
  };
</script>

<style lang="less" scoped></style>
