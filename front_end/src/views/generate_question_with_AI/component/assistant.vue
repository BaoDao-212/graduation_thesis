<!-- eslint-disable vue/no-unused-components -->
<template>
  <div class="flex justify-end">
    <Button type="primary" @click="showModal"
      ><PlusOutlined /> {{ t('routes.exam.createdAssistant') }}</Button
    >
  </div>
  <Modal
    v-model:visible="visible"
    :cancel-text="$t('common.cancelText')"
    :title="$t('routes.exam.createdAssistant')"
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
        :label="t('routes.exam.OpenAI_apikey')"
        name="openAiKey"
        :rules="[{ required: true, message: t('routes.exam.modal.placeholder.OpenAI_apikey') }]"
      >
        <Input
          v-model:value="formState.openAiKey"
          class="border border-primary rounded-2"
          :placeholder="t('routes.exam.modal.placeholder.OpenAI_apikey')"
        >
        </Input>
      </Form.Item>
    </Form>
    <template #footer>
      <div class="flex justify-end mr-2 mb-3">
        <a-button @click="visible = false">
          {{ $t('common.cancelText') }}
        </a-button>
        <Button
          v-if="formState.openAiKey.trim() != ''"
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
  import { ref, defineEmits } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { Button, Form, Input, Modal, notification } from 'ant-design-vue';
  import { to } from '@/utils/awaitTo';
  import { useI18n } from '@/hooks';
  import { updateApiKeyOpenAI } from '@/api/backend/api/openai';

  interface FormState {
    openAiKey: string;
  }
  const formState = ref<FormState>({
    openAiKey: '',
  });
  const emit = defineEmits(['update-list']);
  const visible = ref<boolean>(false);
  const { t } = useI18n();
  const showModal = () => {
    visible.value = true;
    formState.value.openAiKey = '';
  };

  const createFunc = async () => {
    const [_err, _res] = await to(updateApiKeyOpenAI(formState.value));
    if (_res.ok) {
      notification.success({
        message: t('common.success'),
        description: t('routes.question.notification.create_success'),
      });
      setTimeout(() => {
        visible.value = false;
      }, 10);
    }
    else {
      notification.error({
        message: t('common.error'),
        description: _res.error.message,
      });
    }
    formState.value.openAiKey = '';
  };
</script>

<style lang="less" scoped></style>
