import request from "../index";
import { promise, type RequestLoading } from "../promise";
import type Result from "../Result";

/**
 * 发送 DELETE 请求，一般用于删除服务器资源。
 */
export function del<T = any>(
	url: string,
	params?: unknown,
	data?: unknown,
	loading?: RequestLoading,
	timeout?: number,
): Promise<Result<T>> {
	return promise<T>(request({ url, method: "delete", params, data, timeout }), loading);
}
