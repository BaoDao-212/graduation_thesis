<template>
  <div style="width: 100%; margin-top: 10px">
    <Card
      :style="{
        border:
          '2px solid ' +
          (props.answers.join(',') ==
          props.question.answers
            .filter((an) => an.isCorrect == true)
            .map((an) => an.id)
            .join(',')
            ? 'green'
            : 'red'),
        width: '100%',
        marginTop: '10px',
      }"
    >
      <div
        v-if="props.question"
        class="flex"
        style="margin-top: 10px; margin-bottom: 10px; flex-direction: column"
      >
        <div class="flex flex-row">
          <span class="mr-1" style="font-weight: bold"> {{ t('routes.question.question') }}: </span>
          {{ props.question.content }}
          <Tag
            v-if="
              props.answers.join(',') ==
              props.question.answers
                .filter((an) => an.isCorrect == true)
                .map((an) => an.id)
                .join(',')
            "
            color="green"
            class="ml-2"
            >{{ t('routes.answer.correct') }}</Tag
          >
          <Tag v-else color="red" class="ml-2">{{ t('routes.answer.incorrect') }}</Tag>
        </div>
        <div class="flex mt-2" style="flex-direction: column">
          <div v-for="value in props.question.answers" :value="value.id">
            <span>
              {{ value.answer }}
            </span>
            <CheckOutlined class="ml-2" :style="{ color: 'green' }" v-if="value.isCorrect" />
            <CloseOutlined
              class="ml-2"
              :style="{ color: 'red' }"
              v-if="props.answers == value.id && value.isCorrect == false"
            />
          </div>
          <Button
            type="primary"
            style="margin-top: 10px; width: 100px"
            @click="showExplanation = !showExplanation"
          >
            {{t('routes.question.explanation') }}
          </Button>
          <div v-if="showExplanation" style="margin-top: 10px">
            <span style="font-weight: bold">{{ t('routes.question.explanation') }}: </span>
            {{ props.question.explanation }}
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
<script lang="ts" setup>
  import { Card, Tag } from 'ant-design-vue';
  import { useI18n } from '@/hooks';
  import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';
  import { ref } from 'vue';
  const showExplanation = ref(false);
  const { t } = useI18n();
  const props = defineProps({
    question: {
      type: Object,
      required: true,
    },
    answers: {
      type: Array,
      required: true,
    },
  });
</script>
