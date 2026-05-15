import { Button } from "antd";

export default function Login() {
	return (
		<div>
			<Button
				type="primary"
				onClick={() => {
					localStorage.setItem("token", "fake-token");
					window.location.href = "/";
				}}
			>
				Login
			</Button>
		</div>
	);
}
