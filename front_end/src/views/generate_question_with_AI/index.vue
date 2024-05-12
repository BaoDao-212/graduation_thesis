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
          <New :exam="listNameExam"/>
          <!-- <Button
            v-if="error || (option && option.length > 0) || !done"
            type="primary"
            @click="getOption"
            ><DeploymentUnitOutlined /> {{ t('routes.generate_question.new') }}</Button
          >
          <Button v-else type="primary" disabled
            ><DeploymentUnitOutlined /> {{ t('routes.generate_question.new') }}</Button
          > -->
        </div>
      </template>
      <div v-if="!error">
        <div
          v-if="option.length == 0 && done"
          style="display: flex; justify-content: center; min-height: 700px; align-items: center"
        >
          <Spin size="large" tip="Loading..."> </Spin>
        </div>
        <div>
          <div v-for="question in option" :key="question.content">
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
                  <div v-html="question.content"> </div>
                </div>
                <ChangeQuestion
                  :question="question"
                  :category="listCategory"
                  @update-list="updateList"
                />
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
            </Card>
          </div>
        </div>
      </div>
      <div v-else>
        <Result status="500" title="" :sub-title="t('routes.generate_question.error')"> </Result>
      </div> </Card
  ></div>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue';
  import { CheckOutlined, LeftOutlined } from '@ant-design/icons-vue';
  import { Card, Result, Spin, notification } from 'ant-design-vue';
  import ChangeQuestion from './openAI/review.vue';
  import { useI18n } from '@/hooks';
  import Storage from '@/utils/Storage';
  import New from './component/new.vue';
  import AddAssistant from './component/assistant.vue';
  import to from '@/utils/awaitTo';
  import { getExamNameList } from '@/api/backend/api/exam';
  const { t } = useI18n();
  const error = ref(false);
  const show = ref(true);
  const done = ref(true);
  interface Answer {
    content: string;
    isCorrect: boolean;
  }

  interface Question {
    content: string;
    answers: Answer[];
    index: number;
  }
  const listCategory = ref();
  const option = ref<Question[]>([]);
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
  // const getOption = async () => {
  //   try {
  //     option.value = [];
  //     error.value = false;
  //     done.value = true;
  //     const response = await axios.get(
  //       `http://localhost:7000/openai/allquestion?language=${lang.value}`,
  //     );
  //     console.log(response);

  //     option.value = response.data;
  //     console.log(option.value);
  //     option.value.forEach((e, index) => (e.index = index + 1));
  //   } catch (e) {
  //     error.value = true;
  //     console.error('Error calling API:', e);
  //   }
  // };
  const updateList = async (newData) => {
    show.value = false;
    option.value = option.value.filter((user) => user.index != newData);
    if (option.value.length == 0) done.value = false;
    option.value.forEach((e, index) => (e.index = index + 1));
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
