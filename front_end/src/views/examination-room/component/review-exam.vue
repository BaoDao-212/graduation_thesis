<!-- eslint-disable vue/no-unused-components -->
<template>
  <Modal
    v-model:visible="visible"
    :cancel-text="$t('common.cancelText')"
    :title="$t('routes.exam.review_title')"
    :width="500"
    @ok="createFunc"
  >
    <Form
      :model="formState"
      layout="vertical"
      autocomplete="off"
      class="d-flex justify-content-center align-items-center"
    >
      <Form.Item :label="t('routes.exam.review_exam')" name="review">
        <a-rate v-model:value="formState.amount" />
      </Form.Item>
    </Form>
    <template #footer>
      <div class="flex justify-end mr-2 mb-3">
        <a-button @click="visible = false">
          {{ $t('common.cancelText') }}
        </a-button>
        <Button v-if="formState.amount!=0" html-type="submit" type="primary" @click="createFunc()"
          >{{ $t('common.okText') }}
        </Button>
        <Button v-else html-type="submit" type="primary" disabled
          >{{ $t('common.okText') }}
        </Button>
      </div>
    </template>
  </Modal>
</template>
<script lang="ts" setup>
  import { ref, defineProps } from 'vue';
  import { Button, Form, Modal, notification } from 'ant-design-vue';
  import { to } from '@/utils/awaitTo';
  import { useI18n } from '@/hooks';
  import { reviewExam } from '@/api/backend/api/exam';
  const props = defineProps({
    isReviewed: {
      type: Boolean,
      required: true,
    },
    examId: {
      type: Number,
      required: true,
    },
  });
  interface FormState {
    amount: number;
    examId: number;
  }
  const formState = ref<FormState>({
    amount: 0,
    examId: props.examId,
  });
  const visible = ref<boolean>(!props.isReviewed);
  const { t } = useI18n();
  const createFunc = async () => {
    formState.value.examId = props.examId;
    console.log(formState.value);
    
    if (formState.value.amount == 0) {
      return notification.warning({
        message: t('common.warning'),
        description: t('common.warn_message_empty'),
      });
    }
    const [_err, _res] = await to(reviewExam(formState.value));
    if (_res.ok) {
      notification.success({
        message: t('common.success'),
        description: t('routes.exam.review_success'),
      });
      setTimeout(() => {
        visible.value = false;
      }, 10);
    } else {
      notification.error({
        message: t('common.error'),
        description: _res.error.message,
      });
    }
  };
</script>

<style lang="less" scoped></style>
