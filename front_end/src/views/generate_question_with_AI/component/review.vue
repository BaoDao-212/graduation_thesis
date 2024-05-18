<template>
  <div class="flex justify-end">
    <Button type="primary" @click="showModal"
      ><EyeOutlined />{{ t('routes.generate_question.review') }}</Button
    >
  </div>
  <Modal
    v-model:visible="visible"
    :title="t('routes.generate_question.title_review')"
    :ok-text="t('common.okText')"
    :cancel-text="t('common.cancelText')"
    width="1200px"
    @ok="createUserFunc"
  >
    <Form v-if="question" layout="vertical" autocomplete="off">
      <Form.Item
        :label="t('routes.exam.table.content')"
        name="content"
        :rules="[{ required: true, message: t('routes.exam.modal.required.content') }]"
      >
        <Input
          v-model:value="question.content"
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
          v-model:value="question.explanation"
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
        <a-radio-group v-model:value="question.level" button-style="solid">
          <a-radio-button value="0">EASY</a-radio-button>
          <a-radio-button value="1">MEDIUM</a-radio-button>
          <a-radio-button value="2">HARD</a-radio-button>
          <a-radio-button value="3">VERY HARD</a-radio-button>
        </a-radio-group>
      </Form.Item>
      <div v-if="question && question.answers">
        <div
          v-for="an in question.answers"
          :key="an.content"
          style="display: flex; flex-direction: row; justify-content: space-between"
        >
          <Form.Item
            :label="t('routes.exam.table.content')"
            name="answer"
            :rules="[{ required: true, message: t('routes.exam.modal.required.content') }]"
          >
            <Input
              v-model:value="an.content"
              class="border border-primary rounded-2 w-200"
              :placeholder="t('routes.answer.create.placeholder_name')"
            >
            </Input>
          </Form.Item>
          <Form.Item
            :label="t('routes.answer.table.isCorrect')"
            name="correct"
            :rules="[{ required: true, message: '' }]"
          >
            <Radio.Group v-model:value="an.isCorrect" button-style="solid">
              <Radio.Button value="true">{{ t('routes.answer.correct') }}</Radio.Button>
              <Radio.Button value="false">{{ t('routes.answer.incorrect') }}</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </div>
      </div>
    </Form>
    <template #footer>
      <div class="flex justify-end mr-2 mb-3">
        <Button @click="visible = false">
          {{ t('common.cancelText') }}
        </Button>

        <Button html-type="submit" type="primary" @click="createUserFunc">
          {{ t('routes.generate_question.save') }}
        </Button>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
  import { ref, defineEmits } from 'vue';
  import { EyeOutlined } from '@ant-design/icons-vue';
  import { Button, Form, Input, Modal, Radio, notification } from 'ant-design-vue';
  import { useI18n } from '@/hooks';
  import { createQuestionAndExam } from '@/api/backend/api/exam';
  interface Answer {
    content: string;
    isCorrect: boolean | string;
  }

  interface Question {
    content: string;
    answers: Answer[];
    level: number | string;
    explanation: string;
    index: number;
  }
  const props = defineProps({
    question: {
      type: Object,
      required: true,
    },
    examId: {
      type: Number,
      required: true,
    },
  });
  const question = ref<Question>();
  const { t } = useI18n();
  const emit = defineEmits(['update-list']);
  const visible = ref(false);
  const showModal = async () => {
    question.value = props.question as Question;
    question.value.level = question.value.level ? question.value.level.toString() : '0';
    question.value.answers.forEach((an) => {
      if (an && an.isCorrect.toString()) an.isCorrect = an.isCorrect.toString();
      else an.isCorrect = 'false';
    });
    question.value.explanation = question.value.explanation ? question.value.explanation : '';
    question.value.content = question.value.content ? question.value.content : '';
    visible.value = true;
  };
  const createUserFunc = async () => {
    if (question.value) {
      const answersDto = question.value.answers.map((answer) => ({
        answer: answer.content,
        isCorrect: answer.isCorrect === 'true' ? true : false,
      }));
      question.value.level = parseInt(question.value.level.toString());
      const res = await createQuestionAndExam(props.examId, {
        ...question.value,
        level: question.value.level as number,
        answers: answersDto,
      });
      if (res.ok) {
        notification.success({
          message: t('common.success'),
          description: t('routes.question.notification.create_success'),
        });
        emit('update-list', question.value.index);
        visible.value = false;
      } else {
        notification.error({
          message: t('common.error'),
          description: res.error.message,
        });
      }
    }
    setTimeout(() => {
      visible.value = false;
    }, 100);
  };
</script>
