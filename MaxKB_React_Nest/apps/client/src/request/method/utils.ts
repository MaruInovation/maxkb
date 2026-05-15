import { message } from "antd";

export function downloadBlob(blob: Blob, fileName: string): void {
	const link = document.createElement("a");
	link.href = window.URL.createObjectURL(blob);
	link.download = fileName;
	link.click();
	window.URL.revokeObjectURL(link.href);
}

export function extractFilename(contentDisposition: string): string | null {
	if (!contentDisposition) {
		return null;
	}

	const urlEncodedMatch =
		contentDisposition.match(/filename=([^;]*)/i) ||
		contentDisposition.match(/filename\*=UTF-8''([^;]*)/i);
	if (urlEncodedMatch && urlEncodedMatch[1]) {
		try {
			return decodeURIComponent(urlEncodedMatch[1].replace(/"/g, ""));
		} catch (error) {
			console.error("解码 URL 编码文件名失败:", error);
		}
	}

	const base64Part = contentDisposition.match(/=\?utf-8\?b\?(.*?)\?=/i)?.[1];
	if (base64Part) {
		try {
			const decoded = decodeURIComponent(escape(atob(base64Part)));
			const filenameMatch = decoded.match(/filename="(.*?)"/i);
			return filenameMatch ? filenameMatch[1] : null;
		} catch (error) {
			console.error("解码 Base64 文件名失败:", error);
		}
	}

	return null;
}

export function transformFileResponse(data: Blob): Blob {
	if (data.type === "application/json") {
		data.text().then((text) => {
			try {
				const json = JSON.parse(text);
				message.error(json.message || text);
			} catch {
				message.error(text);
			}
		});
		throw new Error("Response is not a valid file");
	}

	return data;
}
