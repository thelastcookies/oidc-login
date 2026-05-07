import type { Preset, Rule, UserShortcuts, Variant } from 'unocss';
import antdUnoTheme from './antd-uno-theme.json';

/**
 * 规则配置
 */

const rules: Rule<Object>[] = [];

/**
 * 快捷方式
 */
const shortcuts: UserShortcuts = [
  ['image-bg', 'bg-no-repeat bg-contain bg-center'],
  ['image-bg-cover', 'bg-no-repeat bg-cover bg-center'],
  ['m-center', 'ml-a mr-a mt-0 mb-0'],
  ['login-input', 'w-full p-16px lh-8 border-rd-10px font-size-18px border-width-1'],
  ['login-btn', 'h-54px w-full font-size-18px font-600 border-rd-10px'],
];

/**
 * 主题
 */
const theme: Object = {
  ...antdUnoTheme,
};

// 变体
/**
 * 变体配置
 */
const variants: Variant<Object>[] = [];

// 组合预设并导出
export default function presetThelastcookies(): Preset {
  return {
    name: 'preset-thelastcookies',
    rules,
    shortcuts,
    theme,
    variants,
  };
}
