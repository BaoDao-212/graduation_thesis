<template>
  <div @click="showModal"> <UserOutlined /> {{ $t('routes.account.personal_profile') }}</div>
  <a-modal
    v-model:visible="visible"
    :title="$t('routes.account.personal_profile')"
    :ok-text="$t('routes.account.profile.button_update_profile')"
    :cancel-text="$t('common.cancelText')"
    width="1000px"
    @ok="handleSubmit"
  >
    <a-form :model="formState" layout="vertical" autocomplete="off">
      <a-row :gutter="[8, 8]">
        <a-col :span="12">
          <a-form-item
            :label="$t('routes.account.profile.name')"
            name="name"
            :rules="[
              {
                required: true,
                validator: validateName,
                trigger: 'change',
              },
            ]"
          >
            <a-input
              v-model:value="formState.name"
              class="border border-primary rounded-2"
              :placeholder="$t('routes.account.profile.rules_name')"
            >
              <template #prefix>
                <UserSwitchOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('routes.account.profile.username')" name="introduce">
            <a-input v-model:value="user.username" class="border border-primary rounded-2" disabled>
              <template #prefix>
                <UserOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="[8, 8]">
        <a-col :span="12">
          <a-form-item :label="$t('routes.account.profile.address')" name="address">
            <a-input
              v-model:value="formState.address"
              class="border border-primary rounded-2"
              :placeholder="$t('routes.account.profile.rules_address')"
            >
              <template #prefix>
                <HomeOutlined class="site-form-item-icon" />
              </template>
            </a-input> </a-form-item
        ></a-col>
        <a-col :span="12">
          <a-form-item :label="$t('routes.account.profile.introduce')" name="introduce">
            <a-input
              v-model:value="formState.introduce"
              class="border border-primary rounded-2"
              :placeholder="$t('routes.account.profile.rules_introduce')"
            >
              <template #prefix>
                <GlobalOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="[8, 8]">
        <a-col :span="12">
          <a-form-item :label="$t('routes.account.profile.email')" name="address">
            <a-input v-model:value="user.email" class="border border-primary rounded-2" disabled>
              <template #prefix> <MailOutlined class="site-form-item-icon" /> </template>
            </a-input> </a-form-item
        ></a-col>
        <a-col :span="12">
          <a-form-item :label="$t('routes.account.profile.mobile')" name="phone">
            <a-input
              v-model:value="formState.phone"
              class="border border-primary rounded-2"
              :placeholder="$t('routes.account.profile.rules_mobile')"
            >
              <template #prefix>
                <PhoneOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <template #footer>
      <div class="flex justify-end mr-2 mb-3">
        <Button @click="visible = false">
          {{ $t('common.cancelText') }}
        </Button>
        <Button type="primary" html-type="submit" class="" @click="handleSubmit">
          {{ t('routes.account.profile.button_update_profile') }}
        </Button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
  import { onBeforeMount, reactive, ref } from 'vue';
  import {
    UserOutlined,
    PhoneOutlined,
    GlobalOutlined,
    HomeOutlined,
    UserSwitchOutlined,
    MailOutlined,
  } from '@ant-design/icons-vue';
  import { notification, Button } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/lib/form';
  import { useI18n } from '@/hooks';
  import { accountProfile, accountUpdate } from '@/api/backend/api/account';
  import Storage from '@/utils/Storage';

  // update profile
  const visible = ref<boolean>(false);
  const showModal = () => {
    visible.value = !visible.value;
    formState.name = user.value.name;
    formState.phone = user.value.phone;
    formState.introduce = user.value.introduce;
    formState.address = user.value.address;
  };
  interface FormState {
    name: string;
    address: string;
    introduce: string;
    phone: string;
  }
  interface UserInfo {
    id: number;
    name: string;
    email: string;
    address: string;
    introduce: string;
    phone: string;
    username: string;
    createdAt: Date;
    data: string;
  }
  const user = ref<UserInfo>({
    id: 0,
    name: '',
    email: '',
    address: '',
    introduce: '',
    phone: '',
    username: '',
    data: '',
    createdAt: new Date(),
  });
  const formState = reactive<FormState>({
    name: user.value.name,
    phone: user.value.phone,
    introduce: user.value.introduce,
    address: user.value.address,
  });
  onBeforeMount(async () => {
    const res = await accountProfile();
    if (!res.ok) {
      notification.error({
        message: res.error.message,
      });
    } else {
      user.value = res.user;
      Storage.set('PROFILE', res.user);
    }
  });
  const { t } = useI18n();
  const handleSubmit = async () => {
    const res = await accountUpdate(formState);
    if (!res.ok) {
      return notification.error({
        message: res.error.message,
      });
    } else
      notification.success({
        message: t('common.success'),
        description: t('routes.account.profile.success_update'),
      });
    setTimeout(() => {
      visible.value = false;
    }, 2000);
  };
  // validate name
  const validateName = async (_rule: Rule) => {
    if (formState.name.trim() == '') {
      return Promise.reject(t('routes.category.modalCreateCategory.nameValidate'));
    }
    return Promise.resolve();
  };
</script>

<style lang="less" scoped></style>
