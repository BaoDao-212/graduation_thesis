<!-- eslint-disable vue/no-unused-components -->
<template>
  <div class="flex justify-end align-start">
    <Button type="primary" @click="showModal"
      ><PlusOutlined /> {{ t('routes.post.create') }}</Button
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
      <Form.Item
        :label="t('routes.question.table.name')"
        name="name"
        :rules="[{ required: true, message: t('routes.post.require.name') }]"
      >
        <Input
          v-model:value="formState.name"
          class="border border-primary rounded-2"
          :placeholder="t('routes.post.placeholder.name')"
        >
        </Input>
      </Form.Item>
      <Form.Item
        :label="t('routes.exam.table.content')"
        name="content"
        :rules="[{ required: true, message: t('routes.post.require.content') }]"
      >
        <Input
          v-model:value="formState.content"
          class="border border-primary rounded-2"
          :placeholder="t('routes.post.placeholder.content')"
        >
        </Input>
      </Form.Item>
      <Form.Item
        :label="t('routes.post.status.name')"
        name="status"
        :rules="[{ required: true, message: '' }]"
      >
        <a-radio-group v-model:value="formState.status" button-style="solid">
          <a-radio-button :value="PostStatus.PRIVATE">{{
            t('routes.post.status.private')
          }}</a-radio-button>
          <a-radio-button :value="PostStatus.PUBLISHED">{{
            t('routes.post.status.public')
          }}</a-radio-button>
        </a-radio-group>
      </Form.Item>
      <Form.Item :label="t('routes.question.table.exam')" name="exam">
        <a-select
          v-if="props.exam && props.exam.length > 0"
          v-model:value="formState.examIds"
          mode="tags"
          class="border border-primary rounded-2"
          :options="
            (props.exam as Array<{ name: string; id: number }>).map((t) => ({
              label: t.name,
              value: t.id,
            }))
          "
          :placeholder="t('routes.post.placeholder.exam')"
        ></a-select>
        <div v-esle style="color: red">{{ t('routes.exam.require_exam') }}</div>
      </Form.Item>
    </Form>
    <template #footer>
      <div class="flex justify-end mr-2 mb-3">
        <a-button @click="visible = false">
          {{ $t('common.cancelText') }}
        </a-button>
        <Button
          v-if="formState.content.trim() != ''"
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
  import { createPost } from '@/api/backend/api/post';
  const props = defineProps({
    exam: Array,
  });
  interface FormState {
    name: string;
    content: string;
    status: PostStatus;
    examIds: number[];
  }
  enum PostStatus {
    PRIVATE = 'PRIVATE',
    PUBLISHED = 'PUBLISHED',
  }
  const formState = ref<FormState>({
    name: '',
    content: '',
    status: PostStatus.PUBLISHED,
    examIds: [],
  });
  const emit = defineEmits(['update-list']);
  const visible = ref<boolean>(false);
  const { t } = useI18n();
  const showModal = () => {
    visible.value = true;
    formState.value.status = PostStatus.PUBLISHED;
    formState.value.content = '';
    formState.value.name = '';
    formState.value.examIds = [];
  };

  const createFunc = async () => {
    const { content, name } = formState.value;
    if (content.trim() == '' || name.trim() == '') {
      return notification.warning({
        message: t('common.warning'),
        description: t('common.warn_message_empty'),
      });
    }
    const [_err, _res] = await to(createPost(formState.value));
    if (_res.ok) {
      notification.success({
        message: t('common.success'),
        description: t('routes.post.notification.create_success'),
      });
      emit('update-list', formState.value);
      setTimeout(() => {
        visible.value = false;
      }, 10);
    } else {
      notification.error({
        message: t('common.error'),
        description: _res.error.message,
      });
    }
    formState.value.name = '';
    formState.value.content = '';
    formState.value.status = PostStatus.PUBLISHED;
    formState.value.examIds = [];
  };
</script>

<style lang="less" scoped></style>
