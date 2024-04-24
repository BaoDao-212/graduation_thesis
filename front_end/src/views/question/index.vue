<template>
  <div>
    <Card style="margin: 0 6px 0px 6px; min-width: fit-content">
      <template #title>
        <div class="flex" style="justify-content: space-between; align-items: center">
          <span>
            {{ t('routes.exam.list_exam') }}
          </span>
        </div>
      </template>
      <div
        class="flex"
        style="justify-content: space-between; align-items: center; margin-bottom: 4px"
      >
        <span v-if="listQuestion"> {{ t('routes.exam.total') }}: {{ pageSetting.total }} </span>
        <div style="display: flex; align-items: center">
          <AddUser @update-list="updateListAfterCreate" />
        </div>
      </div>
      <div style="display: flex; flex-direction: row; align-items: center">
        <span style="margin-right: 10px">{{ t('routes.scenario.category') }}:</span>
        <a-select
          v-if="listNameExam"
          v-model:value="exam"
          style="width: 300px"
          class="border border-primary rounded-2"
          :options="listNameExam.map((t) => ({ value: t.name }))"
          @change="newListQuestion"
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
        @change="handleChange"
      >
        <template #headerCell="{ column }">
          <template v-if="column.dataIndex === 'index'">
            <span>{{ $t('routes.exam.table.id') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'name'">
            <span>{{ $t('routes.exam.table.name') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'createdAt'">
            <span>{{ $t('routes.exam.table.createdAt') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'content'">
            <span>{{ $t('routes.exam.table.content') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <span>{{ $t('routes.exam.table.status') }}</span>
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
          <template v-if="column.dataIndex === 'status'">
            <span>
              <Tag :color="record.status !== 0 ? 'red' : 'green'">
                {{ record.status == '0' ? 'ACTICE' : 'INACTIVE' }}
              </Tag>
            </span>
          </template>
          <template v-if="column.dataIndex === 'createdAt'">
            {{ formatToDate(record.createdAt) }}
          </template>
          <template v-else-if="column.dataIndex === 'level'">
            <span>
              <Tag color="green">
                {{
                  record.status == '0'
                    ? 'EASY'
                    : record.status == 1
                      ? 'MEDIUM'
                      : record.status == 2
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
  import { onMounted, ref } from 'vue';
  import { AppstoreTwoTone, SearchOutlined } from '@ant-design/icons-vue';
  import { Card, Tag, Menu, Dropdown, notification } from 'ant-design-vue';
  import AddUser from './crud/add.vue';
  import type { TableProps } from 'ant-design-vue';
  import { useI18n } from '@/hooks';
  import to from '@/utils/awaitTo';
  import {  getExamNameList } from '@/api/backend/api/exam';
  import { formatToDate } from '@/utils/dateUtil';
  const exam=ref();
  const listQuestion = ref();
  const listNameExam = ref();
  const showTable = ref(true);
  const { t } = useI18n();
  type PageSetting = {
    pageSize: number;
    page: number;
    total?: number;
  };
  const pageSetting = ref<PageSetting>({
    pageSize: 10,
    page: 1,
    total: 0,
  });
  const newListQuestion=()=>{

  }
  // hàm lây data
  const getData = async () => {
    console.log(12);
    
    // lấy danh sách tên tất cả bộ đê thi
    const [err, res] = await to(getExamNameList());
    if (err) {
      notification.error({
        message: t('common.error'),
        description: err.message,
      });
    }
    listNameExam.value = res.exams;
    // if (err) {
    //   notification.error({
    //     message: t('common.error'),
    //     description: err.message,
    //   });
    //   return;
    // }
    // pageSetting.value.total = res.total;
    // listQuestion.value = res.exams;
    // listQuestion.value.forEach(
    //   (e, index) =>
    //     (e.index = pageSetting.value.pageSize * (pageSetting.value.page - 1) + index + 1),
    // );
  };
  onMounted(async () => {
    await getData();
  });
  // hàm thay đổi khi sort
  const handleChange: TableProps['onChange'] = async (_pagination, _filters, _sorter) => {
    pageSetting.value.page = _pagination.current as number;
    pageSetting.value.pageSize = _pagination.pageSize as number;
    await getData();
  };

  const updateListAfterCreate = (data) => {
    listQuestion.value.push({
      id: data.id,
      name: data.name,
      content: data.content,
      level: data.level,
      status: data.status,
      createdAt: data.createdAt,
    });
  };
  const columns: TableProps['columns'] = [
    {
      dataIndex: 'index',
      align: 'center',
      width: 30,
    },
    {
      dataIndex: 'name',
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
      dataIndex: 'content',
      align: 'left',
      width: 250,
    },
    {
      dataIndex: 'level',
      align: 'left',
      width: 100,
    },
    {
      dataIndex: 'status',
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
