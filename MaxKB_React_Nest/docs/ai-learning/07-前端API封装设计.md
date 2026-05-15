# 前端 API 封装设计

## 当前目标

本阶段只封装 React 前端 API，不讨论 Nest 后端接口实现。

目录分成两层：

```text
src/request 通用请求能力
src/api     业务接口方法
```

这和老项目 `ui/src/request` 的核心思想一致：页面不要直接调用 axios，而是通过业务 API 方法表达“我要做什么”。

## 为什么要有 request 层

`request` 层处理所有接口都会遇到的通用问题：

- baseURL：管理端接口统一走 `/admin/api`。
- token：后续从统一 store 中读取并注入 `AUTHORIZATION`。
- language：统一注入 `Accept-Language`。
- 401：统一清理登录态并跳转登录页。
- 403、业务错误、超时：统一给用户反馈。

如果页面直接写 axios，这些逻辑会散落在每个页面里。时间一长，就会出现有的接口带 token、有的不带 token，有的接口处理 401、有的接口忘了处理。request 层的价值，就是把通信细节集中起来，让页面只表达业务意图。

## 为什么 MsgError 要换成 Ant Design message

`MsgError` 是旧项目迁移痕迹，在 React 项目里没有定义，也不属于当前 UI 技术栈。这里改成 `antd` 的 `message.error` 有两个原因：

1. 和项目组件库保持一致，错误提示的视觉、动画、层级都由 Ant Design 接管。
2. 请求拦截器不在 React 组件树里，不能直接使用 hook；`message.error` 这种静态 API 更适合处理全局请求错误。

工程上要记住：全局副作用可以放在请求层，但副作用依赖必须是当前项目真实存在、稳定可用的能力。

## 为什么 router.push 要换成 React Router navigate

`router.push({ name: "login" })` 是 Vue Router 的写法。当前项目使用 `react-router-dom` 的 data router：

```ts
export const router = createBrowserRouter(routes, {
	basename: '/admin',
});
```

在非组件文件里不能使用 `useNavigate`，因为 hook 只能在 React 组件或自定义 hook 中运行。所以请求层需要导入路由实例，并调用：

```ts
router.navigate('/login');
```

这样做的好处是：

- 避免混用 Vue Router 思维模型。
- 保留 React Router 的 basename、路由状态和导航生命周期。
- 请求层可以在 401、404 等全局错误里触发统一跳转。

## 为什么 loading 要换成 setLoading

老项目里的请求包装支持 `Ref<boolean>` 和 `WritableComputedRef<boolean>`，这是 Vue 响应式系统里的状态容器：

```ts
loading.value = true;
```

React 里没有 `.value` 这个响应式协议。组件状态通常来自：

```ts
const [loading, setLoading] = useState(false);
```

所以 React 版请求包装接受的是 `setLoading`：

```ts
promise(request.get('/application'), setLoading);
```

为什么不在 `promise` 内部默认创建一个 loading 状态？因为工具函数不是 React 组件，它内部创建的普通变量或状态不会驱动任何页面重渲染。React 的工程思想是“状态属于使用它的组件”，请求工具只负责在开始和结束时通知外部。

当前实现同时保留了 `NProgress` 这种全局进度条协议：

```ts
promise(request.get('/application'), NProgress);
```

也就是说，这个封装支持两种 loading 场景：

- 页面局部 loading：传 `setLoading`。
- 顶部全局进度条：传带有 `start/done` 方法的对象。

## 为什么 method 要单独放到 method 文件夹

老项目把 axios 实例、请求拦截器、响应拦截器、`promise` 包装、`get/post/put/del`、文件下载、WebSocket 都放在一个 `index.ts` 里。这样早期开发很快，但文件会逐渐变成“什么都知道”的入口文件。

新项目拆成三层：

```text
src/request/index.ts          axios 实例、拦截器、method 注册出口
src/request/promise.ts        统一结果和 loading 包装
src/request/method/get.ts     GET 相关方法
src/request/method/post.ts    POST 相关方法
src/request/method/put.ts     PUT 相关方法
src/request/method/delete.ts  DELETE 相关方法
src/request/method/download.ts 通用 blob 下载
src/request/method/socket.ts  WebSocket 创建
src/request/method/utils.ts   文件名解析、blob 下载等内部工具
```

这样拆的原因不是为了“目录更多”，而是为了让每个文件只承担一种变化：

- 后端鉴权、语言、401 跳转变了，主要改 `index.ts`。
- loading 策略、返回值结构变了，主要改 `promise.ts`。
- 页面怎么调用 GET，就看 `method/get.ts`。
- 页面怎么调用 POST，就看 `method/post.ts`。
- 文件下载内部细节，集中在 `method/download.ts` 和 `method/utils.ts`。

工程能力上要重点理解这个边界：`method` 层不是新的网络能力，它只是把 axios 调用翻译成更贴近业务的函数。页面调用 `get("/application")`，不需要知道 axios 的 `method` 字段、`responseType`、`transformResponse` 这些通信细节。

`request/index.ts` 是注册出口，它显式导出各个 method 文件：

```ts
export * from './method/get';
export * from './method/post';
export * from './method/put';
export * from './method/delete';
```

这样业务层仍然可以从一个入口导入：

```ts
import { get, post } from '@/request';
```

文件拆细以后，调用方式不变，但源码阅读路线更清晰。

## 为什么共享类型不要用超长相对路径

下面这种导入能工作，但工程含义不好：

```ts
import type { LoginRequest } from '../../../../../packages/types/login.type';
```

它暴露的是“当前文件距离 packages 有几层目录”，而不是“我依赖共享类型”。一旦文件移动目录，导入路径就会跟着碎掉。

现在用 `tsconfig.app.json` 给共享类型加了路径别名：

```json
"paths": {
	"@/*": ["./src/*"],
	"@maxkb/types/*": ["../../packages/types/*"]
}
```

业务代码就可以写成：

```ts
import type { LoginRequest } from '@maxkb/types/login.type';
```

这背后的工程思想是：跨模块依赖应该通过稳定边界表达，而不是通过文件系统相对位置表达。短期用 TS paths 成本最低；如果后续 `packages/types` 变成独立发布、被前后端共同大量依赖，再升级成真正的 workspace package 会更合适。

## 登录逻辑为什么要拆成 API 编排和页面副作用

旧 Vue 登录函数里同时做了很多事：

- 表单校验
- 判断 LDAP 还是本地登录
- RSA 加密
- 调用登录接口
- 写入 `workspace_id`
- 切换语言
- 路由跳转
- 登录失败后刷新验证码

迁移到 React Query 后，不建议把这些全部塞进一个组件方法里。更好的边界是：

```text
api/user/login.ts       负责登录请求编排
views/login/index.tsx   负责表单、跳转、验证码刷新等页面副作用
```

`loginApi` 适合作为 `useMutation` 的 `mutationFn`。它处理“应该调用哪个接口、提交什么数据”：

- `loginMode === "LDAP"` 时调用 `/ldap/login`。
- 普通登录时调用 `/user/login`。
- 如果后续传入 `rsaKey` 和 `encrypt` 函数，就先生成 `encryptedData` 再提交。

页面的 `onSuccess` / `onError` 更适合处理“用户体验相关副作用”，比如跳转首页、保存 `workspace_id`、失败后刷新验证码。这样做的好处是 API 层可以被测试和复用，页面层也不会被网络细节污染。

## 源码阅读路线

1. `src/router/index.tsx`：看 `createBrowserRouter` 如何创建并导出路由实例。
2. `src/router/routes.tsx`：看 `/login`、通配 404 和业务模块路由如何定义。
3. `src/request/index.ts`：看 axios 实例、请求拦截器、响应拦截器如何处理通用通信问题。
4. `src/request/promise.ts`：看请求结果和默认 `NProgress` loading 如何统一处理。
5. `src/request/method/get.ts`：看最简单的 GET 包装和 GET 文件导出。
6. `src/request/method/post.ts`：看 POST、流式 POST 和 POST 文件导出。
7. `src/request/method/utils.ts`：看文件下载为什么需要解析响应头和处理 JSON 错误 blob。
8. `src/api/user/login.ts`：看登录请求如何从旧 Vue store action 迁移成 React Query 可调用的 API 函数。
9. `src/router/guard.ts`：看路由 loader 如何处理进入页面前的登录校验。
10. `src/api/application.ts`：后续业务接口应该调用 request method，而不是页面直接调用 axios。
