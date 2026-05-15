import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { authGuardLoader } from "./guard";
import { lazyRoute } from "./lazyRoute";

const modules = import.meta.glob<{ default: RouteObject }>("./module/*.ts", {
	eager: true,
});

const moduleRoutes = Object.values(modules).map((module) => module.default);

export const routes: RouteObject[] = [
	{
		path: "/login",
		lazy: lazyRoute(() => import("@/views/login")),
	},
	{
		path: "/",
		loader: authGuardLoader,
		children: [
			{
				index: true,
				element: <Navigate to="/application" replace />,
			},
			...moduleRoutes,
		],
	},
	{
		path: "*",
		lazy: lazyRoute(() => import("@/views/error/NotFound")),
	},
];
