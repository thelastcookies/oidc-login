/**
 * OIDC Interaction 接口
 * 对应后端 /oidc/interaction/:uid 路由组
 * 这些接口由浏览器在 SSO 登录流程中直接访问，不需要 Access Token 认证
 */
import type { ApiResponse, InteractionRedirect, LoginRequest, RegisterRequest } from './types.d.ts';

const OIDC_URL = import.meta.env.APP_OIDC_URL;

/** 提交登录凭证 */
export const login = (uid: string, data: LoginRequest) => {
  return usePost<ApiResponse<InteractionRedirect>, LoginRequest>(
    `${OIDC_URL}/interaction/${uid}/login`,
    data,
  );
};

/** 注册新用户并自动登录 */
export const register = (uid: string, data: RegisterRequest) => {
  return usePost<ApiResponse<InteractionRedirect>, RegisterRequest>(
    `${OIDC_URL}/interaction/${uid}/register`,
    data,
  );
};

/** 确认授权 */
export const confirm = (uid: string) => {
  return usePost<ApiResponse<InteractionRedirect>>(
    `${OIDC_URL}/interaction/${uid}/confirm`,
  );
};

/** 取消授权 */
export const abort = (uid: string) => {
  return usePost<ApiResponse<InteractionRedirect>>(
    `${OIDC_URL}/interaction/${uid}/abort`,
  );
};
