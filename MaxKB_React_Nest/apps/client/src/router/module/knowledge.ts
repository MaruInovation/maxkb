import type { RouteObject } from "react-router-dom";
import { lazyRoute } from "../lazyRoute";

const knowledgeRoute: RouteObject = {
	path: "knowledge",
	handle: {
		title: "Knowledge",
		menu: true,
		icon: "app-knowledge",
		order: 2,
	},
	lazy: lazyRoute(() => import("@/views/knowledge")),
};

export default knowledgeRoute;
