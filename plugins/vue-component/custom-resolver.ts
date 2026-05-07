import type { ComponentResolver, ComponentResolveResult } from 'unplugin-vue-components/types';

export const customResolver: ComponentResolver = {
  type: 'component',
  resolve: (_name: string): ComponentResolveResult => {
    // 预留自定义组件解析器
    return undefined;
  },
};
