import { createApp } from 'vue';
import App from './App.vue';

export const app = createApp(App);

// 全局样式表
import '@/assets/style/index.less';

// Pinia
import { createPinia } from 'pinia';
app.use(createPinia());

// router
import router from '@/router';
app.use(router);

// UnoCSS
import 'virtual:uno.css';

app.mount('#app');
