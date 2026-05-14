import styles from "@/styles/index.module.css";
import { AppProviders } from "./AppProviders";
import { AppRouter } from "@/router";

export function AppRoot() {
	return (
		<AppProviders>
			<div className={styles.appRoot}>
				<AppRouter />
			</div>
		</AppProviders>
	);
}
