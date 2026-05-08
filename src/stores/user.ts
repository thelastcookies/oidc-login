import type { UserRecord } from '@/api/types.d.ts';

export const useUserStore = defineStore('user', () => {
  const userInfo = shallowRef({} as UserRecord);
  const permCodes = shallowRef([] as string[]);

  const hasPerm = (code: string | string[]) => {
    const codes = (isArray(code) ? code : [code]) as string[];
    return codes.some(c => permCodes.value.includes(c));
  };

  const $reset = () => {
    userInfo.value = {};
    permCodes.value = [];
  };

  return {
    userInfo,
    hasPerm,
    $reset,
  };
});
