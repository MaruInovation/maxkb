import { Outlet } from "react-router-dom";

export default function SimpleLayout() {
	return (
		<div>
			SimpleLayout
			<Outlet />
		</div>
	);
}
