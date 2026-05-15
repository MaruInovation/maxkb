# Zod 前后端契约设计

## 为什么新项目要用 Zod

这个项目是 monorepo：

```text
apps/client   React 前端
apps/server   Nest 后端
packages/shared 公共包
```

Zod 最适合放在 `packages/shared`，因为它能同时服务三件事：

- React 表单校验。
- Nest 接口入参校验。
- TypeScript 类型推导。

这意味着前端、后端、类型定义都来自同一份 schema，而不是各写一套规则。

## 当前安装位置

当前已经在 `@maxkb/shared` 安装：

```json
{
	"dependencies": {
		"zod": "^4.4.3"
	}
}
```

公共入口是：

```text
packages/shared/src/index.ts
```

示例 schema 是：

```text
packages/shared/src/schemas/application.ts
```

## 为什么不直接装到 client 和 server

如果 React 和 Nest 各自安装并各自写 schema，很容易出现规则漂移：

```text
前端认为 name 可以为空
后端认为 name 必填
接口类型又是第三份定义
```

把 schema 放进 shared 的价值是：业务契约只有一个来源。

工程上这叫 single source of truth，也就是单一事实来源。

## React 侧怎么用

React 表单提交前可以这样校验：

```ts
import { createApplicationSchema } from "@maxkb/shared";

const result = createApplicationSchema.safeParse(formData);

if (!result.success) {
	const errors = result.error.flatten();
}
```

前端关注的是：尽早提示用户输入错误，减少无效请求。

## Nest 侧怎么用

Nest 接口里可以这样校验：

```ts
import { BadRequestException } from "@nestjs/common";
import { createApplicationSchema } from "@maxkb/shared";

const result = createApplicationSchema.safeParse(body);

if (!result.success) {
	throw new BadRequestException(result.error.flatten());
}
```

后端关注的是：任何外部输入都不可信，必须在服务端再次校验。

## 和 DTO 的关系

Nest 默认常见写法是 DTO class 加 `class-validator`。

新项目如果选择 Zod，就建议统一使用 Zod schema，不要一半 class-validator，一半 Zod。否则团队会同时维护两套校验思想，学习和维护成本都会升高。

当前更推荐：

```text
Zod schema -> 推导 TypeScript 类型 -> 前后端共用
```

而不是：

```text
前端 interface
后端 DTO class
后端 class-validator
前端再写一份校验规则
```

## 源码阅读路线

1. `packages/shared/package.json`：确认公共包依赖 Zod。
2. `packages/shared/src/schemas/application.ts`：理解 schema 和类型如何同时生成。
3. `packages/shared/src/index.ts`：理解公共包统一导出。
4. 后续读 React 表单时，看它如何调用 `safeParse`。
5. 后续读 Nest controller/service 时，看它如何在接口边界校验输入。
