import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { UnoCSSPluginConfig } from './unocss';
import { AutoImportPluginConfig } from './auto-import';
import { VueComponentPluginConfig } from './vue-component';

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
  ];
  return vitePluginList;
};
