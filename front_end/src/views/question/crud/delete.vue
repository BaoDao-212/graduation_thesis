<template>
  <div class="text-decoration-none" style="color: rgb(255, 0, 0)" @click="showModal"
    ><DeleteTwoTone two-tone-color="#ff0000" /> {{ $t('routes.question.delete') }}</div
  >
  <a-modal
    v-model:visible="visible"
    :title="$t('routes.question.delete')"
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
          {{ $t('routes.question.delete') }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref, defineEmits } from 'vue';
  import { DeleteTwoTone } from '@ant-design/icons-vue';
  import { useI18n } from '@/hooks';
  import { deleteQuestion } from '@/api/backend/api/question';
  import { notification } from 'ant-design-vue';
  import to from '@/utils/awaitTo';
  const props = defineProps({
    question: {
      type: Object,
      required: true,
    },
  });
  const { t } = useI18n();
  const modalText = ref<string>(`${t('routes.question.delete')}: ${props.question.content}`);
  const visible = ref<boolean>(false);
  const confirmLoading = ref<boolean>(false);
  const showModal = () => {
    visible.value = true;
  };
  const emit = defineEmits(['update-list']);
  const handleOk = async () => {
    confirmLoading.value = true;
    const [err] = await to(deleteQuestion(props.question.id));
    if (!err) {
      modalText.value += ' has removed';
      emit('update-list', props.question.id);
      notification.success({
        message: t('common.success'),
        description: t('routes.question.notification.delete_success'),
      });
    }
    setTimeout(() => {
      visible.value = false;
      confirmLoading.value = false;
    }, 2000);
  };
</script>

<style lang="less" scoped></style>
