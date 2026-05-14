import { defineConfig, loadEnv, type ConfigEnv, type ProxyOptions } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { createHtmlPlugin } from "vite-plugin-html";
import getProxyConfig from "./vite/getProxyConfig";
import renameHtmlPlugin from "./vite/renameHtmlPlugin";

const envDir = "./env";

function resolvePath(relativePath: string): string {
	const pathname = new URL(relativePath, import.meta.url).pathname;
	const decodedPath = decodeURIComponent(pathname);

	return decodedPath.replace(/^\/([A-Za-z]:)/, "$1");
}

// https://vite.dev/config/
export default defineConfig((config: ConfigEnv) => {
	const mode = config.mode;
	const env = loadEnv(mode, envDir);

	const proxyConf: Record<string, string | ProxyOptions> = getProxyConfig(env);

	return {
		base: "./",
		envDir,
		plugins: [
			react(),
			babel({ presets: [reactCompilerPreset()] }),
			createHtmlPlugin({ template: env.VITE_ENTRY }),
			renameHtmlPlugin(`dist${env.VITE_BASE_PATH}`, env.VITE_ENTRY),
		],
		server: {
			cors: true,
			host: "0.0.0.0",
			port: Number(env.VITE_APP_PORT),
			strictPort: true,
			proxy: proxyConf,
		},
		build: {
			outDir: `dist${env.VITE_BASE_PATH}`,
			target: "es2022",
			rollupOptions: {
				input: env.VITE_ENTRY,
			},
		},
		resolve: {
			alias: {
				"@": resolvePath("./src"),
			},
		},
	};
});
