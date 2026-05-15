import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AppSidelay from "@/layout/layout-template/AppSidelay";
import { authGuardLoader } from "./guard";
import { lazyRoute } from "./lazyRoute";

const modules = import.meta.glob<{ default: RouteObject }>("./module/*.ts", {
	eager: true,
});

const moduleRoutes = Object.values(modules).map((module) => module.default);

export const routes: RouteObject[] = [
	{
		path: "/",
		loader: authGuardLoader,
		element: <AppSidelay />,
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
	{
		path: "/login",
		lazy: lazyRoute(() => import("@/views/login")),
	},
];
