import type { RouteObject } from "react-router-dom";

type LazyRouteComponent = RouteObject["lazy"];

export function lazyRoute(
	importer: () => Promise<{ default: React.ComponentType }>,
): LazyRouteComponent {
	return async () => {
		const { default: Component } = await importer();
		return { Component };
	};
}
