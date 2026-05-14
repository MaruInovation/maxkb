import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "../App";

export function AppRouter() {
	return (
		<BrowserRouter basename="/admin">
			<Routes>
				<Route path="/" element={<App />} />
			</Routes>
		</BrowserRouter>
	);
}
