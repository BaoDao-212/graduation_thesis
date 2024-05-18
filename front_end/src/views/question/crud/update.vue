<!-- eslint-disable vue/no-unused-components -->
<template>
  <Card :cancel-text="$t('common.cancelText')" :title="$t('routes.question.update')" :width="1000">
    <Form
      :model="formState"
      layout="vertical"
      autocomplete="off"
      class="d-flex justify-content-center align-items-center"
    >
      <Form.Item :label="t('routes.question.table.exam')" name="exam">
        <a-select
          v-if="listNameExam && listNameExam.length > 0"
          v-model:value="formState.examId"
          class="border border-primary rounded-2"
          :options="
            (listNameExam as Array<{ name: string; id: number }>).map((t) => ({
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
        <a-radio-group v-model:value="level" button-style="solid">
          <a-radio-button value="0">EASY</a-radio-button>
          <a-radio-button value="1">MEDIUM</a-radio-button>
          <a-radio-button value="2">HARD</a-radio-button>
          <a-radio-button value="3">VERY HARD</a-radio-button>
        </a-radio-group>
      </Form.Item>
    </Form>
    <div class="flex justify-end mr-2 mb-3">
      <a-button @click="visible = false">
        {{ $t('common.cancelText') }}
      </a-button>
      <Button
        v-if="
          questionOld &&
          ((questionOld.content && formState.content != questionOld.content) ||
            (questionOld.explanation && formState.explanation != questionOld.explanation) ||
            Number(level) != Number(questionOld.level) ||
            (questionOld.exam.id && formState.examId != questionOld.exam.id))
        "
        html-type="submit"
        type="primary"
        @click="update()"
        >{{ $t('common.okText') }}
      </Button>
      <Button v-else html-type="submit" disabled>
        {{ $t('common.okText') }}
      </Button>
    </div>
  </Card>
  <ListAnswer :questionId="Number(route.params.id)" />
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Button, Form, Input, notification, Card } from 'ant-design-vue';
  import { to } from '@/utils/awaitTo';
  import { useI18n } from '@/hooks';
  import { getExamNameList, getQuestionById, updateQuestion } from '@/api/backend/api/question';
  import { onBeforeMount } from 'vue';
  import { useRoute } from 'vue-router';
  import ListAnswer from '@/views/answer/index.vue';
  interface FormState {
    explanation: string;
    content: string;
    level: ExamLevel;
    examId: number;
  }
  const level = ref('');
  enum ExamLevel {
    EASY = 0,
    NORMAL = 1,
    HARD = 2,
    VERY_HARD = 3,
  }
  const formState = ref<FormState>({
    explanation: '',
    content: '',
    level: ExamLevel.NORMAL,
    examId: 0,
  });
  const route = useRoute();
  const visible = ref<boolean>(false);
  const listNameExam = ref();
  const { t } = useI18n();
  const getDataExamName = async () => {
    // lấy danh sách tên tất cả bộ đê thi
    const [err, res] = await to(getExamNameList());
    if (err) {
      notification.error({
        message: t('common.error'),
        description: err.message,
      });
    }
    listNameExam.value = res.exams;
  };
  const questionOld = ref();
  onBeforeMount(async () => {
    await getDataExamName();
    const res = await getQuestionById(Number(route.params.id));
    if (res.ok) {
      questionOld.value = res.question;
      formState.value.level = res.question.level;
      level.value = res.question.level.toString() ?? '';
      formState.value.content = res.question.content ?? '';
      formState.value.explanation = res.question.explanation ?? '';
      formState.value.examId = res.question.exam.id ?? 0;
    } else {
      notification.error({
        message: t('common.error'),
        description: res.error.message ?? '',
      });
    }
  });
  const update = async () => {
    const { content, explanation } = formState.value;
    formState.value.level = Number(level.value);
    if (content.trim() == '' || explanation.trim() == '') {
      return notification.warning({
        message: t('common.warning'),
        description: t('common.warn_message_empty'),
      });
    }
    const [err, _res] = await to(updateQuestion(Number(route.params.id), formState.value));
    if (!err) {
      notification.success({
        message: t('common.success'),
        description: t('routes.question.notification.create_success'),
      });
      setTimeout(() => {
        visible.value = false;
      }, 10);
    }
    questionOld.value = _res.question;
  };
</script>

<style lang="less" scoped></style>
