import type { Method } from "axios";
import request from "../index";
import { promise, type RequestLoading } from "../promise";
import type Result from "../Result";

/**
 * 通用 blob 下载方法。适合调用方自己决定请求方法、params 和 body。
 */
export function download(
	url: string,
	method: Method,
	data?: unknown,
	params?: unknown,
	loading?: RequestLoading,
): Promise<Result<Blob>> {
	return promise<Blob>(request({ url, method, data, params, responseType: "blob" }), loading);
}
