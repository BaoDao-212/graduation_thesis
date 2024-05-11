<template>
  <div @click="showModal"> <LockOutlined /> {{ $t('routes.account.change_password') }}</div>
  <a-modal
    v-model:visible="visible"
    :title="$t('routes.account.change_password')"
    :ok-text="$t('common.okText')"
    :cancel-text="$t('common.cancelText')"
    height="300px"
    @ok="handleSubmit"
  >
    <Form
      v-if="visible"
      layout="vertical"
      autocomplete="off"
      class="d-flex justify-content-center align-items-center"
      :model="state"
    >
      <Form.Item
        :label="$t('routes.account.changepassword.old_password')"
        name="oldPassword"
        autocomplete="off"
        :rules="[
          {
            required: true,
            validator: validateOldPass,
            trigger: 'change',
          },
        ]"
      >
        <a-input-password
          v-model:value="state.oldPassword"
          :placeholder="$t('routes.login.place_old_password')"
          size="large"
          type="password"
        />
      </Form.Item>
      <Form.Item
        :label="$t('routes.account.changepassword.new_password')"
        name="newPassword"
        :rules="[
          {
            required: true,
            validator: validateNewPass,
            trigger: 'change',
          },
        ]"
      >
        <a-input-password
          v-model:value="state.newPassword"
          :placeholder="$t('routes.login.place_new_password')"
          size="large"
          type="password"
        />
      </Form.Item>
      <Form.Item
        :label="$t('routes.account.changepassword.confirm_new_password')"
        name="confirmNewPassword"
        :rules="[
          {
            required: true,
            validator: validateConfirmNewPass,
            trigger: 'change',
          },
        ]"
      >
        <a-input-password
          v-model:value="state.confirmNewPassword"
          :placeholder="$t('routes.login.place_re_enter_password')"
          size="large"
          type="password"
        />
      </Form.Item>
      <span style="display: flex; justify-content: end; margin-top: 10px">
        <div
          style="
            color: #ff4d4f;
            display: inline-block;
            font-family: SimSun, sans-serif;
            font-size: 14px;
            line-height: 1;
            margin-right: 4px;
          "
          >*</div
        >
        {{ t('routes.account.changepassword.notes_password') }}</span
      >
    </Form>
    <template #footer>
      <div class="flex justify-end mr-2 mb-3">
        <Button @click="visible = false">
          {{ $t('common.cancelText') }}
        </Button>
        <Button
          v-if="
            state.confirmNewPassword.length >= 6 &&
            state.newPassword.length >= 6 &&
            state.oldPassword.length >= 6 &&
            state.confirmNewPassword == state.newPassword
          "
          type="primary"
          html-type="submit"
          @click="handleSubmit"
        >
          {{ $t('routes.account.change_password') }}
        </Button>
        <Button v-else type="primary" html-type="submit" disabled>
          {{ $t('routes.account.change_password') }}
        </Button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { LockOutlined } from '@ant-design/icons-vue';
  import { notification, Button, Form } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/lib/form';
  import { to } from '@/utils/awaitTo';
  import { useI18n } from '@/hooks';
  import { accountPassword } from '@/api/backend/api/account';

  const { t } = useI18n();
  const visible = ref<boolean>(false);
  const showModal = () => {
    state.confirmNewPassword = '';
    state.newPassword = '';
    state.oldPassword = '';
    visible.value = true;
  };
  const state = reactive({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const validateOldPass = async (_rule: Rule) => {
    if (state.oldPassword.trim() === '') {
      return;
    } else {
      if (state.oldPassword.length < 6) {
        return Promise.reject(t('routes.login.warn_password'));
      }
      return Promise.resolve();
    }
  };

  const validateNewPass = async (_rule: Rule) => {
    if (state.newPassword.trim() === '') {
      return;
    } else {
      if (state.newPassword.length < 6) {
        return Promise.reject(t('routes.login.warn_password'));
      }
      return Promise.resolve();
    }
  };

  const validateConfirmNewPass = async (_rule: Rule) => {
    if (state.confirmNewPassword.trim() === '') {
      return;
    } else {
      if (state.newPassword != state.confirmNewPassword) {
        return Promise.reject(t('routes.login.forgotPassword.guide_confirm_password'));
      }
      return Promise.resolve();
    }
  };

  const handleSubmit = async () => {
    const { confirmNewPassword, newPassword, oldPassword } = state;
    if (confirmNewPassword.trim() == '' || newPassword.trim() == '' || oldPassword.trim() == '') {
      return notification.warning({
        message: t('routes.error.warning'),
        description: t('routes.account.changepassword.warn_input'),
      });
    }
    if (confirmNewPassword.length < 6 || newPassword.length < 6) {
      return notification.warning({
        message: t('routes.error.warning'),
        description: t('routes.account.changepassword.notes_password'),
      });
    }
    if (confirmNewPassword != newPassword) {
      return notification.warning({
        message: t('routes.error.warning'),
        description: t('routes.account.changepassword.warn_new_password'),
      });
    }
    const [_err, res] = await to(accountPassword({ oldPassword, newPassword }));
    if (!res.ok) {
       notification.error({
        message: t('common.error'),
        description: res.error.message,
      });
    } else {
      notification.success({
        message: t('common.success'),
        description: t('routes.account.changepassword.success_change'),
      });
    }
    state.confirmNewPassword = '';
    state.newPassword = '';
    state.oldPassword = '';
    visible.value = false;
  };
</script>

<style lang="less" scoped>
  .ant-form-item-control-input {
    height: 0px !important;
    min-height: 0px !important;
  }

  .text_warn {
    display: flex;
    text-align: right;
  }
</style>
