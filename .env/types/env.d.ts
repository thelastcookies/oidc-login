/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 项目标题
  readonly APP_TITLE: string;
  // 项目打包生成文件
  readonly APP_BUILD_NAME: string;
  // 打包时是否开启 sourcemap
  readonly APP_SOURCE_MAP: 'true' | 'false';
  /**
   * 主题模式
   *   system：跟随系统主题
   *   light：启用浅色模式
   *   dark：启用深色模式
   */
  readonly APP_THEME: 'system' | 'light' | 'dark';
  // OIDC Issuer 地址，用于 oidc-client-ts 发现 OIDC 端点
  readonly APP_OIDC_ISSUER: string;
  // OIDC 服务端 API 基础地址（含路由前缀，如 /oidc）
  readonly APP_OIDC_URL: string;
  // OIDC 客户端 ID
  readonly APP_OIDC_CLIENT_ID: string;
  // OIDC 登录回调地址
  readonly APP_OIDC_REDIRECT_URI: string;
  // OIDC 登出后回调地址
  readonly APP_OIDC_POST_LOGOUT_REDIRECT_URI: string;
  // OIDC 请求的权限范围
  readonly APP_OIDC_SCOPE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
