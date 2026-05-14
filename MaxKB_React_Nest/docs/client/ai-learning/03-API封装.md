# 03-API封装

## 作用

API 封装负责把“页面想做什么”转换成“后端接口怎么调”。本项目分三层：

```text
页面组件
-> src/api/* 业务 API 方法
-> src/request/* 通用请求能力
-> axios/fetch/WebSocket
```

核心文件：

- `src/request/index.ts`：管理端请求封装。
- `src/request/chat/index.ts`：聊天端请求封装。
- `src/api/*`：各业务域 API。
- `src/request/Result.ts`：统一返回结构类型。

## 设计思想

`request` 层解决通用问题：baseURL、token、语言、错误提示、loading、下载、流式请求。`api` 层解决业务问题：应用、知识库、模型、工具分别有哪些接口。

为什么要分两层：如果页面直接写 axios，token、错误处理、loading、下载逻辑会在每个页面重复。重复一多，系统就会出现“这个接口 401 会跳登录，那个接口不会”的不一致。

## 管理端请求流程

```text
api 方法调用 get/post/put/del
-> request/index.ts 的 promise 包 loading
-> axios request interceptor 注入 Accept-Language 和 AUTHORIZATION
-> 后端返回
-> response interceptor 判断 code/status
-> Result 返回页面
```

`src/request/index.ts` 有几个工程点值得学：

- `baseURL` 支持 `window.MaxKB?.prefix`，说明部署时可能挂在子路径。
- `timeout: 1800000`，说明部分任务可能是长耗时操作。
- `postStream` 用 fetch，不走 axios，因为流式响应更适合 fetch reader。
- 下载接口使用 blob 和 `URL.createObjectURL`。
- `socket()` 根据 http/https 自动选择 ws/wss。

## 聊天端请求流程

`src/request/chat/index.ts` 和管理端相似，但差异关键：

- baseURL 是 `/chat/api`。
- token 来自 `chatUser.getToken()`。
- 语言来自 `chatUser.getLanguage()`。
- 错误处理更轻，不做后台路由跳转。

这体现了“同样是请求，但上下文不同就不要强行共用”的工程判断。

## API 层例子

`src/api/application/application.ts` 用动态 `prefix.value`：

```text
prefix.value = /workspace/{workspace_id}/application
```

它通过 getter 从 `user` store 获取当前工作空间。这样页面调用 `getApplication()` 时不用知道 workspace_id 拼在哪里。

## 优点

- 通用请求逻辑集中，页面代码更干净。
- 管理端和聊天端隔离，避免认证逻辑混淆。
- API 文件按业务域拆分，符合大型项目维护习惯。
- 支持普通请求、流式请求、下载、WebSocket 多种通信形态。

## 缺点

- `promise` 函数手写 Promise 包装已有 Promise，逻辑可读性一般。
- 管理端和聊天端 request 文件重复较多，可以抽公共工厂。
- 请求返回类型很多使用 `any`，类型约束还有提升空间。
- 响应错误里直接 `MsgError`，对于需要静默处理的业务要靠 URL 特判。

## 如果重构会怎么做

- 抽一个 `createRequestClient({ baseURL, getToken, getLanguage, onUnauthorized })`。
- 对常见业务返回定义泛型，例如 `Result<T>` 真正贯穿 api 层。
- 把错误策略从 URL 特判改成请求配置，例如 `silentError: true`。
- 把下载逻辑封装成独立 `downloadBlob`，减少 Excel/File/Post 的重复。

## 源码阅读路线

1. 先读 `src/request/index.ts`，理解所有请求都会经过哪里。
2. 再读 `src/request/chat/index.ts`，对比两个上下文差异。
3. 读 `src/api/user/login.ts`，理解登录接口。
4. 读 `src/api/application/application.ts`，理解 workspace 动态前缀。
5. 最后挑一个页面追踪它调用了哪个 API。
