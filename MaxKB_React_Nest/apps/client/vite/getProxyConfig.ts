import type { ProxyOptions } from "vite";

type ViteEnv = Record<string, string>;

export default function getProxyConfig(env: ViteEnv): Record<string, string | ProxyOptions> {
	const proxyConf: Record<string, string | ProxyOptions> = {};
	const apiTarget = env.VITE_API_TEST_URL;

	proxyConf["/admin/api"] = {
		target: apiTarget,
		changeOrigin: true,
	};
	proxyConf["/chat/api"] = {
		target: apiTarget,
		changeOrigin: true,
	};
	proxyConf["/doc"] = {
		target: apiTarget,
		changeOrigin: true,
		rewrite: (path: string) => path.replace(env.VITE_BASE_PATH, "/"),
	};
	proxyConf["/schema"] = {
		target: apiTarget,
		changeOrigin: true,
		rewrite: (path: string) => path.replace(env.VITE_BASE_PATH, "/"),
	};
	proxyConf["/static"] = {
		target: apiTarget,
		changeOrigin: true,
		rewrite: (path: string) => path.replace(env.VITE_BASE_PATH, "/"),
	};

	proxyConf[`^${env.VITE_BASE_PATH}.+/oss/file/.*$`] = {
		target: apiTarget,
		changeOrigin: true,
	};
	proxyConf[`^${env.VITE_BASE_PATH}oss/file/.*$`] = {
		target: apiTarget,
		changeOrigin: true,
	};
	proxyConf[`^${env.VITE_BASE_PATH}oss/get_url/.*$`] = {
		target: apiTarget,
		changeOrigin: true,
	};
	proxyConf[env.VITE_BASE_PATH] = {
		target: `http://127.0.0.1:${env.VITE_APP_PORT}`,
		changeOrigin: true,
		rewrite: (path: string) => path.replace(env.VITE_BASE_PATH, "/"),
	};

	return proxyConf;
}
