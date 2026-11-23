import type { ComponentResolver, ComponentResolveResult } from 'unplugin-vue-components/types';

export const customResolver: ComponentResolver = {
  type: 'component',
  resolve: (name: string): ComponentResolveResult => {
    if (name == 'BaseIcon') {
      return { name, from: '@thelastcookies/base-icon' };
    }
  },
};
