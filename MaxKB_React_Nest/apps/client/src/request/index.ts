import { message } from 'antd';
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { router } from '@/router';
export { promise, type RequestLoading } from './promise';
export * from './method/get';
export * from './method/post';
export * from './method/put';
export * from './method/delete';
export * from './method/download';
export * from './method/socket';

const axiosConfig = {
	baseURL: (window.MaxKB?.prefix ? window.MaxKB?.prefix : '/admin') + '/api',
	withCredentials: false,
	timeout: 1800000, // 30分钟 timeout
	headers: {},
};

const instance = axios.create(axiosConfig);

/* 设置请求拦截器 */
instance.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		if (config.headers === undefined) {
			config.headers = new AxiosHeaders();
		}
		if (config.url && config.url.startsWith('http')) {
			return config;
		}

		// TODO: 后续 store 优化

		// const { user, login } = useStore()
		// const token = login.getToken()
		// const language = user.getLanguage()

		const token = '';
		const language = 'zh-CN';
		config.headers['Accept-Language'] = `${language}`;
		if (token) {
			config.headers['AUTHORIZATION'] = `Bearer ${token}`;
		}
		return config;
	},
	(err: any) => {
		return Promise.reject(err);
	},
);

/* 设置响应拦截器 */
instance.interceptors.response.use(
	(response: any) => {
		if (response.data) {
			if (response.data.code !== 200 && !(response.data instanceof Blob)) {
				if (response.config.url.includes('/application/authentication')) {
					return Promise.reject(response.data);
				}
				if (
					!response.config.url.includes('/valid') &&
					!response.config.url.includes('/tool/debug')
				) {
					message.error(response.data.message);
					return Promise.reject(response.data);
				}
			}
		}
		return response;
	},
	(err: any) => {
		if (err.code === 'ECONNABORTED') {
			message.error(err.message);
			console.error(err);
		}
		if (err.response?.status === 404) {
			if (!err.response.config.url.includes('/application/authentication')) {
				router.navigate('/404');
			}
		}
		if (err.response?.status === 401) {
			if (
				!err.response.config.url.includes('chat/open') &&
				!err.response.config.url.includes('application/profile')
			) {
				router.navigate('/login');
			}
		}

		if (err.response?.status === 403 && !err.response.config.url.includes('chat/open')) {
			message.error(
				err.response.data && err.response.data.message
					? err.response.data.message
					: 'No permission to access',
			);
		}
		return Promise.reject(err);
	},
);
export const request = instance;

export default instance;
