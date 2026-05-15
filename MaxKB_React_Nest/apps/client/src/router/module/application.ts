import type { RouteObject } from "react-router-dom";
import { lazyRoute } from "../lazyRoute";

const applicationRoute: RouteObject = {
	path: "application",
	handle: {
		title: "views.application.title",
		menu: true,
		icon: "app-agent",
		iconActive: "app-agent-active",
		group: "workspace",
		order: 1,
	},
	lazy: lazyRoute(() => import("@/layout/layout-template/SimpleLayout")),
	children: [
		{
			index: true,
			handle: {
				title: "Application",
				activeMenu: "/application",
				sameRoute: "application",
			},
			lazy: lazyRoute(() => import("@/views/application")),
		},
	],
};

export default applicationRoute;
