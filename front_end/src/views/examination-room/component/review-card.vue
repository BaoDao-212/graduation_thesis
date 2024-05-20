<!-- eslint-disable vue/no-unused-components -->
<template>
    <div class="container">
      <div class="section">
        <h2>{{ t('routes.exam.analysis_and_evaluation') }}</h2>
      </div>

      <div class="section">
        <h3>{{ t('routes.exam.positive') }}</h3>
        <ul class="positive-list">
          <li v-for="ele in props.review.analysis_and_evaluation.correctly_answered_questions">
            {{ ele }}
          </li>
        </ul>
      </div>

      <div class="section">
        <h3>{{ t('routes.exam.negative') }}</h3>
        <div class="negative-list">
          <div
            v-for="ele in props.review.analysis_and_evaluation.incorrectly_answered_questions"
            class="negative-item"
          >
            <div class="question">{{ ele.content }}</div>
            <div class="evaluation">{{ ele.evaluation }}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>{{ t('routes.exam.suggestion') }}</h2>
        <div class="suggestion-list">
          <div v-for="ele in props.review.suggestions" class="suggestion-item">
            <div class="suggestion-content">{{ ele.content }}:</div>
            <div class="suggestion-description">{{ ele.description }}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>{{ t('routes.exam.reference') }}</h2>
        <div class="reference-list">
          <div v-for="ele in props.review.links" class="reference-item">
            <div class="reference-content">{{ ele.content }}:</div>
            <a class="reference-link" target="_blank">{{ ele.url }}</a>
          </div>
        </div>
      </div>
    </div>
</template>
<script lang="ts" setup>
  import { defineProps } from 'vue';
  import { useI18n } from '@/hooks';
  const { t } = useI18n();
  const props = defineProps({
    review: {
      type: Object,
      required: true,
    },
  });
</script>
<style lang="css">
  .container {
    max-width: 800px;
    margin: 0 5px;
    font-family: Arial, sans-serif;
  }

  .section {
    margin-bottom: 30px;
  }

  .section h2 {
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .section h3 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .positive-list,
  .negative-list,
  .suggestion-list,
  .reference-list {
    list-style-type: none;
    padding: 0;
  }

  .positive-list li,
  .negative-item,
  .suggestion-item,
  .reference-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .negative-item,
  .suggestion-item,
  .reference-item {
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
  }

  .question {
    font-weight: bold;
    margin-right: 10px;
  }

  .reference-link {
    color: blue;
    text-decoration: underline;
  }
</style>
