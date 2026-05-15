import type { RouteObject } from "react-router-dom";
import { lazyRoute } from "../lazyRoute";

const applicationDetailRoute: RouteObject = {
	path: "application/:from/:id/:type",
	handle: {
		title: "Application Detail",
		activeMenu: "/application",
		hidden: true,
	},
	lazy: lazyRoute(() => import("@/views/application-detail")),
	children: [
		{
			index: true,
			lazy: lazyRoute(() => import("@/views/application-detail/overview")),
		},
	],
};

export default applicationDetailRoute;
