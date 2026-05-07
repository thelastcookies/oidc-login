import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    name: 'Login',
    component: () => import('@/views/Index.vue'),
    children: [{
      path: '/',
      name: 'LoginForm',
      component: () => import('@/views/login/Index.vue'),
    }, {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/register/Index.vue'),
    }],
  }],
});

export default router;
