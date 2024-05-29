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
        <span v-if="listResults"> {{ t('routes.exam.total') }}: {{ listResults.length }} </span>
      </div>
      <a-table
        v-model:data-source="listResults"
        :columns="columns"
        :pagination="{
          showSizeChanger: true,
          showLessItems: true,
          pageSizeOptions: ['10', '20', '50', '100', '150', '200', '300'],
        }"
        :scroll="{ x: 1180 }"
        bordered
      >
        <template #headerCell="{ column }">
          <template v-if="column.dataIndex === 'index'">
            <span>{{ $t('routes.exam.table.id') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'name'">
            <span>{{ $t('routes.exam.exam') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'createdAt'">
            <span>{{ $t('routes.exam.table.createdAt') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'score'">
            <span>{{ $t('routes.post.score') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <span>{{ $t('routes.exam.table.status') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'time'">
            <span>{{ $t('routes.post.time') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <span>{{ $t('routes.exam.table.action') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'time'">
            <span>{{ $t('routes.exam.table.time') }}</span>
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
              <Tag :color="record.score == -1 ? 'red' : 'green'">
                {{ record.score == -1 ? 'DOING' : 'DONE' }}
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
            <a-button type="primary" @click="handleDetail(record)">
              {{ $t('routes.post.details') }}
            </a-button>
          </template>
        </template>
      </a-table>
    </Card>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import { Card, notification, Tag } from 'ant-design-vue';
  import type { TableProps } from 'ant-design-vue';
  import { useI18n } from '@/hooks';
  import to from '@/utils/awaitTo';
  import { formatToDate } from '@/utils/dateUtil';
  import { listResult } from '@/api/backend/api/post';
  import { useRouter } from 'vue-router';
  const listResults = ref();
  const { t } = useI18n();
  // hàm lây data
  const getData = async () => {
    const [err, res] = await to(listResult());
    if (err) {
      notification.error({
        message: t('common.error'),
        description: err.message,
      });
      return;
    }
    listResults.value = res.results;
    listResults.value.forEach((e, index) => {
      e.index = index + 1;
      e.name = e.exam.name;
    });
  };
  onMounted(async () => {
    await getData();
  });
  const router = useRouter();
  const handleDetail = (record) => {
    console.log(record);
    if (record.score == -1) {
      router.push(`/exam/room/${record.id}`);
    } else {
      router.push(`/exam/result/view/${record.id}`);
    }
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
      dataIndex: 'score',
      align: 'left',
      width: 100,
    },
    {
      dataIndex: 'time',
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
      align: 'left',
      width: 100,
    },
  ];
</script>

<style lang="less" scoped>
  .highlight {
    background-color: rgb(255, 192, 105);
    padding: 0px;
  }
</style>
