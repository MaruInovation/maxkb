import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import styles from "./styles/index.module.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<div className={styles.appRoot}>
			<App />
		</div>
	</StrictMode>,
);
