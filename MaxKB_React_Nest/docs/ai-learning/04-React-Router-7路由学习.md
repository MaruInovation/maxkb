# React Router 7 路由学习

## 当前项目处在哪个阶段

本项目的客户端已经安装 `react-router-dom@^7.15.0`，也就是说依赖层面已经进入 React Router 7。当前代码位于 `apps/client/src/router/index.tsx`，使用的是：

```tsx
<BrowserRouter basename="/admin">
	<Routes>
		<Route path="/" element={<App />} />
	</Routes>
</BrowserRouter>
```

这属于 React Router 7 的 Declarative Mode，也就是声明式路由模式。它的特点是学习成本低、迁移成本低，适合从 React Router 6 平滑过渡过来的 Vite SPA 项目。

这里要建立一个工程判断：React Router 7 不是只有一种写法。它同时支持 Declarative Mode、Data Mode 和 Framework Mode。不要因为版本号是 7，就立刻把项目改造成框架模式。高级前端工程里，版本升级不等于架构升级。

## 三种模式怎么理解

### Declarative Mode

Declarative Mode 使用 `BrowserRouter`、`Routes`、`Route` 组织页面。

它解决的是最基础的问题：URL 到组件的映射。

为什么当前项目可以先用它：

- 项目目前还是 Vite SPA 形态。
- 管理端入口使用 `/admin` 作为 basename。
- 页面数量还少，路由守卫、权限、菜单体系还没有完全落地。
- 先保持简单，可以减少升级 React Router 7 时的认知负担。

工程思想是：在系统能力还没有被业务复杂度真正需要之前，不要提前支付框架复杂度。

### Data Mode

Data Mode 使用 `createBrowserRouter` 和 `RouterProvider`，把路由配置移到 React 渲染树外部。

它开始支持：

- `loader`：路由级数据加载。
- `action`：表单或变更类操作。
- `useNavigation`：路由切换中的 pending 状态。
- `errorElement`：路由级错误边界。

为什么大型后台项目后续适合逐步迁移到 Data Mode：

- 页面进入前的数据可以跟路由绑定，而不是散落在组件 `useEffect` 里。
- 权限、错误、加载状态可以形成更清晰的路由边界。
- 路由对象天然适合按业务模块拆分，例如 `application`、`knowledge`、`system`。

但它也会改变现有组织方式，所以更适合在路由模块稳定后迁移。

### Framework Mode

Framework Mode 更接近 Remix 的开发体验，会引入 React Router 自己的 Vite 插件、路由模块约定、服务端渲染或静态渲染能力。

为什么当前项目不建议一上来切到 Framework Mode：

- 项目已有自己的 Vite 多入口配置：`admin.html`、`chat.html`。
- 当前工程还有 Nest 服务端，前后端边界已经存在。
- Framework Mode 会影响构建、部署、路由文件组织，不只是改几个 import。

高级前端的判断不是“新模式更强就立刻用”，而是看它是否解决了当前架构真实存在的问题。

## 本项目推荐路线

### 第一阶段：保持 Declarative Mode

当前可以继续使用 `BrowserRouter`，先把路由结构梳理清楚。

推荐目标：

- 保留 `/admin` basename。
- 增加业务页面路由，例如 `/application`、`/knowledge`。
- 使用 `React.lazy` 做页面级懒加载。
- 为 404、布局、权限守卫预留位置。

这样做的价值是：先让团队理解“路由是业务模块组织方式”，而不是只理解“路由是跳页面”。

### 第二阶段：抽出模块化 RouteObject

当页面增多后，可以引入 `RouteObject`，例如：

```ts
export const applicationRoutes = [
	{
		path: "application",
		lazy: () => import("@/views/application"),
	},
];
```

为什么要抽模块：

- 每个业务域维护自己的路由，降低冲突。
- 菜单、权限、面包屑可以逐步挂到 route `handle` 或自定义 meta 上。
- 新人读源码时可以按业务域进入，而不是从一个巨大路由数组里寻找入口。

这是后台系统非常重要的工程能力：把页面结构变成业务结构。

### 第三阶段：再评估 Data Mode

当项目出现这些信号时，再考虑迁移到 Data Mode：

- 页面大量依赖进入前接口请求。
- 权限校验开始依赖路由级数据。
- 页面 loading、错误状态重复出现。
- 需要统一处理路由跳转中的 pending UI。

迁移 Data Mode 的真正收益不是“写法更新”，而是让数据生命周期跟路由生命周期绑定。

## 性能问题怎么想

路由性能主要看三个点。

第一，页面是否懒加载。后台项目页面多，如果所有页面都进首屏 bundle，用户打开管理端时会下载暂时用不到的代码。路由级懒加载的本质是把 bundle 按业务入口切开。

第二，是否制造数据瀑布。如果页面 A 先渲染，再 `useEffect` 请求，再根据结果渲染子页面请求，就会形成串行等待。Data Mode 的 `loader` 可以帮助把部分数据加载前置，但不是所有请求都必须放进去。

第三，权限逻辑是否重复。权限判断散落在组件里，会造成重复计算和重复请求。更好的方向是把“能不能进入某个路由”放在路由层，把“页面内按钮能不能点”放在权限工具层。

## 源码阅读路线

建议按这个顺序读：

1. `apps/client/src/main.tsx`：理解 React 应用如何挂载。
2. `apps/client/src/app/AppRoot.tsx`：理解全局 Provider 和路由入口的位置。
3. `apps/client/src/router/index.tsx`：理解当前 React Router 7 的实际使用模式。
4. `apps/client/src/views/application/index.tsx`：理解业务页面如何被路由承载。
5. `apps/client/vite.config.ts`：理解为什么 basename、HTML 入口、构建路径会影响路由设计。

读源码时不要只看“这行代码调用了什么 API”，要追问三个为什么：

- 为什么路由入口放在 `AppRoot` 里？
- 为什么管理端要有 `/admin` basename？
- 为什么多入口 Vite 项目不应该轻率切 Framework Mode？

这些问题背后才是真正的工程判断。

## 参考资料

- React Router 官方文档：`https://reactrouter.com/start/modes`
- React Router API：`https://api.reactrouter.com/v7/index.html`
