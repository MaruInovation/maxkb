import request from "../index";
import { promise, type RequestLoading } from "../promise";
import type Result from "../Result";

/**
 * 发送 PUT 请求，一般用于修改服务器资源。
 */
export function put<T = any>(
	url: string,
	data?: unknown,
	params?: unknown,
	loading?: RequestLoading,
	timeout?: number,
): Promise<Result<T>> {
	return promise<T>(request({ url, method: "put", data, params, timeout }), loading);
}
