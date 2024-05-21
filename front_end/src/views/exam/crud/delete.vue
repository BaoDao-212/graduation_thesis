<template>
  <div class="text-decoration-none" style="color: rgb(255, 0, 0)" @click="showModal"
    ><DeleteTwoTone two-tone-color="#ff0000" /> {{ $t('routes.exam.delete.title') }}</div
  >
  <a-modal
    v-model:visible="visible"
    :title="$t('routes.exam.delete.title')"
    :confirm-loading="confirmLoading"
    :content="$t('routes.exam.delete.content')"
    @ok="handleOk"
  >
    <div class="text-uppercase text-blue-900 fw-bold fs-2">{{ modalText }}</div>
    <template #footer>
      <div class="flex justify-end mr-2 mb-3">
        <a-button @click="visible = false">
          {{ $t('common.cancelText') }}
        </a-button>
        <a-button html-type="submit" type="primary" danger @click="handleOk()">
          {{ $t('routes.exam.delete.button') }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref, defineEmits } from 'vue';
  import { DeleteTwoTone } from '@ant-design/icons-vue';
  import { useI18n } from '@/hooks';
import { deleteExam } from '@/api/backend/api/exam';
import { notification } from 'ant-design-vue';
  const props = defineProps({
    exam: {
      type: Object,
      required: true,
    },
  });
  const { t } = useI18n();
  const modalText = ref<string>(`${t('routes.exam.exam')}: ${props.exam.name}`);
  const visible = ref<boolean>(false);
  const confirmLoading = ref<boolean>(false);
  const showModal = () => {
    visible.value = true;
  };
  const emit = defineEmits(['update-list']);
  const handleOk = async () => {
    confirmLoading.value = true;
    // call api to delete exam
    const res = await deleteExam(props.exam.id);
    if (res.ok) {
     notification.success({
        message: t('common.success'),
        description: `${t('routes.exam.delete.success')}: ${props.exam.name}`,
      });
      emit('update-list',props.exam.id);
    } else {
      notification.error({
        message: t('common.error'),
        description: res.error.message,
      });
    }
    setTimeout(() => {
      visible.value = false;
      confirmLoading.value = false;
    }, 2000);
  };
</script>

<style lang="less" scoped></style>
