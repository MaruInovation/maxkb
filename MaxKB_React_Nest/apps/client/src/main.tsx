import { createRoot } from "react-dom/client";
import { AppRoot } from "@/app/AppRoot";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("admin.html下的root节点未找到");
}

createRoot(rootElement).render(<AppRoot />);
