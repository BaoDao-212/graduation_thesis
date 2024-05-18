<!-- eslint-disable vue/no-unused-components -->
<template>
  <div class="flex justify-end">
    <Button type="primary" @click="showModal"
      ><PlusOutlined /> {{ t('routes.question.create') }}</Button
    >
  </div>
  <Modal
    v-model:visible="visible"
    :cancel-text="$t('common.cancelText')"
    :title="$t('routes.question.create')"
    :width="1000"
    @ok="createFunc"
  >
    <Form
      :model="formState"
      layout="vertical"
      autocomplete="off"
      class="d-flex justify-content-center align-items-center"
    >
      <Form.Item :label="t('routes.question.table.exam')" name="exam">
        <a-select
          v-if="props.exam && props.exam.length > 0"
          v-model:value="formState.examId"
          class="border border-primary rounded-2"
          :options="
            (props.exam as Array<{ name: string; id: number }>).map((t) => ({
              label: t.name,
              value: t.id,
            }))
          "
        ></a-select>
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
        :label="t('routes.question.explanation')"
        name="explanation"
        :rules="[{ required: true, message: t('routes.question.placeholder.explanation') }]"
      >
        <Input
          v-model:value="formState.explanation"
          class="border border-primary rounded-2"
          :placeholder="t('routes.question.placeholder.explanation')"
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
          v-if="formState.content.trim() != '' && formState.explanation.trim() != ''"
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
  import { reactive, ref, defineEmits, defineProps } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { Button, Form, Input, Modal, notification } from 'ant-design-vue';
  import { to } from '@/utils/awaitTo';
  import { useI18n } from '@/hooks';
  import { createQuestion } from '@/api/backend/api/question';
  const props = defineProps({
    exam: Array,
  });
  interface FormState {
    explanation: string;
    content: string;
    level: ExamLevel;
    examId: number;
  }
  enum ExamLevel {
    EASY = 0,
    NORMAL = 1,
    HARD = 2,
    VERY_HARD = 3,
  }
  const formState = reactive<FormState>({
    explanation: '',
    content: '',
    level: ExamLevel.NORMAL,
    examId: ((props.exam ?? [])[0] as { id?: number })?.id ?? 0,
  });
  const emit = defineEmits(['update-list']);
  const visible = ref<boolean>(false);
  const { t } = useI18n();
  const showModal = () => {
    visible.value = true;
    formState.level = ExamLevel.NORMAL;
    formState.content = '';
    formState.explanation = '';
    formState.examId = ((props.exam ?? [])[0] as { id?: number })?.id ?? 0;
  };

  const createFunc = async () => {
    const { content, explanation } = formState;
    if (content.trim() == '' || explanation.trim() == '') {
      return notification.warning({
        message: t('common.warning'),
        description: t('common.warn_message_empty'),
      });
    }
    const [err, _res] = await to(createQuestion(formState));
    if (!err) {
      notification.success({
        message: t('common.success'),
        description: t('routes.question.notification.create_success'),
      });
      emit('update-list', formState);
      setTimeout(() => {
        visible.value = false;
      }, 10);
    }
    formState.explanation = '';
    formState.content = '';
    formState.level = ExamLevel.NORMAL;
    formState.examId = ((props.exam ?? [])[0] as { id?: number })?.id ?? 0;
  };
</script>

<style lang="less" scoped></style>
