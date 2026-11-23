import type { ImportsMap } from 'unplugin-auto-import/types';

/**
 * 自定义自动导入
 * ```
 * '[package-name]': [
 *     '[import-names]',
 *     // alias
 *     ['[from]', '[alias]'],
 * ]
 * ```
 */
export const customImports: ImportsMap = {
  'axios': [
    ['default', 'axios'],
  ],
  'lodash-es': [
    'isArray',
  ],
  'mitt': [
    ['default', 'mitt'],
  ],
  'ant-design-vue': [
    'App',
    'legacyLogicalPropertiesTransformer',
    'theme',
    'message',
    'notification',
  ],
};
