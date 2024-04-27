<template>
  <div>
    <Card style="margin: 0 6px 0px 6px; min-width: fit-content">
      <template #title>
        <div class="flex" style="justify-content: space-between; align-items: center">
          <span>
            {{ t('routes.answer.list_answer') }}
          </span>
        </div>
      </template>
      <div
        class="flex"
        style="justify-content: space-between; align-items: center; margin-bottom: 4px"
      >
        <span v-if="listAnswer"> {{ t('routes.exam.total') }}: {{ pageSetting.total }} </span>
        <div style="display: flex; align-items: center">
          <Add @update-list="updateListAfterCreate" :exam="listNameExam" />
        </div>
      </div>
      <a-table
        v-if="showTable"
        v-model:data-source="listAnswer"
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
          <template v-else-if="column.dataIndex === 'createdAt'">
            <span>{{ $t('routes.exam.table.createdAt') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'answer'">
            <span>{{ $t('routes.answer.table.answer') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'isCorrect'">
            <span>{{ $t('routes.answer.table.isCorrect') }}</span>
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
          <template v-else-if="column.dataIndex === 'action'">
            <Dropdown placement="bottomRight">
              <AppstoreTwoTone />
              <template #overlay>
                <Menu>
                  <Menu.Item> </Menu.Item>
                </Menu>
              </template>
            </Dropdown>
          </template>
        </template>
      </a-table>
    </Card>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, defineProps } from 'vue';
  import { AppstoreTwoTone, SearchOutlined } from '@ant-design/icons-vue';
  import { Card, Menu, Dropdown, notification } from 'ant-design-vue';
  import Add from './crud/add.vue';
  import type { TableProps } from 'ant-design-vue';
  import { useI18n } from '@/hooks';
  import to from '@/utils/awaitTo';
  import { formatToDate } from '@/utils/dateUtil';
  import { getAnswerList } from '@/api/backend/api/answer';
  const exam = ref();
  const listAnswer = ref();
  const listNameExam = ref();
  const showTable = ref(true);
  const { t } = useI18n();
  type PageSetting = {
    total?: number;
  };
  const pageSetting = ref<PageSetting>({
    total: 0,
  });
  const props = defineProps({
    questionId: Number,
  });

  const getDataQuestion = async (examId: number) => {
    // lấy danh sách tên tất cả bộ đê thi
    const [err, res] = await to(getAnswerList(props.questionId ?? 0));
    if (err) {
      notification.error({
        message: t('common.error'),
        description: err.message,
      });
    }
    listAnswer.value = res.questions;
    listAnswer.value.forEach((e, index) => (e.index = index + 1));
    pageSetting.value.total = res.questions.length;
  };
  onMounted(async () => {
    await getDataQuestion(exam.value);
  });

  const updateListAfterCreate = (data) => {
    if (exam.value == data.examId)
      listAnswer.value.push({
        index: listAnswer.value.length + 1,
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
      dataIndex: 'isCorrect',
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
