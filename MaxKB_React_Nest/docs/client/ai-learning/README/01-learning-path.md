# learning-path

## 你的能力短板

结合 `prompt/mian.md` 里的描述，你现在最需要补的不是“Vue 语法”，而是这些工程能力：

- 从入口和路由建立项目地图的能力。
- 从状态、请求、权限理解业务闭环的能力。
- 区分核心代码和业务代码的能力。
- 识别抽象边界的能力。
- 评估性能成本来源的能力。
- 阅读复杂组件协议的能力。

## 优先学习顺序

### 第 1 阶段：建立项目骨架感

先读：

- `package.json`
- `vite.config.ts`
- `src/main.ts`
- `src/chat.ts`
- `src/App.vue`

目标：你要能讲清楚“浏览器打开页面后，代码从哪里开始跑”。

### 第 2 阶段：理解页面如何被组织

再读：

- `src/router/routes.ts`
- `src/router/index.ts`
- `src/router/common.ts`
- `src/router/modules/application.ts`
- `src/router/modules/system.ts`
- `src/router/chat/index.ts`

目标：你要能讲清楚“一个 URL 为什么能进入某个页面，为什么有时会跳登录或无权限”。

### 第 3 阶段：理解用户上下文

再读：

- `src/stores/modules/login.ts`
- `src/stores/modules/user.ts`
- `src/stores/modules/chat-user.ts`
- `src/utils/permission/index.ts`
- `src/utils/permission/type.ts`
- `src/directives/hasPermission.ts`

目标：你要能讲清楚“登录后系统获得了哪些上下文，权限如何影响路由和按钮”。

### 第 4 阶段：理解请求链路

再读：

- `src/request/index.ts`
- `src/request/chat/index.ts`
- `src/api/user/login.ts`
- `src/api/application/application.ts`

目标：你要能从一个按钮点击追踪到后端接口，再追踪回 UI 更新。

### 第 5 阶段：理解组件资产

再读：

- `src/components/index.ts`
- `src/components/dynamics-form/index.ts`
- `src/components/folder-virtualized-tree/VirtualizedTree.vue`
- `src/components/markdown/*`
- `src/components/ai-chat/index.vue`

目标：你要能区分“页面组件”和“可复用业务组件”。

### 第 6 阶段：挑战复杂模块

最后读：

- `src/workflow/common/data.ts`
- `src/workflow/common/validate.ts`
- `src/workflow/plugins/dagre.ts`
- `src/workflow/nodes/*`
- `src/views/application-workflow/index.vue`

目标：你要能理解“复杂功能不是靠一个大组件硬写，而是靠协议和模块协作”。

## 哪些代码值得精读

最值得反复读：

- `src/router/index.ts`
- `src/router/common.ts`
- `src/stores/modules/user.ts`
- `src/request/index.ts`
- `src/utils/permission/index.ts`
- `src/router/modules/system.ts`
- `src/components/folder-virtualized-tree/VirtualizedTree.vue`
- `src/workflow/common/data.ts`
- `vite.config.ts`

读这些文件时，不要只看代码做了什么，还要问：

- 为什么它必须放在这一层？
- 如果不这样封装，会在哪些页面重复？
- 未来新增业务时，是改这里，还是改业务页面？
- 它解决的是功能问题、维护问题、性能问题，还是部署问题？

## 哪些内容暂时不用深究

初期不用深究：

- 每个业务页面的所有表单字段。
- 每个图标 SVG。
- 每个语言包文案。
- 工作流每一种节点的完整表单细节。
- 系统设置里每个第三方认证协议的全部字段。

这些内容偏业务细节。你先建立架构地图，再回头看它们会更轻松。

## 如何从业务前端成长为高级前端

你可以按这个训练法学习：

1. 每读一个页面，画出它的链路：路由 -> 页面 -> store -> api -> request。
2. 每读一个组件，判断它是基础组件、业务组件，还是页面组件。
3. 每看到一个权限判断，追到 `hasPermission()`，不要只停在按钮上。
4. 每看到一个接口，追到 `request/index.ts`，理解 token、语言、错误如何统一。
5. 每看到一个复杂功能，找它的协议。例如动态表单的字段协议、工作流的节点协议。
6. 每周选一个模块写复盘：它解决什么问题、为什么这样设计、如果重构怎么做。

## 4 周学习计划

第 1 周：入口、路由、请求、状态、权限。目标是能画出项目架构图。

第 2 周：布局、菜单、组件注册、动态表单。目标是能解释复用组件如何降低业务成本。

第 3 周：应用、知识库、文档三个业务域。目标是能从页面追踪到 API 和权限。

第 4 周：AI Chat、Workflow、性能优化。目标是理解复杂交互如何靠协议、状态和性能策略支撑。

## 最重要的一句话

不要只问“这段代码怎么写”，要训练自己问“这个变化被放在哪一层处理，为什么放在那里”。这是从业务前端走向高级前端的分水岭。
