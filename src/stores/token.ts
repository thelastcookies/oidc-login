export const useTokenStore = defineStore('token', () => {
  const token = ref('');
  const TOKEN_KEY = 'token';

  const setToken = (t: string) => {
    localStorage.setItem(TOKEN_KEY, t);
    token.value = t;
  };

  const getToken = async () => {
    // 优先从响应式变量和 localStorage 中获取
    let t = null;
    if (token.value !== '') {
      t = token.value;
    } else if (localStorage.getItem(TOKEN_KEY)) {
      t = localStorage.getItem(TOKEN_KEY);
    }
    // 如果本地没有，尝试从 OIDC UserManager 获取
    if (!t) {
      const oidcUser = await getUser();
      if (oidcUser && !oidcUser.expired) {
        t = oidcUser.access_token;
        setToken(t);
      }
    }
    return t;
  };

  const $reset = () => {
    localStorage.removeItem(TOKEN_KEY);
    token.value = '';
    removeUser();
  };

  return {
    setToken,
    getToken,
    $reset,
  };
});
