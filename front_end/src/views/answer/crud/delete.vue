<template>
  <div class="text-decoration-none" style="color: rgb(255, 0, 0)" @click="showModal"
    ><DeleteTwoTone two-tone-color="#ff0000" /> {{ $t('routes.answer.delete_answer') }}</div
  >
  <a-modal
    v-model:visible="visible"
    :title="$t('routes.answer.delete_answer')"
    :confirm-loading="confirmLoading"
    :content="$t('routes.answer.content_delete_user')"
    @ok="handleOk"
  >
    <div class="text-uppercase text-blue-900 fw-bold fs-2">{{ modalText }}</div>
    <template #footer>
      <div class="flex justify-end mr-2 mb-3">
        <a-button @click="visible = false">
          {{ $t('common.cancelText') }}
        </a-button>
        <a-button html-type="submit" type="primary" danger @click="handleOk()">
          {{ $t('routes.answer.delete') }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref, defineEmits } from 'vue';
  import { DeleteTwoTone } from '@ant-design/icons-vue';
  import { useI18n } from '@/hooks';
import to from '@/utils/awaitTo';
import { deleteAnswer } from '@/api/backend/api/answer';
  const props = defineProps({
    answer: {
      type: Object,
      required: true,
    },
  });
  const { t } = useI18n();
  const modalText = ref<string>(`${t('routes.answer.answer')}: ${props.answer.answer}`);
  const visible = ref<boolean>(false);
  const confirmLoading = ref<boolean>(false);
  const showModal = () => {
    visible.value = true;
  };
  const emit = defineEmits(['update-list']);
  const handleOk = async () => {
    confirmLoading.value = true;
    const [err] = await to(deleteAnswer(props.answer.id));
    if (!err) {
      emit('update-list', props.answer.id);
    }
    setTimeout(() => {
      visible.value = false;
      confirmLoading.value = false;
    }, 2);
  };
</script>

<style lang="less" scoped></style>
