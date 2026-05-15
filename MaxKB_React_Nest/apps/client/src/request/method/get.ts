import request from "../index";
import { promise, type RequestLoading } from "../promise";
import type Result from "../Result";
import { downloadBlob, extractFilename, transformFileResponse } from "./utils";

/**
 * 发送 GET 请求，一般用于读取资源。
 */
export function get<T = any>(
	url: string,
	params?: unknown,
	loading?: RequestLoading,
	timeout?: number,
): Promise<Result<T>> {
	return promise<T>(request({ url, method: "get", params, timeout }), loading);
}

/**
 * GET 导出 Excel 文件。后端直接返回 blob，前端负责触发浏览器下载。
 */
export function exportExcel(
	fileName: string,
	url: string,
	params: unknown,
	loading?: RequestLoading,
): Promise<boolean> {
	return promise<Blob>(
		request({ url, method: "get", params, responseType: "blob" }),
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
 * GET 导出通用文件，并优先读取响应头里的真实文件名。
 */
export function exportFile(
	fileName: string,
	url: string,
	params: unknown,
	loading?: RequestLoading,
): Promise<boolean | void> {
	return promise<Blob>(
		request({
			url,
			method: "get",
			params,
			responseType: "blob",
			transformResponse: [
				(data: Blob, headers: Record<string, string>) => {
					const contentDisposition = headers["content-disposition"];
					fileName = extractFilename(contentDisposition) || fileName;
					return transformFileResponse(data);
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
