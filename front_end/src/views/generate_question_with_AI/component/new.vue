<template>
  <div class="flex justify-end">
    <Button type="primary" @click="showModal">
      <PlusOutlined /> {{ t('routes.generate_question.new') }}
    </Button>
  </div>
  <Modal
    v-model:visible="visible"
    :cancel-text="$t('common.cancelText')"
    :title="$t('routes.generate_question.title')"
    :width="1000"
    @ok="createFunc"
  >
    <Form
      v-if="!isSuccessful"
      :model="formState"
      layout="vertical"
      autocomplete="off"
      class="d-flex justify-content-center align-items-center"
    >
      <Form.Item
        v-if="props.exam && props.exam.length > 0"
        :label="t('routes.question.table.exam')"
        name="exam"
      >
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
      <Form.Item v-else>Please create an exam before generating questions</Form.Item>
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
        :label="t('routes.exam.document')"
        name="correct"
        :rules="[{ required: true, message: '' }]"
      >
        <div class="file-input">
          <input type="file" ref="fileInput" id="file-input" required @change="handleFileChange" />
          <label for="file-input">
            <i class="fas fa-upload"></i>
            <span>{{ fileName || 'Chọn tệp' }}</span>
          </label>
          <div class="file-info" v-if="fileName">Tệp được chọn: {{ fileName }}</div>
        </div>
      </Form.Item>
    </Form>

    <Spin v-else size="large" tip="Loading..."> </Spin>
    <template #footer>
      <div class="flex justify-end mr-2 mb-3">
        <a-button @click="visible = false">
          {{ $t('common.cancelText') }}
        </a-button>
        <Button html-type="submit" type="primary" @click="createFunc()">
          {{ $t('common.okText') }}
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
  import { ref, defineEmits, defineProps } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { Button, Form, Input, Modal, Spin, notification } from 'ant-design-vue';
  import { useI18n } from '@/hooks';
  import { generateQuestions } from '@/api/backend/api/openai';
  const props = defineProps({
    exam: Array,
  });
  const isSuccessful = ref<boolean>(false);
  interface FormState {
    examId: number;
    content: string;
  }
  const formState = ref<FormState>({
    examId: 0,
    content: '',
  });

  const emit = defineEmits(['update-list']);
  const visible = ref<boolean>(false);
  const { t } = useI18n();

  const showModal = () => {
    isSuccessful.value = false;
    visible.value = true;
    console.log(props.exam);
    formState.value.content = '';
    formState.value.examId = ((props.exam ?? [])[0] as { id?: number })?.id ?? 0;
  };

  const fileInput = ref<HTMLInputElement | null>(null);
  const fileName = ref<string | null>(null);

  const handleFileChange = () => {
    if (fileInput.value?.files && fileInput.value.files.length > 0) {
      fileName.value = fileInput.value.files[0].name;
    } else {
      fileName.value = null;
    }
  };

  const createFunc = async () => {
    console.log(formState.value.examId);
    if (!fileName.value && formState.value.content.trim() === '') {
      notification.error({
        message: t('common.error'),
        description: t('routes.exam.require_document'),
      });
    } else {
      isSuccessful.value = true;
      const res = await generateQuestions(
        fileInput.value?.files as FileList,
        formState.value.examId,
        formState.value.content,
      );
      if (res.ok) {
        notification.success({
          message: t('common.success'),
          description: t('routes.question.notification.create_success'),
        });
        emit('update-list', { questions: res.questions, examId: formState.value.examId });
        formState.value.content = '';
        setTimeout(() => {
          visible.value = false;
        }, 10);
      } else {
        notification.error({
          message: t('common.error'),
          description: res.error.message,
        });
      }
      isSuccessful.value = false;
    }
  };
</script>

<style lang="css" scoped>
  .file-input {
    position: relative;
    display: inline-block;
  }

  .file-input input[type='file'] {
    position: absolute;
    z-index: -1;
    opacity: 0;
    display: block;
    width: 0;
    height: 0;
  }

  .file-input label {
    display: inline-block;
    background-color: #007bff;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .file-input label:hover {
    background-color: #0056b3;
  }

  .file-input label i {
    margin-right: 0.5rem;
  }
</style>
