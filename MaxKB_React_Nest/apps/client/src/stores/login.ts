import { create } from 'zustand';
import type { LoginRequest } from '@maxkb/types/login.type';
import { login, ldapLogin } from '@/api/user/login';
import { useUserStore } from './user';

type LoginStore = {
	token: string;
	getToken: () => string | null;
	setToken: (token: string) => void;
	asyncLogin: (data: LoginRequest) => Promise<unknown>;
	asyncLdapLogin: (data: LoginRequest) => Promise<unknown>;
	logout: () => Promise<boolean>;
};

export const useLoginStore = create<LoginStore>((set, get) => ({
	token: '',

	getToken: () => {
		const token = get().token;

		if (token) {
			return token;
		}

		return localStorage.getItem('token');
	},

	setToken: (token) => {
		set({ token });
		localStorage.setItem('token', token);
	},

	asyncLogin: async (data) => {
		const res = await login(data);
		const token = res?.data?.token;

		if (token) {
			get().setToken(token);
		}

		return useUserStore.getState().profile();
	},

	asyncLdapLogin: async (data) => {
		const res = await ldapLogin(data);
		const token = res?.data?.token;

		if (token) {
			get().setToken(token);
		}

		return res;
	},

	logout: async () => {
		set({ token: '' });
		localStorage.removeItem('token');
		return true;
	},
}));
