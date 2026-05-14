import { existsSync, renameSync, rmSync } from "node:fs";
import type { Plugin } from "vite";

function resolveBuildFile(outDir: string, fileName: string): string {
	return `${import.meta.dir}/../${outDir}/${fileName}`;
}

async function renameFile(oldFile: string, newFile: string): Promise<void> {
	if (typeof Bun !== "undefined") {
		const entryFile = Bun.file(oldFile);

		if (!(await entryFile.exists())) {
			return;
		}

		await Bun.write(newFile, entryFile);
		await Bun.$`rm -f ${oldFile}`;
		return;
	}

	if (!existsSync(oldFile)) {
		return;
	}

	rmSync(newFile, { force: true });
	renameSync(oldFile, newFile);
}

export default function renameHtmlPlugin(outDir: string, entry: string): Plugin {
	return {
		name: "rename-html",
		closeBundle: async () => {
			await renameFile(
				resolveBuildFile(outDir, entry),
				resolveBuildFile(outDir, "index.html"),
			);
		},
	};
}
