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
    <Form layout="vertical" autocomplete="off">
      <Form.Item
        :label="t('routes.question.question_name')"
        name="name"
        :rules="[{ required: true, message: '' }]"
      >
        <QuillEditor
          v-if="show && question"
          v-model:content="question.name"
          content-type="html"
          toolbar="full"
        />
        <div v-if="check(question.name)" role="alert" class="ant-form-item-explain-error">{{
          t('routes.category.modalCreateCategory.nameValidate')
        }}</div>
      </Form.Item>

      <Form.Item
        :label="t('routes.question.create.description')"
        name="description"
        :rules="[{ required: true, message: '' }]"
      >
        <QuillEditor
          v-if="show && question"
          v-model:content="question.explainCorrectAnswer"
          content-type="html"
          toolbar="full"
        />
        <div
          v-if="check(question.explainCorrectAnswer)"
          role="alert"
          class="ant-form-item-explain-error"
          >{{ t('routes.category.modalCreateCategory.descriptionValidate') }}</div
        >
      </Form.Item>
      <div style="display: flex; justify-content: space-around">
        <div style="width: 600px">
          <Form.Item
            :label="t('routes.question_category.type')"
            name="type"
            :rules="[
              {
                required: true,
                validator: nameCategoryValidator,
                trigger: 'change',
              },
            ]"
          >
            <Radio.Group v-model:value="type" button-style="solid">
              <Radio.Button value="PRACTICE" @click="selectPractice">PRACTICE</Radio.Button>
              <Radio.Button value="EXAM" @click="selectExam">EXAM</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </div>
        <div style="width: 600px">
          <Form.Item
            :label="t('routes.question_category.delete.name')"
            name="nameCategory"
            :rules="[
              {
                required: true,
                validator: nameCategoryValidator,
                trigger: 'change',
              },
            ]"
          >
            <Select
              v-model:value="nameCategory"
              :options="listCategory.filter((e) => e.type == type).map((t) => ({ value: t.name }))"
            ></Select>
          </Form.Item>
        </div>
      </div>
      <div v-if="question && question.answers && question.answers">
        <div
          v-for="an in question.answers"
          :key="an"
          style="display: flex; flex-direction: row; justify-content: space-between"
        >
          <Form.Item
            :label="t('routes.answer.create.name')"
            name="name"
            :rules="[{ required: true, message: t('routes.answer.create.place_name') }]"
          >
            <Input
              v-model:value="an.content"
              class="border border-primary rounded-2 w-200"
              :placeholder="t('routes.answer.create.placeholder_name')"
            >
            </Input>
          </Form.Item>
          <Form.Item
            :label="t('routes.answer.create.correct')"
            name="correct"
            :rules="[{ required: true, message: '' }]"
          >
            <Radio.Group v-model:value="an.isCorrect" button-style="solid">
              <Radio.Button value="true">TRUE</Radio.Button>
              <Radio.Button value="false">FALSE</Radio.Button>
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
  import { Button, Form, Input, Modal, Radio, Select, notification } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/lib/form';
  import { useI18n } from '@/hooks';
  const type = ref();

  const nameCategoryValidator = async (_rule: Rule) => {
    return Promise.resolve();
  };
  const show = ref(true);
  const props = defineProps({
    question: {
      type: Object,
      required: true,
    },
    category: {
      type: Array,
      required: true,
    },
  });
  const question = ref();
  const selectExam = () => {
    nameCategory.value = listCategory.value.filter((e) => e.type == 'EXAM')[0].name;
  };
  const selectPractice = () => {
    nameCategory.value = listCategory.value.filter((e) => e.type == 'PRACTICE')[0].name;
  };
  const nameCategory = ref();
  const { t } = useI18n();
  const emit = defineEmits(['update-list']);
  const visible = ref(false);
  const listCategory = ref();
  const showModal = async () => {
    listCategory.value = props.category;
    type.value = 'PRACTICE';
    nameCategory.value = listCategory.value.filter((e) => e.type == 'PRACTICE')[0].name;
    question.value = props.question;
    question.value.answers.forEach((an) => {
      if (an && an.isCorrect.toString()) an.isCorrect = an.isCorrect.toString();
    });
    question.value.explainCorrectAnswer = question.value.explainCorrectAnswer
      ? question.value.explainCorrectAnswer
      : '';
    question.value.name = question.value.content ? question.value.content : '';
    console.log(2);
    visible.value = true;
    console.log(visible.value);
  };
  const check = (text: string) => {
    if (text == '') return false;
    if (text == '<p><br></p>' || text == '<h1><br></h1>' || text == '<h2><br></h2>') return true;
    console.log(text);
    if (text.replace(/<(?!img)[^>]*>/g, '').replace(/\s/g, '') == '') return true;
    return false;
  };
  const createUserFunc = async () => {
    show.value = false;
      notification.success({
        message: t('routes.error.success'),
        description: t('routes.question.create.success'),
      });
      emit('update-list', question.value.index);
    show.value = true;
    setTimeout(() => {
      visible.value = false;
    }, 100);
  };
</script>
