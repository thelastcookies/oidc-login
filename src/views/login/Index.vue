<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form';
import type { ApiResponse, InteractionRedirect, LoginRequest } from '@/api/types.d.ts';
import { confirm as confirmAuth } from '@/api/index';

const route = useRoute();

const loading = ref(false);
const errorMsg = ref('');

const formData = reactive<LoginRequest>({
  username: '',
  password: '',
});

const loginFormRules: Record<string, Rule[]> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

const loginFormRef = ref(null) as Ref<Element | null>;
const usernameRef = ref(null) as Ref<Element | null>;

// 从 URL 查询参数中获取 uid 和 prompt 类型
const uid = computed(() => route.query.uid as string || '');
const prompt = computed(() => route.query.prompt as string || '');

// 确认授权
onMounted(() => {
  if (prompt.value === 'consent' && uid.value) {
    confirmAuth(uid.value).then((res: ApiResponse<InteractionRedirect>) => {
      if (res.success && res.data?.redirect) {
        window.location.href = res.data.redirect;
      }
    });
  }
});

const handleSubmitLogin = async (formData: LoginRequest) => {
  if (!uid.value) {
    errorMsg.value = '缺少交互会话标识，请从业务系统重新发起登录';
    return;
  }
  loading.value = true;
  message.loading({
    content: '正在登录中，请稍候',
    key: SYS_LOADING_KEY,
    duration: 0,
  });
  login(uid.value, formData).then((res: ApiResponse<InteractionRedirect>) => {
    if (res.success && res.data?.redirect) {
      // 登录成功，跳转到后端返回的重定向地址
      window.location.href = res.data.redirect;
    } else {
      message.error({
        content: 'msg' in res ? res.msg : '登录失败',
        key: SYS_LOADING_KEY,
      });
      loading.value = false;
    }
  }).catch(() => {
    message.error({
      content: '登录失败',
      key: SYS_LOADING_KEY,
    });
    loading.value = false;
  });
};

// 用于保存 input label 的状态颜色值
let uActiveColor = 'primary' as 'primary' | 'warning';
let pActiveColor = 'primary' as 'primary' | 'warning';

// 用于决定 label 的呈现颜色
const userNameColorClass = ref<'' | 'primary' | 'warning'>('');
const passwordColorClass = ref<'' | 'primary' | 'warning'>('');

// 用于标记 input active 状态
const userNameIsActive = ref(Boolean(formData.username));
const passwordIsActive = ref(Boolean(formData.password));

/**
 * 表单校验时，根据校验结果改变各字段高亮色
 * @param name
 * @param status
 */
const handleValidate = (name: string | number | string[] | number[], status: boolean) => {
  if (name === 'username') {
    uActiveColor = status ? 'primary' : 'warning';
  } else if (name === 'password') {
    pActiveColor = status ? 'primary' : 'warning';
  }
};

/**
 * mouseenter 与 mouseleave 旨在为 label 同步 Antdv 的输入框 hover 效果
 */

/**
 * mouseenter 时改变 label 的颜色为高亮色
 * 如果输入框内无内容，则 label 不响应颜色变化
 * @param e
 */
const handleInputMEnter = (e: Event) => {
  if (loading.value) return;
  const domId = (e.target as Element).id;
  if (domId === 'username' && formData.username !== '') {
    userNameColorClass.value = uActiveColor;
  } else if (domId === 'password-cont' && formData.password !== '') {
    passwordColorClass.value = pActiveColor;
  }
};

/**
 * mouseleave 时重置 label 的颜色
 * 如果输入框处于 focus 状态，则不重置 label 颜色
 * @param e
 */
const handleInputMLeave = (e: Event) => {
  const domId = (e.target as Element).id;
  if (document.activeElement!.id === domId
    || (document.activeElement!.id === 'password' && domId === 'password-cont')) return;
  if (domId === 'username') {
    userNameColorClass.value = '';
  } else if (domId === 'password-cont') {
    passwordColorClass.value = '';
  }
};

/**
 * focus 时 label 从 placeholder 变为悬浮样式
 * @param e
 */
const handleInputFocus = (e: Event) => {
  const domId = (e.target as Element).id;
  if (domId === 'username') {
    userNameColorClass.value = uActiveColor;
    userNameIsActive.value = true;
  } else if (domId === 'password') {
    passwordColorClass.value = pActiveColor;
    passwordIsActive.value = true;
  }
};

/**
 * blur 时 label 从悬浮样式变为 placeholder
 * 如果输入框内有内容，则 label 保持悬浮样式不变
 * @param e
 */
const handleInputBlur = (e: Event) => {
  const domId = (e.target as Element).id;
  if (domId === 'username') {
    userNameColorClass.value = '';
    if (formData.username === '') {
      userNameIsActive.value = false;
    }
  } else if (domId === 'password') {
    passwordColorClass.value = '';
    if (formData.password === '') {
      passwordIsActive.value = false;
    }
  }
};

// 注册
const handleRegister = () => {
  router.push({ path: '/register', query: route.query });
};

</script>

<template>
  <div class="form-container w-400px m-center">
    <div class="text-10 lh-12 font-700 tracking-wide lt-md:hidden">登录</div>
    <div class="text-4.5 c-ant.text-tertiary mt-3">请登录以使用本系统</div>
    <a-form
      mt-8
      name="login"
      ref="loginFormRef"
      :model="formData"
      :rules="loginFormRules"
      :disabled="loading"
      @validate="handleValidate"
      @finish="handleSubmitLogin"
    >
      <a-form-item relative name="username">
        <a-input
          id="username"
          ref="usernameRef"
          class="login-input transparent z-1"
          autofocus
          autocomplete="username"
          v-model:value="formData.username"
          @mouseenter="handleInputMEnter"
          @mouseleave="handleInputMLeave"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
        />
        <div class="form-label bg-ant.bg-container absolute left-12.5px px-1"
          :class="[userNameColorClass, {'active': userNameIsActive}]">用户名
        </div>
      </a-form-item>
      <a-form-item
        name="password"
        id="password-cont"
        @mouseenter="handleInputMEnter"
        @mouseleave="handleInputMLeave">
        <a-input-password
          id="password"
          class="login-input transparent z-1"
          autocomplete="current-password"
          v-model:value="formData.password"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
        />
        <div class="form-label bg-ant.bg-container absolute left-12.5px px-1"
          :class="[passwordColorClass, {'active': passwordIsActive}]">密码
        </div>
      </a-form-item>
      <a-form-item v-if="errorMsg" class="mb-2">
        <a-alert :message="errorMsg" type="error" show-icon />
      </a-form-item>
      <a-form-item class="mt-8 mb-0">
        <a-button login-btn type="primary" html-type="submit">登录</a-button>
      </a-form-item>
      <a-divider>或</a-divider>
      <a-form-item class="m-0">
        <a-button login-btn @click="handleRegister">注册</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="less">
.form-container {
  .login-input {
    background-color: transparent;
  }

  :deep(.ant-input-password) {
    padding: 0 1rem 0;
    overflow: hidden;

    &:before {
      content: '';
      width: 16px;
      height: 100%;
      background-color: transparent;
      position: absolute;
      bottom: 0;
      left: 0;
      visibility: visible;
      transition: background-color 0.2s ease;
    }

    &:after {
      content: '';
      width: 16px;
      height: 100%;
      background-color: transparent;
      position: absolute;
      bottom: 0;
      right: 0;
      transition: background-color 0.2s ease;
    }

    .ant-input {
      padding: 1rem 0 1rem;
      background-color: transparent;
    }

    .ant-input-suffix {
      margin-left: 0;
      padding-left: 4px;
      transition: background-color 0.2s ease;
    }

    input:-webkit-autofill + span.ant-input-suffix {
      background-color: var(--colorWebkitAutofillBg);
    }
  }

  // :has 伪类比较激进，浏览器支持有限
  .ant-input-password:has(input:-webkit-autofill) {
    &:before {
      background-color: var(--colorWebkitAutofillBg);
    }

    &:after {
      background-color: var(--colorWebkitAutofillBg);
    }
  }

  .ant-input[disabled] {
    background-color: rgba(0, 0, 0, 0);
  }


  .ant-form-item {
    :deep(.ant-form-item-explain-error) {
      text-align: right;
    }
  }

  .form-label {
    transition-duration: var(--motionDurationMid);
    color: var(--colorTextQuaternary);
    top: 16.5px;
    font-size: 18px;
    z-index: 0;
  }

  .form-label.active {
    top: -10.5px;
    font-size: 14px;
    z-index: 1;
  }

  .form-label.primary {
    color: var(--colorPrimaryHover);
  }

  .form-label.warning {
    color: var(--colorErrorText);
  }

  .ant-checkbox-wrapper {
    :deep(.ant-checkbox-inner) {
      border: 2px solid var(--colorBgSpotlight);
    }
  }

  .ant-divider {
    border-top-color: var(--colorBorder);
  }
}
</style>
