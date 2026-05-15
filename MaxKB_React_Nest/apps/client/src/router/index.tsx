import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { setupRouteProgress } from "./progress";
import { routes } from "./routes";

export const router = createBrowserRouter(routes, {
	basename: "/admin",
});

setupRouteProgress(router);

export function AppRouter() {
	return <RouterProvider router={router} />;
}
