<template>
  <div>
    <DynamicTable
      row-key="id"
      header-title="字典管理"
      :data-request="Api.systemDictType.dictTypeList"
      :columns="columns"
      bordered
      size="small"
      @expand="handleExpand"
    >
      <template #toolbar>
        <a-button
          type="primary"
          :disabled="!$auth('system:dict-type:create')"
          @click="openMenuModal({})"
        >
          新增
        </a-button>
      </template>
      <template #expandedRowRender="{ record }">
        <a-table
          size="small"
          :columns="dictItemColumns"
          :loading="expandedRowLoding[record.id]"
          :data-source="expandedRowData[record.id]"
          :pagination="false"
        ></a-table>
      </template>
    </DynamicTable>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { baseColumns as dictItemColumns } from '../dict-item/columns';
  import {
    baseColumns,
    searchFormSchema,
    type TableListItem,
    type TableColumnItem,
  } from './columns';
  import { baseSchemas } from './formSchemas';
  import { useTable } from '@/components/core/dynamic-table';
  import { useFormModal } from '@/hooks/useModal/';
  import Api from '@/api/';

  defineOptions({
    name: 'SystemDict',
  });

  const expandedRowData = ref<Recordable<any[]>>({});
  const expandedRowLoding = ref<Recordable<boolean>>({});

  const [DynamicTable, dynamicTableInstance] = useTable({
    formProps: {
      schemas: searchFormSchema,
    },
  });

  const [showModal] = useFormModal();

  /**
   * @description 打开新增/编辑弹窗
   */
  const openMenuModal = async (record: Partial<TableListItem>) => {
    const [formRef] = await showModal({
      modalProps: {
        title: `${record.id ? '编辑' : '新增'}字典`,
        width: '50%',
        onFinish: async (values) => {
          console.log('新增/编辑字典', values);
          if (record.id) {
            await Api.systemDictType.dictTypeUpdate({ id: record.id }, values);
          } else {
            await Api.systemDictType.dictTypeCreate(values);
          }

          dynamicTableInstance?.reload();
        },
      },
      formProps: {
        labelWidth: 120,
        schemas: baseSchemas,
      },
    });
    formRef?.setFieldsValue({
      ...record,
    });
  };
  const delRowConfirm = async (record: TableListItem) => {
    await Api.systemDictType.dictTypeDelete({ id: record.id });
    dynamicTableInstance?.reload();
  };

  const columns: TableColumnItem[] = [
    ...baseColumns,
    {
      title: '操作',
      width: 130,
      dataIndex: 'ACTION',
      hideInSearch: true,
      fixed: 'right',
      actions: ({ record }) => [
        {
          label: '编辑',
          auth: {
            perm: 'system:dict-type:update',
            effect: 'disable',
          },
          onClick: () => openMenuModal(record),
        },
        {
          label: '删除',
          auth: 'system:dict-type:delete',
          popConfirm: {
            title: '你确定要删除吗？',
            placement: 'left',
            onConfirm: () => delRowConfirm(record),
          },
        },
      ],
    },
  ];

  const handleExpand = async (expanded, record) => {
    const typeId = record.id;
    if (expanded) {
      expandedRowLoding.value[typeId] = true;
      const { items = [] } = await Api.systemDictItem
        .dictItemList({ typeId })
        .finally(() => (expandedRowLoding.value[typeId] = false));
      expandedRowData.value[typeId] = items;
    }
  };
</script>
