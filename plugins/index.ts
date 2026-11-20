import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { UnoCSSPluginConfig } from './unocss/index.ts';
import { AutoImportPluginConfig } from './auto-import/index.ts';
import { VueComponentPluginConfig } from './vue-component/index.ts';

/**
 * 注入 vite 的插件
 * 目前包括：
 *  Vue
 *  VueJsx
 *  UnoCSS
 *  unplugin-auto-import
 *  unplugin-vue-components
 */
export const createVitePlugins = () => {
  const vitePluginList: (PluginOption | PluginOption[])[] = [
    vue(),
    vueJsx(),
    UnoCSSPluginConfig,
    AutoImportPluginConfig,
    VueComponentPluginConfig,
    // BasicSslPluginConfig,
  ];
  return vitePluginList;
};
