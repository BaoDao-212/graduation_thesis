<!-- eslint-disable vue/no-unused-components -->
<template>
    <div class="flex justify-end">
      <Button type="primary" @click="showModal"
        ><PlusOutlined /> {{ t('routes.answer.add_answer') }}</Button
      >
    </div>
    <Modal
      v-model:visible="visible"
      :cancel-text="$t('common.cancelText')"
      :title="$t('routes.answer.add_answer')"
      :width="1000"
      @ok="createFunc"
    >
      <Form
        :model="formState"
        layout="vertical"
        autocomplete="off"
        class="d-flex justify-content-center align-items-center"
      >
        <Form.Item
          :label="t('routes.exam.table.content')"
          name="answer"
          :rules="[{ required: true, message: t('routes.exam.modal.required.content') }]"
        >
          <Input
            v-model:value="formState.answer"
            class="border border-primary rounded-2"
            :placeholder="t('routes.exam.modal.placeholder.content')"
          >
          </Input>
        </Form.Item>
        <Form.Item
          :label="t('routes.answer.table.isCorrect')"
          name="correct"
          :rules="[{ required: true, message: '' }]"
        >
          <a-radio-group v-model:value="formState.isCorrect" button-style="solid">
            <a-radio-button :value="true">{{ t('routes.answer.correct') }}</a-radio-button>
            <a-radio-button :value="false">{{ t('routes.answer.incorrect') }}</a-radio-button>
          </a-radio-group>
        </Form.Item>
      </Form>
      <template #footer>
        <div class="flex justify-end mr-2 mb-3">
          <a-button @click="visible = false">
            {{ $t('common.cancelText') }}
          </a-button>
          <Button
            v-if="formState.answer.trim() != ''"
            html-type="submit"
            type="primary"
            @click="createFunc()"
            >{{ $t('common.okText') }}
          </Button>
          <Button v-else html-type="submit" disabled>
            {{ $t('common.okText') }}
          </Button>
        </div>
      </template>
    </Modal>
  </template>
  <script lang="ts" setup>
    import { ref, defineEmits, defineProps } from 'vue';
    import { PlusOutlined } from '@ant-design/icons-vue';
    import { Button, Form, Input, Modal, notification } from 'ant-design-vue';
    import { to } from '@/utils/awaitTo';
    import { useI18n } from '@/hooks';
    import { createAnswer } from '@/api/backend/api/answer';
    import { useRoute } from 'vue-router';
    const props = defineProps({
      questionId: Number,
    });
    interface FormState {
      isCorrect: boolean;
      answer: string;
      questionId: number;
    }
    const formState = ref<FormState>({
      isCorrect: false,
      answer: '',
      questionId: props.questionId ?? 0,
    });
    const route = useRoute();
    const emit = defineEmits(['update-list']);
    const visible = ref<boolean>(false);
    const { t } = useI18n();
    const showModal = () => {
      visible.value = true;
      formState.value.answer = '';
      formState.value.questionId = props.questionId ?? 0;
      formState.value.isCorrect = false;
    };
  
    const createFunc = async () => {
      const { answer } = formState.value;
      if (answer.trim() == '') {
        return notification.warning({
          message: t('common.warning'),
          description: t('common.warn_message_empty'),
        });
      }
      formState.value.questionId = Number(route.params.id);
      const [err, _res] = await to(createAnswer(formState.value));
      if (!err) {
        notification.success({
          message: t('common.success'),
          description: t('routes.question.notification.create_success'),
        });
        emit('update-list', formState.value);
        setTimeout(() => {
          visible.value = false;
        }, 10);
      }
      formState.value.answer = '';
    };
  </script>
  
  <style lang="less" scoped></style>
  