这是一个非常关键的架构问题。让我详细解释。

## 当前架构：前后端不分离

是的，当前 `getInteraction` 返回的是服务端渲染的 HTML 字符串，这是 oidc-provider 的默认交互模式——**登录页由认证服务器自己渲染**。这在 OIDC 规范中是合法的，但不适合前后端分离的场景。

## 前后端分离下的 OIDC 完整流程

让我画出完整的时序图：

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  用户浏览器  │     │  业务系统 A    │     │  OIDC 认证服务  │     │  Vue 登录页   │
└─────┬─────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
      │                  │                    │                    │
      │ 1. 访问受保护页面    │                    │                    │
      │─────────────────→│                    │                    │
      │                  │                    │                    │
      │ 2. 302 → /auth?client_id=A&redirect_uri=...&response_type=code&scope=openid
      │─────────────────────────────────────→│                    │
      │                  │                    │                    │
      │ 3. 无会话 → 302 → /sso/oidc/interaction/:uid              │
      │──────────────────────────────────────────────────────────→│
      │                  │                    │                    │
      │ 4. 展示登录/注册页面 │                    │                    │
      │←─────────────────────────────────────────────────────────│
      │                  │                    │                    │
      │ 5. 提交登录 POST /sso/oidc/interaction/:uid/login          │
      │──────────────────────────────────────────────────────────→│
      │                  │                    │    POST /sso/oidc/interaction/:uid/login
      │                  │                    │←───────────────────│
      │                  │                    │                    │
      │ 6. 返回 { redirect: "redirect_uri?code=xxx" }             │
      │←─────────────────────────────────────────────────────────│
      │                  │                    │                    │
      │ 7. 跳转到 redirect_uri?code=xxx       │                    │
      │─────────────────→│                    │                    │
      │                  │                    │                    │
      │                  │ 8. POST /token code=xxx&client_secret=yyy│
      │                  │───────────────────→│                    │
      │                  │                    │                    │
      │                  │ 9. { access_token, id_token, ... }      │
      │                  │←───────────────────│                    │
      │                  │                    │                    │
      │ 10. 登录成功，展示页面 │                    │                    │
      │←─────────────────│                    │                    │
      │                  │                    │                    │
      │ ═══════════════ 第二个业务系统 SSO 生效 ═══════════════════
      │                  │                    │                    │
      │ 11. 访问业务系统 B   │                    │                    │
      │─────────────────────────────────────→│  (省略 B 的前端)     │
      │                  │                    │                    │
      │ 12. 302 → /auth?client_id=B&...       │                    │
      │─────────────────────────────────────→│                    │
      │                  │                    │                    │
      │ 13. 有会话 → 302 → B的redirect_uri?code=zzz (无需再登录!)   │
      │←─────────────────────────────────────│                    │
```

## 需要调用的接口

### 1. 登录

```
POST /sso/oidc/interaction/:uid/login
Content-Type: application/json

{ "username": "xxx", "password": "xxx" }

→ 成功: { "redirect": "https://业务系统/callback?code=授权码" }
→ 失败: { "msg": "用户名或密码错误" }
```

### 2. 注册

```
POST /sso/oidc/interaction/:uid/register
Content-Type: application/json

{ "username": "xxx", "password": "xxx" }

→ 成功: { "redirect": "https://业务系统/callback?code=授权码" }  (注册后自动登录)
→ 失败: { "msg": "用户名已存在" }
```

### 3. 登出

```
GET /session/end?id_token_hint=xxx&post_logout_redirect_uri=xxx

→ 302 重定向到 post_logout_redirect_uri
```

这是 oidc-provider 内置的 RP-Initiated Logout 端点，业务系统只需重定向到这个地址即可。

### 4. 状态保持

OIDC 的状态保持**不依赖 JWT**，而是依赖 **OIDC 服务器域下的 Session Cookie**。当用户在认证服务器登录后，浏览器会保存该域的 Cookie。后续访问其他业务系统时，重定向到 `/auth` 时浏览器会自动携带此 Cookie，OIDC 服务器识别到会话后直接签发授权码，**用户无需再次登录**——这就是 SSO 的核心机制。

## 适配 Vue 登录页的改造

核心改动：`getInteraction` 不再返回 HTML，而是**重定向到 Vue 应用的登录页**，把 `uid` 作为参数传递。


toolName: view_files

status: success


filePath: /Users/xinwentao/Desktop/Code/NodeJS/oidc-server/src/oidc/config.ts




toolName: view_files

status: success


filePath: /Users/xinwentao/Desktop/Code/NodeJS/oidc-server/src/controller/oidc.ts




toolName: view_files

status: success


filePath: /Users/xinwentao/Desktop/Code/NodeJS/oidc-server/.env/.env

好的，现在我对全貌有了清晰的理解。让我改造 `getInteraction`，将其从返回 HTML 改为重定向到 Vue 登录页：


toolName: todo_write

status: success

Todos updated: 4 items




toolName: view_files

status: success


filePath: /Users/xinwentao/Desktop/Code/NodeJS/oidc-server/src/controller/oidc.ts

现在改造 `getInteraction`——从返回 HTML 改为重定向到 Vue 登录页：


toolName: edit_file_search_replace

status: success


filePath: /Users/xinwentao/Desktop/Code/NodeJS/oidc-server/src/controller/oidc.ts

changes: undefined

现在替换 `getInteraction` 函数体：


toolName: edit_file_search_replace

status: success


filePath: /Users/xinwentao/Desktop/Code/NodeJS/oidc-server/src/controller/oidc.ts

changes: undefined




toolName: todo_write

status: success

Todos updated: 4 items




toolName: edit_file_search_replace

status: success


filePath: /Users/xinwentao/Desktop/Code/NodeJS/oidc-server/.env/.env

changes: undefined




toolName: edit_file_search_replace

status: success


filePath: /Users/xinwentao/Desktop/Code/NodeJS/oidc-server/.env/types/env.d.ts

changes: undefined




toolName: todo_write

status: success

Todos updated: 4 items




toolName: run_command

status: success

command: cd /Users/xinwentao/Desktop/Code/NodeJS/oidc-server && npx tsc --noEmit 2>&1 && echo "--- tsc OK ---" && pnpm build:esbuild 2>&1 && echo "--- esbuild OK ---" undefined




toolName: todo_write

status: success

Todos updated: 4 items

构建通过。现在回答你的问题：

---

## 回答你的三个问题

### 1. 当前是否前后端不分离？

**是的**，之前 `getInteraction` 返回的是服务端渲染的 HTML 字符串。现在已经改为 **302 重定向到 Vue 登录页**，实现了前后端分离。

### 2. Vue 登录页如何适配？需要调用哪些接口？

Vue 登录页收到的 URL 格式为：

```
https://sso.example.com/login?uid=xxx&prompt=login&client_id=my-app&scope=openid+profile
```

Vue 登录页需要调用的接口：

| 功能 | 接口 | 方法 | 请求体 | 成功响应 |
|------|------|------|--------|----------|
| **登录** | `/sso/oidc/interaction/:uid/login` | POST | `{ username, password }` | `{ success: true, data: { redirect: "https://业务系统/callback?code=xxx" } }` |
| **注册** | `/sso/oidc/interaction/:uid/register` | POST | `{ username, password }` | `{ success: true, data: { redirect: "https://业务系统/callback?code=xxx" } }` |
| **登出** | `/session/end?id_token_hint=xxx&post_logout_redirect_uri=xxx` | GET | — | 302 重定向到 `post_logout_redirect_uri` |
| **确认授权** | `/sso/oidc/interaction/:uid/confirm` | POST | — | `{ success: true, data: { redirect: "..." } }` |
| **取消授权** | `/sso/oidc/interaction/:uid/abort` | POST | — | `{ success: true, data: { redirect: "..." } }` |

Vue 登录页的核心逻辑非常简单：

```typescript
// 从 URL 获取 uid
const uid = new URLSearchParams(window.location.search).get('uid');

// 登录
const login = async (username: string, password: string) => {
  const res = await fetch(`https://oidc-server:8190/sso/oidc/interaction/${uid}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (data.success) {
    // 跳转回业务系统
    window.location.href = data.data.redirect;
  }
};

// 注册
const register = async (username: string, password: string) => {
  const res = await fetch(`https://oidc-server:8190/sso/oidc/interaction/${uid}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (data.success) {
    // 注册成功自动登录，跳转回业务系统
    window.location.href = data.data.redirect;
  }
};
```

**关于状态保持**：SSO 的状态保持完全由 OIDC 服务器域下的 **Session Cookie** 自动管理，Vue 登录页不需要做任何额外工作。用户登录成功后，浏览器自动保存 Cookie；下次访问其他业务系统时，浏览器自动携带 Cookie，OIDC 服务器识别到会话后直接签发授权码，用户无需再次登录。

### 3. 业务系统如何接入？

业务系统（RP，Relying Party）接入 SSO 只需三步：

**第一步：在认证服务器注册 Client**

```bash
# 先通过 OIDC 流程获取 Access Token，然后调用管理接口
POST /sso/oidc/client
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "client_id": "my-app",
  "client_secret": "my-secret",
  "redirect_uris": ["https://my-app.com/callback"],
  "post_logout_redirect_uris": ["https://my-app.com"],
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"]
}
```

**第二步：业务系统前端——发起登录/登出**

```typescript
// 发起登录：重定向到 OIDC 服务器的 /auth 端点
const login = () => {
  const params = new URLSearchParams({
    client_id: 'my-app',
    redirect_uri: 'https://my-app.com/callback',
    response_type: 'code',
    scope: 'openid profile offline_access',
  });
  window.location.href = `https://oidc-server:8190/auth?${params}`;
};

// 发起登出：重定向到 OIDC 服务器的 /session/end 端点
const logout = (idToken: string) => {
  const params = new URLSearchParams({
    id_token_hint: idToken,
    post_logout_redirect_uri: 'https://my-app.com',
  });
  window.location.href = `https://oidc-server:8190/session/end?${params}`;
};
```

**第三步：业务系统后端——用授权码换取令牌**

```typescript
// 回调接口：接收授权码，换取令牌
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  const tokenResponse = await fetch('https://oidc-server:8190/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: 'my-app',
      client_secret: 'my-secret',
      redirect_uri: 'https://my-app.com/callback',
    }),
  });

  const tokens = await tokenResponse.json();
  // tokens = {
  //   access_token: "xxx",   // 访问令牌，用于调用 API
  //   id_token: "xxx",       // ID 令牌，包含用户信息（JWT 格式）
  //   refresh_token: "xxx",  // 刷新令牌，用于续期
  //   token_type: "Bearer",
  //   expires_in: 3600,
  // }

  // 用 access_token 获取用户信息
  const userInfo = await fetch('https://oidc-server:8190/me', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  // 建立业务系统自己的会话
  // ...
});
```

或者更简单——使用现成的 OIDC 客户端库：

| 框架 | 推荐库 |
|------|--------|
| Vue | `oidc-client-ts` |
| React | `oidc-client-ts` + `react-oidc-context` |
| Nuxt | `nuxt-oidc` |
| Next.js | `next-auth` |

用 `oidc-client-ts` 的话，业务系统前端只需要配置：

```typescript
import { UserManager } from 'oidc-client-ts';

const userManager = new UserManager({
  authority: 'https://oidc-server:8190',           // OIDC 服务器地址
  client_id: 'my-app',                              // 注册的 client_id
  redirect_uri: 'https://my-app.com/callback',      // 回调地址
  post_logout_redirect_uri: 'https://my-app.com',   // 登出后重定向
  response_type: 'code',                            // 授权码模式
  scope: 'openid profile offline_access',           // 请求的权限
});

// 发起登录
userManager.signinRedirect();

// 回调处理
userManager.signinRedirectCallback();

// 登出
userManager.signoutRedirect();

// 获取用户信息
const user = await userManager.getUser();
```

这就是完整的接入流程。核心要点是：**业务系统不需要理解 OIDC 的内部机制，只需要遵循 Authorization Code Flow 标准流程即可**。
