import { createRouter, createWebHistory } from 'vue-router';
import { confirm } from '@/api';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    name: 'Login',
    component: () => import('@/views/Index.vue'),
    children: [{
      path: '/',
      alias: '/login',
      name: 'LoginForm',
      component: () => import('@/views/login/Index.vue'),
    }, {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/register/Index.vue'),
    }],
  }],
});

/**
 * 登录验证后的 consent 确认，重定向到业务系统
 */
router.beforeEach(async (to) => {
  if (to.query.prompt !== 'consent' || !to.query.uid) return true;
  try {
    const res = await confirm(to.query.uid as string);
    if (res.success && res.data?.redirect) {
      // 跳转到后端返回的重定向地址，并取消 SPA 导航
      window.location.href = res.data.redirect;
      return false;
    }
  } catch {
    // 确认失败时放行，进行登录
  }
});

export default router;
