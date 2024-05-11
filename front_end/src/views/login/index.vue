<template>
  <div class="login-box">
    <div class="content">
      <div class="locale">
        <LocalePicker />
      </div>
      <div class="login-logo">
        <!-- <svg-icon name="logo" :size="45" /> -->
        <h1 class="mb-0 ml-2 text-3xl font-bold"> Study Quiz Center</h1>
        <img src="~@/assets/images/logo0.png" width="80" />
      </div>
      <a-form layout="horizontal" :model="state.formInline" @submit.prevent="handleSubmit">
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
            placeholder="123456"
            autocomplete="new-password"
          >
            <template #prefix><lock-outlined type="user" /></template>
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" size="large" :loading="state.loading" block>
            {{ $t('routes.login.login') }}
          </a-button>
        </a-form-item>
        <a-form-item>
          <div class="flex flex-row align-center" style="justify-content: center">
            <div class="mt-1">
              {{ $t('routes.login.text_registry') }}
            </div>
            <a-button type="link" @click="router.push('/registry')">
              {{ $t('routes.login.registry') }}
            </a-button>
          </div>
          <div class="flex flex-row align-center mt-2" style="justify-content: center">
            <GoogleLogin :callback="callback" prompt auto-login />
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { message, Modal, notification } from 'ant-design-vue';
  import { useUserStore } from '@/store/modules/user';
  import { LocalePicker } from '@/components/basic/locale-picker';
  import { to } from '@/utils/awaitTo';
  import { GoogleLogin } from 'vue3-google-login';
  import { authLoginGoogle } from '@/api/backend/api/auth';
  // import { useI18n } from 'vue-i18n';
  const state = reactive({
    loading: false,
    captcha: '',
    formInline: {
      username: 'string',
      password: 'string',
    },
  });
  const route = useRoute();
  const router = useRouter();
  // const { t } = useI18n();
  const userStore = useUserStore();
  // login google
  const callback = async (response) => {
    console.log('Handle the response', response);
    console.log(response.credential);
    const res = await authLoginGoogle({ accessToken: response.credential });
    if (!res.ok) {
      notification.error({
        message: 'Error',
        description: res.error.message,
      });
    } else {
      userStore.setToken(res.accessToken);
      notification.success({
        message: "Success",
        description: 'Login Success',
      });
      setTimeout(() => router.replace((route.query.redirect as string) ?? '/'));
    }
  };
  const handleSubmit = async () => {
    const { username, password } = state.formInline;
    if (username.trim() == '' || password.trim() == '') {
      return message.warning('用户名或密码不能为空！');
    }
    message.loading('登录中...', 0);
    state.loading = true;
    console.log(state.formInline);

    const [err] = await to(userStore.login(state.formInline));
    console.log(err);

    if (err) {
      Modal.error({
        title: () => '提示',
        content: () => err.message,
      });
    } else {
      message.success('登录成功！');
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
