<!-- eslint-disable vue/no-unused-components -->
<template>
  <div class="flex justify-end">
    <Button type="primary" @click="showModal"
      ><PlusOutlined /> {{ t('routes.generate_question.new') }}</Button
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
      <Form.Item v-if="props.exam && props.exam.length > 0" :label="t('routes.question.table.exam')" name="exam">
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
      <div v-else style="color:red " class="m-2">Please create new exam before generate a set of question</div>
      <Form.Item
        :label="t('routes.exam.document')"
        name="correct"
        :rules="[{ required: true, message: '' }]"
      >
        <a-upload
          v-model:file-list="fileList"
          list-type="picture"
          :max-count="1"
          :before-upload="beforeUpload"
          accept=".docx"
        >
          <a-button>
            <upload-outlined></upload-outlined>
            Upload file
          </a-button>
        </a-upload>
      </Form.Item>
    </Form>
    <template #footer>
      <div class="flex justify-end mr-2 mb-3">
        <a-button @click="visible = false">
          {{ $t('common.cancelText') }}
        </a-button>
        <Button
          v-if="fileList && fileList.length > 0"
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
  import { Button, Form, Modal, notification, type UploadProps } from 'ant-design-vue';
  import { useI18n } from '@/hooks';
  import { generateQuestions } from '@/api/backend/api/exam';
  const props = defineProps({
    exam: Array,
  });
  interface FormState {
    examId: number;
  }
  const formState = ref<FormState>({
    examId: 0,
  });
  const fileList = ref<UploadProps['fileList']>([]);
  const emit = defineEmits(['update-list']);
  const visible = ref<boolean>(false);
  const { t } = useI18n();
  const showModal = () => {
    visible.value = true;
    console.log(props.exam);
    (formState.value.examId = ((props.exam ?? [])[0] as { id?: number })?.id ?? 0),
      (fileList.value = []);
  };
  const beforeUpload = (file) => {
    fileList.value = [file];
    return false;
  };

  const createFunc = async () => {
    if ((fileList.value ?? []).length === 0) {
      notification.error({
        message: t('common.error'),
        description: t('routes.exam.require_document'),
      });
      return;
    } else {
      const res = await generateQuestions(fileList.value, formState.value.examId);
      if (!res.ok) {
        notification.success({
          message: t('common.success'),
          description: t('routes.question.notification.create_success'),
        });
        emit('update-list', formState.value);
        setTimeout(() => {
          visible.value = false;
        }, 10);
      }
    }
  };
</script>

<style lang="less" scoped></style>
