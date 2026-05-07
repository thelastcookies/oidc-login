<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form';
import type { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import type { ApiResponse, InteractionRedirect, RegisterForm, RegisterRequest } from '@/api/types.d.ts';

const route = useRoute();

const loading = ref(false);
const errorMsg = ref('');

const formData = ref<RegisterForm>({
  username: '',
  password: '',
  passwordConfirm: '',
});

// 从 URL 查询参数中获取 uid（OIDC 交互会话 ID）
const uid = computed(() => route.query.uid as string || '');

const validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('密码不可为空');
  } else {
    if (formData.value.passwordConfirm !== '') {
      formRef.value!.validateFields('passwordConfirm');
    }
    return Promise.resolve();
  }
};

const validatePass2 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请再次输入密码');
  } else if (value !== formData.value.password) {
    return Promise.reject('两次输入的密码必须相同');
  } else {
    return Promise.resolve();
  }
};

const rules: Record<string, Rule[]> = {
  username: [{ required: true, message: '用户名不可为空' }],
  password: [{ required: true, validator: validatePass }],
  passwordConfirm: [{ required: true, validator: validatePass2 }],
};

const formRef = ref<HTMLFormElement>();

const handleSubmit = async () => {
  if (!uid.value) {
    errorMsg.value = '缺少交互会话标识，请从业务系统重新发起登录';
    return;
  }
  loading.value = true;
  errorMsg.value = '';
  try {
    await formRef.value?.validate();
    const params: RegisterRequest = {
      username: formData.value.username,
      password: formData.value.password,
    };
    const res: ApiResponse<InteractionRedirect> = await register(uid.value, params);
    if (res.success && res.data?.redirect) {
      // 注册成功自动登录，跳转到后端返回的重定向地址
      window.location.href = res.data.redirect;
    } else {
      errorMsg.value = 'msg' in res ? res.msg : '注册失败';
    }
  } catch (e) {
    if ((e as ValidateErrorEntity)?.errorFields) {
      errorMsg.value = (e as ValidateErrorEntity)?.errorFields[0].errors[0];
    } else {
      errorMsg.value = '网络错误，请重试';
    }
  }
  loading.value = false;
};

const handleBack = () => {
  router.push({ path: '/', query: route.query });
};
</script>

<template>
  <div class="form-container w-400px m-center">
    <div class="text-10 lh-12 font-700 tracking-wide lt-md:hidden">注册</div>
    <a-form mt-8
      name="register"
      layout="vertical"
      ref="formRef"
      :model="formData"
      :rules="rules"
      :disabled="loading"
      @finish="handleSubmit"
    >
      <a-form-item name="username" label="用户名">
        <a-input
          id="username"
          class="login-input transparent z-1"
          v-model:value="formData.username"
        />
      </a-form-item>
      <a-form-item name="password" label="密码">
        <a-input-password
          id="password"
          class="login-input transparent z-1"
          v-model:value="formData.password"
        />
      </a-form-item>
      <a-form-item name="passwordConfirm" label="确认密码">
        <a-input-password
          id="passwordConfirm"
          class="login-input transparent z-1"
          v-model:value="formData.passwordConfirm"
        />
      </a-form-item>
      <a-form-item v-if="errorMsg" class="mb-2">
        <a-alert :message="errorMsg" type="error" show-icon />
      </a-form-item>
      <a-form-item class="mt-8 mb-0">
        <a-button login-btn type="primary" html-type="submit">注册</a-button>
      </a-form-item>
      <a-divider>或</a-divider>
      <a-form-item class="m-0">
        <a-button login-btn @click="handleBack">返回登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="less">
:deep(.ant-form-item-label > label) {
  font-size: 18px;
}
</style>
