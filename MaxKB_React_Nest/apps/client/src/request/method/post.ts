import request from "../index";
import { promise, type RequestLoading } from "../promise";
import type Result from "../Result";
import { downloadBlob, extractFilename, transformFileResponse } from "./utils";

/**
 * 发送 POST 请求，一般用于创建资源或提交复杂条件。
 */
export function post<T = any>(
	url: string,
	data?: unknown,
	params?: unknown,
	loading?: RequestLoading,
	timeout?: number,
): Promise<Result<T>> {
	return promise<T>(request({ url, method: "post", data, params, timeout }), loading);
}

/**
 * 发送流式 POST 请求。
 *
 * 这里保留 fetch，是因为流式响应通常不能完全交给 axios 的响应拦截器处理。
 */
export function postStream(url: string, data?: unknown): Promise<Response> {
	const token = "";
	const language = "zh-CN";
	const headers: HeadersInit = { "Content-Type": "application/json" };
	if (token) {
		headers["AUTHORIZATION"] = `Bearer ${token}`;
	}
	headers["Accept-Language"] = `${language}`;
	return fetch(url, {
		method: "POST",
		body: data ? JSON.stringify(data) : undefined,
		headers,
	});
}

/**
 * POST 导出 Excel 文件。
 */
export function exportExcelPost(
	fileName: string,
	url: string,
	params: unknown,
	data: unknown,
	loading?: RequestLoading,
): Promise<boolean> {
	return promise<Blob>(
		request({
			url,
			method: "post",
			params,
			data,
			responseType: "blob",
		}),
		loading,
	).then((res: any) => {
		if (res) {
			downloadBlob(
				new Blob([res], {
					type: "application/vnd.ms-excel",
				}),
				fileName,
			);
		}
		return true;
	});
}

/**
 * POST 导出通用文件，并优先读取响应头里的真实文件名。
 */
export function exportFilePost(
	fileName: string,
	url: string,
	params: unknown,
	data: unknown,
	loading?: RequestLoading,
): Promise<boolean | void> {
	return promise<Blob>(
		request({
			url,
			method: "post",
			params,
			data,
			responseType: "blob",
			transformResponse: [
				(responseData: Blob, headers: Record<string, string>) => {
					const contentDisposition = headers["content-disposition"];
					fileName = extractFilename(contentDisposition) || fileName;
					return transformFileResponse(responseData);
				},
			],
		}),
		loading,
	)
		.then((res: any) => {
			if (res) {
				downloadBlob(
					new Blob([res], {
						type: "application/octet-stream",
					}),
					fileName,
				);
			}
			return true;
		})
		.catch(() => {});
}
