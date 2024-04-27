<template>
  <div>
    <Card v-if="listNameExam" style="margin: 0 6px 0px 6px; min-width: fit-content">
      <template #title>
        <div class="flex" style="justify-content: space-between; align-items: center">
          <span>
            {{ t('routes.question.list_question') }}
          </span>
        </div>
      </template>
      <div
        class="flex"
        style="justify-content: space-between; align-items: center; margin-bottom: 4px"
      >
        <span v-if="listQuestion"> {{ t('routes.exam.total') }}: {{ pageSetting.total }} </span>
        <div style="display: flex; align-items: center">
          <Add @update-list="updateListAfterCreate" :exam="listNameExam" />
        </div>
      </div>
      <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 5px">
        <span style="margin-right: 10px">{{ t('routes.question.exam') }}:</span>
        <a-select
          v-if="listNameExam"
          v-model:value="exam"
          style="width: 300px"
          class="border border-primary rounded-2"
          :options="listNameExam.map((t) => ({ label: t.name, value: t.id }))"
          @change="getDataQuestion(exam)"
        ></a-select>
      </div>
      <a-table
        v-if="showTable"
        v-model:data-source="listQuestion"
        :columns="columns"
        :pagination="{
          showSizeChanger: true,
          showLessItems: true,
          pageSizeOptions: ['10', '20', '50', '100', '150', '200', '300'],
          total: pageSetting.total,
        }"
        :scroll="{ x: 1180 }"
        bordered
      >
        <template #headerCell="{ column }">
          <template v-if="column.dataIndex === 'index'">
            <span>{{ $t('routes.exam.table.id') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'explaination'">
            <span>{{ $t('routes.question.explaination') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'createdAt'">
            <span>{{ $t('routes.exam.table.createdAt') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'content'">
            <span>{{ $t('routes.question.table.content') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'level'">
            <span>{{ $t('routes.exam.table.level') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <span>{{ $t('routes.exam.table.action') }}</span>
          </template>
        </template>
        <template #customFilterIcon>
          <search-outlined
            :style="{
              color: '#000',
              fontSize: '16px',
            }"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'createdAt'">
            {{ formatToDate(record.createdAt) }}
          </template>
          <template v-else-if="column.dataIndex === 'level'">
            <span>
              <Tag color="green">
                {{
                  record.level == 0
                    ? 'EASY'
                    : record.level == 1
                      ? 'MEDIUM'
                      : record.level == 2
                        ? 'HARD'
                        : 'VERY HARD'
                }}
              </Tag>
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <Dropdown placement="bottomRight">
              <AppstoreTwoTone />
              <template #overlay>
                <Menu>
                  <Menu.Item> 
                    <router-link :to="`/question/update/${record.id}`">
                      <edit-two-tone />{{ $t('routes.question.update') }}
                    </router-link>
                  </Menu.Item>
                </Menu>
              </template>
            </Dropdown>
          </template>
        </template>
      </a-table>
    </Card>
    <Card v-else style="margin: 0 6px 0px 6px; min-width: fit-content"> {{ t('routes.question.empty') }}</Card>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { AppstoreTwoTone, SearchOutlined } from '@ant-design/icons-vue';
  import { Card, Tag, Menu, Dropdown, notification } from 'ant-design-vue';
  import Add from './crud/add.vue';
  import type { TableProps } from 'ant-design-vue';
  import { useI18n } from '@/hooks';
  import to from '@/utils/awaitTo';
  import { getExamNameList } from '@/api/backend/api/exam';
  import { formatToDate } from '@/utils/dateUtil';
  import { getQuestionList } from '@/api/backend/api/question';
  const exam = ref();
  const listQuestion = ref();
  const listNameExam = ref();
  const showTable = ref(true);
  const { t } = useI18n();
  type PageSetting = {
    total?: number;
  };
  const pageSetting = ref<PageSetting>({
    total: 0,
  });
  // hàm lây data
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
  const getDataQuestion = async (examId: number) => {
    // lấy danh sách tên tất cả bộ đê thi
    const [err, res] = await to(getQuestionList(examId));
    if (err) {
      notification.error({
        message: t('common.error'),
        description: err.message,
      });
    }
    listQuestion.value = res.questions;
    listQuestion.value.forEach((e, index) => (e.index = index + 1));
    pageSetting.value.total = res.questions.length;
  };
  onMounted(async () => {
    await getDataExamName();
    if (listNameExam.value.length) {
      exam.value = listNameExam.value[0].id;
      await getDataQuestion(exam.value);
    }
  });
  // hàm thay đổi khi sort
  // const handleChange: TableProps['onChange'] = async (_pagination, _filters, _sorter) => {
  //   await getDataExamName();
  // };

  const updateListAfterCreate = (data) => {
    if (exam.value == data.examId)
      listQuestion.value.push({
        index: listQuestion.value.length + 1,
        id: data.id,
        content: data.content,
        explaination: data.explaination,
        level: data.level,
        createdAt: new Date(),
      });
  };
  const columns: TableProps['columns'] = [
    {
      dataIndex: 'index',
      align: 'center',
      width: 30,
    },
    {
      dataIndex: 'content',
      align: 'left',
      width: 200,
      minWidth: 180,
    },
    {
      dataIndex: 'createdAt',
      align: 'left',
      width: 200,
      minWidth: 180,
    },
    {
      dataIndex: 'explaination',
      align: 'left',
      width: 250,
    },
    {
      dataIndex: 'level',
      align: 'left',
      width: 100,
    },
    {
      dataIndex: 'action',
      align: 'center',
      width: 70,
    },
  ];
</script>

<style lang="less" scoped>
  .highlight {
    background-color: rgb(255, 192, 105);
    padding: 0px;
  }
</style>
