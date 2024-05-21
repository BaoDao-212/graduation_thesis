<template>
  <div class="text-decoration-none" style="color: rgb(0, 255, 0)" @click="handleOk"
    ><AimOutlined two-tone-color="#00ff00" /> {{ $t('routes.exam.delete.restore_exam') }}</div
  >
</template>
<script lang="ts" setup>
  import {  defineEmits } from 'vue';
  import { useI18n } from '@/hooks';
  import { restoreExam } from '@/api/backend/api/exam';
  import { notification } from 'ant-design-vue';
import { AimOutlined } from '@ant-design/icons-vue';
  const props = defineProps({
    exam: {
      type: Object,
      required: true,
    },
  });
  const { t } = useI18n();
  const emit = defineEmits(['update-list']);
  const handleOk = async () => {
    // call api to delete exam
    const res = await restoreExam(props.exam.id);
    if (res.ok) {
      notification.success({
        message: t('common.success'),
        description: `${t('routes.exam.delete.restore')}: ${props.exam.name}`,
      });
      emit('update-list', props.exam.id);
    } else {
      notification.error({
        message: t('common.error'),
        description: res.error.message,
      });
    }
  };
</script>

<style lang="less" scoped></style>
