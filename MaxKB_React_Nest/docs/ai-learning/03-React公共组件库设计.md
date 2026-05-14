# React 公共组件库设计

React 没有 Vue 的全局组件注册机制。公共组件库更适合通过统一出口文件暴露组件：

```ts
import { Button } from "@/components";
```

## 为什么使用生成脚本

手写 `src/components/index.ts` 容易漏导出。生成脚本会扫描 `src/components/*/index.ts`，自动生成统一出口。

这样既保留了 React/TypeScript 的静态类型提示，也避免运行时注册表带来的来源不清晰和 tree-shaking 变差。

## 源码阅读路线

1. `src/components/Button/Button.tsx`：组件 API 和行为。
2. `src/components/Button/Button.module.css`：组件局部样式。
3. `src/components/Button/index.ts`：单组件出口。
4. `scripts/gen-components-index.ts`：扫描组件并生成公共出口。
5. `src/components/index.ts`：自动生成的组件库入口。

## 后续新增组件流程

1. 创建 `src/components/NewComponent/index.ts`。
2. 启动开发服务或构建前，`predev` / `prebuild` 会自动更新 `src/components/index.ts`。
3. 如果开发服务已经运行中又新增组件，需要重启开发服务，或者手动运行 `bun run --filter @maxkb/client gen:components`。
4. 使用 `import { NewComponent } from "@/components"`。
