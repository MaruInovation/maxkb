/**
 * 与服务器建立 WebSocket 连接。
 */
export function socket(url: string): WebSocket {
	let protocol = "ws://";
	if (window.location.protocol === "https:") {
		protocol = "wss://";
	}

	if (!import.meta.env.DEV) {
		return new WebSocket(
			protocol + window.location.host + import.meta.env.VITE_BASE_PATH + url,
		);
	}

	return new WebSocket(protocol + window.location.host + url);
}
