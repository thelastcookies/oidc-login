/**
 * OIDC 认证管理模块
 *
 * 基于 oidc-client-ts 封装，提供登录、登出、令牌刷新等能力。
 * 所有 OIDC 静态配置均从环境变量读取，方便不同环境切换。
 */
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import type { User, UserManagerSettings } from 'oidc-client-ts';

const oidcSettings: UserManagerSettings = {
  authority: import.meta.env.APP_OIDC_ISSUER,
  client_id: import.meta.env.APP_OIDC_CLIENT_ID,
  redirect_uri: import.meta.env.APP_OIDC_REDIRECT_URI,
  post_logout_redirect_uri: import.meta.env.APP_OIDC_POST_LOGOUT_REDIRECT_URI,
  scope: import.meta.env.APP_OIDC_SCOPE,
  response_type: 'code',
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

const userManager = new UserManager(oidcSettings);

/** 跳转到 OIDC Provider 的登录页 */
export const signIn = () => userManager.signinRedirect();

/** 处理 OIDC 登录回调，返回已认证的 User */
export const signInCallback = (): Promise<User> => userManager.signinRedirectCallback();

/** 静默刷新令牌 */
export const signInSilent = (): Promise<User | null> => userManager.signinSilent();

/** 跳转到 OIDC Provider 的登出页 */
export const signOut = () => userManager.signoutRedirect();

/** 获取当前已登录的用户（可能为 null） */
export const getUser = (): Promise<User | null> => userManager.getUser();

/** 移除本地存储的用户信息 */
export const removeUser = () => userManager.removeUser();

/** 查询 OIDC 回调 URL 是否包含授权码参数 */
export const isOidcCallback = (): boolean => {
  const search = window.location.search;
  return search.includes('code=') && search.includes('state=');
};

export { userManager };
export type { User };
