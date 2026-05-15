# React 路由守卫设计

## 当前实现目标

本阶段只实现登录态守卫，不实现权限判断。

也就是说，路由守卫只回答一个问题：

```text
用户有没有 token，能不能进入管理端页面？
```

它不回答：

```text
用户有没有某个菜单权限？
用户能不能访问某个按钮？
用户所在版本能不能使用某个功能？
```

这些属于权限系统，后续应该独立设计。把登录守卫和权限判断拆开，是为了让路由层职责更清晰。

## 为什么 React 版不用 Vue 的 beforeEach

Vue Router 里常见写法是：

```ts
router.beforeEach((to, from, next) => {
	// 判断 token
	// next('/login')
});
```

React Router 7 的 Data Router 更推荐用 `loader` 做进入页面前的判断。

本项目现在使用：

```ts
createBrowserRouter(routes, {
	basename: "/admin",
});
```

所以可以在父路由上挂：

```ts
loader: authGuardLoader;
```

这样访问 `/admin/application`、`/admin/knowledge` 等管理端页面时，会先执行 `authGuardLoader`。如果没有 token，就在页面渲染前跳到 `/admin/login`。

工程思想是：能在路由层完成的拦截，不要推迟到页面组件里做。否则页面会先渲染，再跳走，用户会看到闪屏，数据请求也可能被错误触发。

## 当前守卫流程

当前文件：

```text
apps/client/src/router/guard.ts
```

流程是：

```text
进入受保护路由
-> 从 URL query 读取 token
-> 如果有 token，写入 localStorage
-> 从 localStorage 读取 token
-> 有 token，放行
-> 没有 token，redirect('/login')
```

对应源码：

```ts
export function authGuardLoader({ request }: LoaderFunctionArgs) {
	saveTokenFromQuery(request);

	if (!hasToken()) {
		throw redirect("/login");
	}

	return null;
}
```

这里使用 `throw redirect("/login")` 是 React Router 的标准跳转方式。它表示当前 loader 不再继续执行，而是让路由系统接管跳转。

## 为什么把 /login 放在守卫外面

路由结构是：

```ts
export const routes = [
	{
		path: "/login",
		lazy: lazyRoute(() => import("@/views/login")),
	},
	{
		path: "/",
		loader: authGuardLoader,
		children: [...moduleRoutes],
	},
];
```

`/login` 是公开路由，不能被登录守卫拦截。否则没有 token 的用户访问 `/login` 时，也会触发守卫，再跳回 `/login`，形成无意义循环。

受保护的是 `/` 这组父路由下面的业务模块，例如：

```text
/application
/knowledge
/application/:from/:id/:type
```

因为项目设置了 `basename: "/admin"`，所以真实浏览器地址是：

```text
/admin/application
/admin/knowledge
/admin/login
```

但在 React Router 的路由配置里，只写：

```text
/application
/knowledge
/login
```

## 为什么不在组件里判断 token

不推荐在页面里这样写：

```tsx
useEffect(() => {
	if (!token) {
		navigate("/login");
	}
}, [token]);
```

原因有三个：

- 页面已经渲染了，用户可能看到一瞬间的受保护内容。
- 页面里的接口请求可能已经发出，造成无效请求。
- 每个页面都写一遍判断，会让登录逻辑散落在业务组件里。

路由守卫的价值是把“进入页面前的准入规则”集中到路由层。

## 后续怎么扩展

后续可以逐步增加：

1. token 过期检查：进入页面前调用用户资料接口。
2. 白名单路由：例如忘记密码、重置密码。
3. 登录后回跳：未登录访问 `/application`，登录成功后回到原页面。
4. 权限守卫：单独基于 route `handle.permission` 或独立权限配置实现。

注意，权限守卫不要急着和登录守卫混在一起。登录解决“你是谁”，权限解决“你能做什么”，这是两个层次。

## 源码阅读路线

1. `apps/client/src/router/routes.tsx`：看哪些路由公开，哪些路由受保护。
2. `apps/client/src/router/guard.ts`：看登录态守卫如何放行和跳转。
3. `apps/client/src/router/module/application.ts`：看业务模块如何挂到受保护父路由下面。
4. `apps/client/src/layout/layout-template/SimpleLayout.tsx`：理解布局路由为什么需要 `<Outlet />`。
5. `apps/client/src/views/login/index.tsx`：后续登录成功后应该写入 token 并跳回业务页面。
