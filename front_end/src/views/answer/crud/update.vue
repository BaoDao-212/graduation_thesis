<!-- eslint-disable vue/no-unused-components -->
<template>
  <div class="flex justify-end text-decoration-none" @click="showModal">
    <EditOutlined /> {{ t('routes.answer.edit_answer') }}
  </div>
  <Modal
    v-model:visible="visible"
    :cancel-text="$t('common.cancelText')"
    :title="$t('routes.answer.edit_answer')"
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
          <a-radio-button value="true">{{ t('routes.answer.correct') }}</a-radio-button>
          <a-radio-button value="false">{{ t('routes.answer.incorrect') }}</a-radio-button>
        </a-radio-group>
      </Form.Item>
    </Form>
    <template #footer>
      <div class="flex justify-end mr-2 mb-3">
        <a-button @click="visible = false">
          {{ $t('common.cancelText') }}
        </a-button>
        <Button
          v-if="
            (answerOld.answer && formState.answer != answerOld.answer) ||
            (String(answerOld.isCorrect) &&
              String(answerOld.isCorrect) != String(formState.isCorrect))
          "
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
  import { EditOutlined} from '@ant-design/icons-vue';
  import { Button, Form, Input, Modal, notification } from 'ant-design-vue';
  import { to } from '@/utils/awaitTo';
  import { useI18n } from '@/hooks';
  import { updateAnswer } from '@/api/backend/api/answer';
  import { useRoute } from 'vue-router';
  const answerOld = ref();
  const props = defineProps({
    answer: Object,
  });
  interface FormState {
    isCorrect: boolean | string;
    answer: string;
    questionId: number;
    answerId: number;
  }
  const route = useRoute();
  const formState = ref<FormState>({
    isCorrect: false,
    answer: '',
    questionId: Number(route.params.id),
    answerId: props.answer?.id || 0,
  });
  const emit = defineEmits(['update-list']);
  const visible = ref<boolean>(false);
  const { t } = useI18n();
  const showModal = () => {
    visible.value = true;
    console.log(props.answer);
    answerOld.value = props.answer;
    formState.value.answer = props.answer?.answer;
    formState.value.isCorrect = String(props.answer?.isCorrect || false);
    formState.value.answerId = props.answer?.id || 0;
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
    formState.value.answer = answer;
    const [err, _res] = await to(
      updateAnswer(props.answer?.id || 0, {
        answer: answer,
        questionId: Number(route.params.id),
        isCorrect: formState.value.isCorrect == 'false' ? false : true,
      }),
    );
    if (!err) {
      notification.success({
        message: t('common.success'),
        description: t('routes.answer.notification.update_success'),
      });
      emit('update-list', {
        answerId: props.answer?.id || 0,
        answer: formState.value.answer,
        isCorrect: formState.value.isCorrect == 'false' ? false : true,
      });
      setTimeout(() => {
        visible.value = false;
      }, 10);
    }
    formState.value.answer = '';
  };
</script>

<style lang="less" scoped></style>
