# 04-hooks

## 作用

这个项目的 hooks 数量不算多，更多逻辑直接写在 store、utils、组件里。能明确看到的 composable/hook 包括：

- `src/locales/useLocale.ts`：语言切换 hook。
- `src/layout/hooks/useResize.ts`：布局响应式相关 hook。
- 组件内部大量使用 Vue Composition API：`ref`、`computed`、`watch`、`onMounted`、`useRoute`、`useRouter`。

## 设计思想

hooks 的价值不是“把代码挪出去”，而是抽出可复用的状态逻辑。这个项目更偏中后台业务，许多逻辑强绑定页面，所以没有过度抽 hooks。这是合理的：抽象太早会让新人找不到逻辑入口。

## 典型例子

`src/locales/useLocale.ts` 把语言切换封装起来，配合 `src/locales/index.ts` 的 `vue-i18n` 初始化。它解决的是“多个地方可能需要切换语言，但不应该每个地方都知道 localStorage key 和 i18n 实例细节”。

`src/layout/hooks/useResize.ts` 这类布局 hook 通常用于监听窗口变化，把布局状态写入 `common` store。它的意义是把 DOM/窗口事件从布局组件里抽离。

## 优点

- hooks 数量克制，没有为了抽象而抽象。
- 国际化、布局这类横切逻辑适合用 hook。
- 业务核心状态更多放在 Pinia，边界比较明确。

## 缺点

- 某些页面组件过大时，局部逻辑没有拆成 hooks，会影响阅读。
- hook 目录不统一，`layout/hooks` 和 `locales/useLocale.ts` 分散存在。
- 可测试性有限，页面内部函数不如独立 hook 容易单测。

## 为什么这样实现

中后台项目经常有大量业务页面。如果每个页面都强行拆 hooks，可能导致“读一个页面要跳十个文件”。本项目选择把全局逻辑放 store/utils，页面专属逻辑留在页面里，整体是偏实用主义的设计。

## 如果重构会怎么做

- 当某个页面超过 500 行且包含独立流程时，再拆 hook。
- 建立 `src/hooks` 目录，放通用 hooks，例如 `usePagination`、`useTableSelection`、`useDialogForm`。
- 对业务域 hook 使用明确命名，例如 `useApplicationList`、`useKnowledgeUpload`。
- hooks 不直接弹全局消息，尽量返回状态和错误给调用者决定 UI。

## 源码阅读路线

1. 先读 `src/locales/index.ts`，理解 i18n 初始化。
2. 再读 `src/locales/useLocale.ts`，看 hook 如何操作全局 locale。
3. 读 `src/layout/hooks/useResize.ts`，理解布局状态和窗口事件。
4. 在页面里搜索 `useRoute`、`useStore`，观察组件内部逻辑是否有抽 hook 的空间。
