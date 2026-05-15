import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";

const router = createBrowserRouter(routes, {
	basename: "/admin",
});

export function AppRouter() {
	return <RouterProvider router={router} />;
}
