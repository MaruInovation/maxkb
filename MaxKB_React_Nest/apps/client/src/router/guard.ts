import { redirect, type LoaderFunctionArgs } from "react-router-dom";

const TOKEN_KEY = "token";

function saveTokenFromQuery(request: Request): void {
	const url = new URL(request.url);
	const token = url.searchParams.get(TOKEN_KEY);

	if (token) {
		localStorage.setItem(TOKEN_KEY, token);
	}
}

function hasToken(): boolean {
	return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function authGuardLoader({ request }: LoaderFunctionArgs) {
	saveTokenFromQuery(request);

	if (!hasToken()) {
		throw redirect("/login");
	}

	return null;
}
