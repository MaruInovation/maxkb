import type { createBrowserRouter } from "react-router-dom";
import NProgress from "nprogress";

type BrowserRouter = ReturnType<typeof createBrowserRouter>;

NProgress.configure({
	showSpinner: false,
	speed: 500,
	minimum: 0.2,
	trickleSpeed: 200,
});

const minimumVisibleMs = 300;
let startedAt = 0;
let doneTimer: number | undefined;
let fallbackDoneTimer: number | undefined;

function startProgress(): void {
	if (doneTimer) {
		window.clearTimeout(doneTimer);
		doneTimer = undefined;
	}

	startedAt = Date.now();
	NProgress.start();

	// 避免异常导航或未收到 idle 状态时进度条一直停留在页面顶部。
	if (fallbackDoneTimer) {
		window.clearTimeout(fallbackDoneTimer);
	}

	fallbackDoneTimer = window.setTimeout(() => {
		doneProgress();
	}, 3000);
}

function doneProgress(): void {
	const elapsed = Date.now() - startedAt;
	// 路由模块太小时 start/done 可能在一帧内完成，保留最短展示时间更接近老项目体验。
	const remaining = Math.max(minimumVisibleMs - elapsed, 0);

	if (doneTimer) {
		window.clearTimeout(doneTimer);
	}

	if (fallbackDoneTimer) {
		window.clearTimeout(fallbackDoneTimer);
		fallbackDoneTimer = undefined;
	}

	doneTimer = window.setTimeout(() => {
		NProgress.done();
		doneTimer = undefined;
	}, remaining);
}

export function setupRouteProgress(router: BrowserRouter): void {
	const originalNavigate = router.navigate.bind(router);

	// 首屏刷新不是 React Router 的客户端导航，手动启动一次用于模拟老项目 beforeEach 的效果。
	startProgress();

	if (router.state.navigation.state === "idle") {
		window.queueMicrotask(doneProgress);
	}

	// 有些无 loader 的页面切换会一直保持 idle，拦截 navigate 才能在点击 Link 时立刻显示进度条。
	router.navigate = ((...args: Parameters<typeof router.navigate>) => {
		startProgress();
		return originalNavigate(...args);
	}) as typeof router.navigate;

	// 浏览器前进/后退不会经过 Link 点击，但会触发 popstate。
	window.addEventListener("popstate", startProgress);

	// subscribe 负责收尾：路由状态稳定后结束进度条。
	router.subscribe((state) => {
		if (state.navigation.state === "idle") {
			doneProgress();
			return;
		}

		startProgress();
	});
}
