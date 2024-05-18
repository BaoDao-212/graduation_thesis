<template>
  <div>
    <Card style="margin: 0 6px 0px 6px; min-width: fit-content">
      <template #title>
        <div class="flex" style="justify-content: space-between; align-items: center">
          <div style="display: flex; flex-direction: row">
            <router-link to="/question/list">
              <LeftOutlined style="margin-right: 6px; color: #309ce9" />
            </router-link>
            <span>
              {{ t('routes.generate_question.title') }}
            </span>
          </div>
          <AddAssistant />
          <New :exam="listNameExam" @update-list="updateList" />
        </div>
      </template>
      <div>
        <div>
          <div v-for="question in listQuestion" :key="question.content">
            <Card>
              <div
                v-if="question && question.content"
                style="
                  font-weight: 600;
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                "
              >
                <div style="display: flex; flex-direction: row"
                  ><div>{{ question.index }},</div>
                  <div> {{ question.content }}</div>
                </div>
                <ChangeQuestion :question="question" :examId="examId" @update-list="updateListAfterReview" />
              </div>
              <div
                v-for="(answer, aIndex) in question.answers"
                :key="aIndex"
                style="margin-left: 10px"
              >
                <div v-if="answer.isCorrect.toString() == 'true'">
                  {{ abcdefgh[aIndex] }}. {{ answer.content }}
                  <CheckOutlined :style="{ color: 'green' }" />
                </div>
                <div v-else> {{ abcdefgh[aIndex] }}. {{ answer.content }} </div>
              </div>
              <div v-if="question.explanation"> </div>
              <div style="font-weight: 600; margin-top: 10px">Explanation</div>
              <div>{{ question.explanation }}</div>
            </Card>
          </div>
        </div>
      </div>
    </Card></div
  >
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue';
  import { CheckOutlined, LeftOutlined } from '@ant-design/icons-vue';
  import { Card, notification } from 'ant-design-vue';
  import ChangeQuestion from './component/review.vue';
  import { useI18n } from '@/hooks';
  import Storage from '@/utils/Storage';
  import New from './component/new.vue';
  import AddAssistant from './component/assistant.vue';
  import to from '@/utils/awaitTo';
  import { getExamNameList } from '@/api/backend/api/exam';
  const { t } = useI18n();
  const show = ref(true);
  const listQuestion = ref();
  const user = ref(Storage.get('PROFILE'));
  console.log(user.value);
  onBeforeMount(async () => {
    await getDataExamName();
  });
  const listNameExam = ref();
  const abcdefgh = ref(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M']);
  const getDataExamName = async () => {
    // lấy danh sách tên tất cả bộ đê thi
    const [_err, res] = await to(getExamNameList());
    if (!res.ok) {
      notification.error({
        message: t('common.error'),
        description: res.error.message,
      });
    } else {
      listNameExam.value = res.exams;
    }
  };
  const examId = ref();
  const updateList = async (newData) => {
    listQuestion.value = newData.questions;
    listQuestion.value.forEach((e, index) => (e.index = index + 1));
    examId.value = newData.examId;
    setTimeout(() => {
      show.value = true;
    }, 10);
  };
  const updateListAfterReview = async (index) => {
    listQuestion.value =listQuestion.value.filter((e) => e.index !== index);
    setTimeout(() => {
      show.value = true;
    }, 10);
  };
</script>
<style lang="less" scoped>
  .ql-editor.ql-blank {
    padding: 0 !important;
  }
</style>
