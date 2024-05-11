<template>
    <div class="login-box">
      <div class="content">
        <div class="locale">
          <LocalePicker />
        </div>
        <div class="login-logo">
          <h1 class="mb-0 ml-2 text-3xl font-bold"> Study Quiz Center</h1>
          <img src="~@/assets/images/logo0.png" width="80" />
        </div>
        <a-form layout="horizontal" :model="state.formInline" @submit.prevent="handleSubmit">
          <a-form-item>
            <a-input v-model:value="state.formInline.email" size="large" placeholder="rootadmin">
              <template #prefix><user-outlined type="user" /></template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input v-model:value="state.formInline.username" size="large" placeholder="rootadmin">
              <template #prefix><user-outlined type="user" /></template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              v-model:value="state.formInline.password"
              size="large"
              type="password"
              placeholder="string"
              autocomplete="new-password"
            >
              <template #prefix><lock-outlined type="user" /></template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              v-model:value="state.formInline.confirmPassword"
              size="large"
              type="password"
              autocomplete="new-password"
            >
              <template #prefix><lock-outlined type="user" /></template>
            </a-input>
          </a-form-item>
  
          <a-form-item>
            <a-button type="primary" html-type="submit" size="large" :loading="state.loading" block>
              {{ $t('routes.login.registry') }}
            </a-button>
          </a-form-item>
          <div class="flex flex-row align-center" style="justify-content: center">
            <div class="mt-1">
              {{ $t('routes.login.text_login') }}
            </div>
            <a-button type="link" @click="router.replace('/login')">
              {{ $t('routes.login.login') }}
            </a-button>
          </div>
        </a-form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
    import { reactive } from 'vue';
    import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
    import { useRoute, useRouter } from 'vue-router';
    import { message, Modal } from 'ant-design-vue';
    import { LocalePicker } from '@/components/basic/locale-picker';
    import { to } from '@/utils/awaitTo';
    import { authRegister } from '@/api/backend/api/auth';
    const state = reactive({
      loading: false,
      captcha: '',
      formInline: {
        email : '',
        username: '',
        password: '',
        confirmPassword: '',
      },
    });
    const route = useRoute();
    const router = useRouter();
  
  
    const handleSubmit = async () => {
      const { username, password, confirmPassword } = state.formInline;
      if (username.trim() == '' || password.trim() == ''||confirmPassword.trim() == '') {
        return message.warning('Cannot be empty!');
      }
      if (state.formInline.password !== state.formInline.confirmPassword) {
        return message.warning('Password confirmation error!');
      }
      state.loading = true;
  
      const [_err,res] = await to(authRegister(state.formInline));
  
      if (!res.ok) {
        Modal.error({
          title: () => 'Error',
          content: () => res.error.message,
        });
      } else {
        setTimeout(() => router.replace((route.query.redirect as string) ?? '/'));
      }
      state.loading = false;
      message.destroy();
    };
  </script>
  
  <style lang="less" scoped>
    .login-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100vw;
      height: 100vh;
      padding-top: 240px;
      background: url('@/assets/login.svg');
      background-size: 100%;
  
      .content {
        border-radius: 10px;
        border: 1px solid #b8b7b7;
        width: fit-content;
        height: fit-content;
        padding: 20px 30px 20px 30px;
        /* stylelint-disable-next-line rule-empty-line-before */
        .locale {
          display: flex;
          justify-content: flex-end;
        }
      }
      .login-logo {
        display: flex;
        margin-bottom: 10px;
        align-items: center;
  
        .svg-icon {
          font-size: 48px;
        }
      }
  
      :deep(.ant-form) {
        width: 400px;
  
        .ant-col {
          width: 100%;
        }
  
        .ant-form-item-label {
          padding-right: 6px;
        }
      }
    }
  </style>
  