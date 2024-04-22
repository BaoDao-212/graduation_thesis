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
        <span v-if="listUser"> {{ t('routes.list_email.total') }}: {{ totalRes }} </span>
        <div style="display: flex; align-items: center">
          <AddUser @update-list="updateListAfterCreate" />
        </div>
      </div>
      <a-table
        v-if="showTable"
        v-model:data-source="listUser"
        :columns="columns"
        :pagination="{
          showSizeChanger: true,
          showLessItems: true,
          pageSizeOptions: ['10', '20', '50', '100', '150', '200', '300'],
          showTotal: (total) => {
            totalRes = total;
            return ``;
          },
        }"
        :scroll="{ x: 1180 }"
        bordered
        @change="handleChange"
      >
        <template #headerCell="{ column }">
          <template v-if="column.dataIndex === 'index'">
            <span>{{ $t('routes.management.table.number') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'name'">
            <span>{{ $t('routes.management.table.name') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'email'">
            <span>{{ $t('routes.management.table.email') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'mobile'">
            <span>{{ $t('routes.management.table.mobile') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'domain'">
            <span>{{ $t('routes.management.table.domain') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'address'">
            <span style="width: 480px">{{ $t('routes.management.table.address') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'country'">
            <span>{{ $t('routes.management.table.country') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'type'">
            <span>{{ $t('routes.management.table.roles') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <span>{{ $t('routes.management.table.status') }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <span>{{ $t('routes.management.table.action') }}</span>
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
          <template v-if="column.dataIndex === 'type'">
            <span>
              <Tag
                :color="
                  record.type === 'ADMIN'
                    ? 'volcano'
                    : record.type === 'TEACHER'
                    ? 'geekblue'
                    : 'green'
                "
              >
                {{ record.type }}
              </Tag>
            </span>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <span>
              <Tag :color="record.status !== 'ACTIVE' ? 'red' : 'green'">
                {{ record.status == 'ACTIVE' ? record.status : 'TERMINATED' }}
              </Tag>
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <Dropdown placement="bottomRight">
              <AppstoreTwoTone />
              <template #overlay>
                <Menu>
                  <Menu.Item>
                  </Menu.Item>
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
  import { Card, Tag, Menu, Dropdown} from 'ant-design-vue';
  import AddUser from './crud/add.vue';
  import type { TableProps } from 'ant-design-vue';
  import { useI18n } from '@/hooks';
  const listUser = ref();
  const showTable = ref(true);
  const { t } = useI18n();
  onMounted(async () => {
  });
  const totalRes = ref();
  // hàm thay đổi khi sort
  const handleChange: TableProps['onChange'] = (
    _pagination,
    _filters,
    _sorter,
    { currentDataSource },
  ) => {
    currentDataSource.forEach((e, index) => (e.index = index + 1));
    totalRes.value = currentDataSource.length;
  };

  const updateListAfterCreate = (data) => {
    listUser.value.push({
      id: data.id,
      name: data.name,
      email: data.email,
      country: data.country,
      address: data.address,
      mobile: data.mobile,
      domain: data.domain,
      status: data.status,
      type: data.type,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      data: null,
    });
  };
  // const updateListAfterUpdate = async (data) => {
  //   listUser.value.forEach((user) => {
  //     if (user.id == data.id) {
  //       user.name = data.name;
  //       user.email = data.email;
  //       user.mobile = data.mobile;
  //       user.address = data.address;
  //       user.country = data.country;
  //       user.domain = data.domain;
  //       user.status = data.status;
  //       user.type = data.type;
  //     }
  //   });
  //   update();
  // };

  const columns: TableProps['columns'] = [
    {
      title: t('routes.management.table.number'),
      dataIndex: 'index',
      align: 'center',
      width: 30,
    },
    {
      title: t('routes.management.table.name'),
      dataIndex: 'name',
      align: 'left',
      customFilterDropdown: true,
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
      },
      width: 200,
      minWidth: 180,
    },
    {
      title: t('routes.management.table.email'),
      dataIndex: 'email',
      align: 'left',
      customFilterDropdown: true,
      sorter: {
        compare: (a, b) => a.email.localeCompare(b.email),
      },
      width: 250,
    },
    {
      title: t('routes.management.table.domain'),
      dataIndex: 'domain',
      align: 'left',
      width: 150,
      minWidth: 150,
      customFilterDropdown: true,
      sorter: {
        compare: (a, b) => a.domain.localeCompare(b.domain),
      },
    },
    {
      title: t('routes.management.table.address'),
      dataIndex: 'address',
      align: 'left',
      width: 150,
      minWidth: 100,
    },
    {
      title: t('routes.management.table.country'),
      dataIndex: 'country',
      align: 'left',
      width: 100,
    },
    {
      title: t('routes.management.table.mobile'),
      dataIndex: 'mobile',
      align: 'right',
      sorter: {
        compare: (a, b) => a.mobile - b.mobile,
      },
      width: 100,
    },
    {
      title: t('routes.management.table.roles'),
      dataIndex: 'type',
      align: 'left',
      customFilterDropdown: true,
      sorter: {
        compare: (a, b) => a.type.localeCompare(b.type),
      },
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'left',
      customFilterDropdown: true,
      width: 100,
    },
    {
      title: t('routes.management.table.action'),
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
