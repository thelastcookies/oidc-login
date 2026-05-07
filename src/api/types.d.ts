/**
 * API 统一响应类型
 */

/** 成功响应 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  code: number;
  msg: 'success';
  data: T;
}

/** 错误响应 */
export interface ApiErrorResponse {
  success: false;
  code: number;
  msg: string;
  detail: string | null;
}

/** 统一响应联合类型 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Interaction 相关类型
 */

/** 登录请求体 */
export interface LoginRequest {
  username: string;
  password: string;
}

/** 注册请求体 */
export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterForm extends RegisterRequest {
  passwordConfirm: string;
}

/** 交互流程返回的重定向信息 */
export interface InteractionRedirect {
  redirect: string;
}

/**
 * 用户相关类型
 */

/** 用户信息 */
export interface UserRecord {
  id?: number;
  username?: string;
  [key: string]: unknown;
}

/** 用户凭证验证结果 */
export interface UserCredentials {
  id: number;
  username: string;
}
