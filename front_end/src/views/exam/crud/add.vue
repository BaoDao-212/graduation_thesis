<!-- eslint-disable vue/no-unused-components -->
<template>
  <div class="flex justify-end">
    <Button type="primary" @click="showModal"
      ><PlusOutlined /> {{ t('routes.exam.add_exam') }}</Button
    >
  </div>
  <Modal
    v-model:visible="visible"
    :cancel-text="$t('common.cancelText')"
    :title="$t('routes.exam.add_exam')"
    :width="1000"
    @ok="createUserFunc"
  >
    <Form
      :model="formState"
      layout="vertical"
      autocomplete="off"
      class="d-flex justify-content-center align-items-center"
    >
      <Form.Item
        :label="t('routes.exam.table.name')"
        name="name"
        :rules="[{ required: true, message: t('routes.exam.modal.required.name') }]"
      >
        <Input
          v-model:value="formState.name"
          class="border border-primary rounded-2"
          :placeholder="t('routes.exam.modal.placeholder.name')"
        >
        </Input>
      </Form.Item>
      <Form.Item
        :label="t('routes.exam.table.content')"
        name="content"
        :rules="[{ required: true, message: t('routes.exam.modal.required.content') }]"
      >
        <Input
          v-model:value="formState.content"
          class="border border-primary rounded-2"
          :placeholder="t('routes.exam.modal.placeholder.content')"
        >
        </Input>
      </Form.Item>
      <Form.Item
        :label="t('routes.exam.table.number_question')"
        name="numberQuestions"
        :rules="[{ required: true, message: t('routes.exam.modal.required.number_question') }]"
      >
        <Input
          v-model:value="formState.numberQuestions"
          class="border border-primary rounded-2"
          :placeholder="t('routes.exam.modal.placeholder.number_question')"
        >
        </Input>
      </Form.Item>
      <Form.Item
        :label="t('routes.exam.table.time')"
        name="time"
        :rules="[{ required: true, message: t('routes.exam.modal.required.time') }]"
      >
        <Input
          v-model:value="formState.time"
          class="border border-primary rounded-2"
          :placeholder="t('routes.exam.modal.placeholder.time')"
        >
        </Input>
      </Form.Item>
      <Form.Item
        :label="t('routes.exam.table.level')"
        name="correct"
        :rules="[{ required: true, message: '' }]"
      >
        <a-radio-group v-model:value="formState.level" button-style="solid">
          <a-radio-button value="0">EASY</a-radio-button>
          <a-radio-button value="1">MEDIUM</a-radio-button>
          <a-radio-button value="2">HARD</a-radio-button>
          <a-radio-button value="3">VERY HARD</a-radio-button>
        </a-radio-group>
      </Form.Item>
    </Form>
    <template #footer>
      <div class="flex justify-end mr-2 mb-3">
        <a-button @click="visible = false">
          {{ $t('common.cancelText') }}
        </a-button>
        <Button
          v-if="formState.content.trim() != '' && formState.name.trim() != ''"
          html-type="submit"
          type="primary"
          @click="createUserFunc()"
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
  import { reactive, ref, defineEmits } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { Button, Form, Input, Modal, notification } from 'ant-design-vue';
  import { to } from '@/utils/awaitTo';
  import { useI18n } from '@/hooks';
  import { createExam } from '@/api/backend/api/exam';

  interface FormState {
    name: string;
    content: string;
    level: ExamLevel;
    time: number;
    numberQuestions: number;
  }
  enum ExamLevel {
    EASY = 0,
    NORMAL = 1,
    HARD = 2,
    VERY_HARD = 3,
  }
  const formState = reactive<FormState>({
    name: '',
    content: '',
    level: ExamLevel.NORMAL,
    time: 0,
    numberQuestions: 0,
  });
  const emit = defineEmits(['update-list']);
  const visible = ref<boolean>(false);
  const { t } = useI18n();
  const showModal = () => {
    visible.value = true;
    formState.level = ExamLevel.NORMAL;
  };

  const createUserFunc = async () => {
    const [err, _res] = await to(createExam(formState));
    if (!err) {
      notification.success({
        message: t('common.success'),
        description: t('routes.exam.create_success'),
      });
      emit('update-list', formState);
      setTimeout(() => {
        visible.value = false;
      }, 10);
    }
    formState.name = '';
    formState.content = '';
    formState.time = 0;
    formState.numberQuestions = 0;
    formState.level = ExamLevel.NORMAL;
  };
</script>

<style lang="less" scoped></style>
