import type Result from "./Result";
import type { Dispatch, SetStateAction } from "react";
import NProgress from "nprogress";

interface ProgressLoading {
	start: () => unknown;
	done: () => unknown;
}

type StateLoading = Dispatch<SetStateAction<boolean>>;
export type RequestLoading = ProgressLoading | StateLoading;

function isProgressLoading(loading: RequestLoading): loading is ProgressLoading {
	return typeof loading === "object" && typeof loading.start === "function";
}

function setRequestLoading(loading: RequestLoading | undefined, value: boolean): void {
	if (!loading) {
		return;
	}

	if (isProgressLoading(loading)) {
		if (value) {
			loading.start();
		} else {
			loading.done();
		}
		return;
	}

	loading(value);
}

/**
 * 统一包装接口请求结果。
 *
 * 默认使用 NProgress 作为全局 loading，不需要调用方额外传 loading。
 * 如果某个页面需要按钮级、表格级 loading，也可以传入 React 的 setLoading。
 */
export async function promise<T = any>(
	request: Promise<any>,
	loading: RequestLoading = NProgress,
): Promise<Result<T>> {
	setRequestLoading(loading, true);
	try {
		const response = await request;
		// Blob 下载等场景通常依赖 HTTP status，普通业务接口返回 response.data。
		if (response.status === 200) {
			return response?.data || response;
		}
		return Promise.reject(response?.data || response);
	} catch (error) {
		return Promise.reject(error);
	} finally {
		setRequestLoading(loading, false);
	}
}
