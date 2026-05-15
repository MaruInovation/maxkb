import { get, post, type RequestLoading } from '@/request';
import type Result from '@/request/Result';
import type { LoginRequest } from '@maxkb/types/login.type';

export type LoginMode = 'LOCAL' | 'LDAP';

export type LoginApiRequest = Partial<LoginRequest> &
	Pick<LoginRequest, 'username'> & {
		loginMode?: LoginMode;
		rsaKey?: string;
		encrypt?: (request: LoginRequest, rsaKey: string) => string | false;
	};

/**
 * 登录
 * @param request 登录接口请求表单
 * @param loading 接口加载器
 * @returns 认证数据
 */
export const login: (request: LoginRequest, loading?: RequestLoading) => Promise<Result<any>> = (
	request,
	loading,
) => {
	return post('/user/login', request, undefined, loading);
};

/**
 * LDAP 登录
 * @param request 登录接口请求表单
 * @param loading 接口加载器
 * @returns 认证数据
 */
export const ldapLogin: (
	request: LoginRequest,
	loading?: RequestLoading,
) => Promise<Result<any>> = (request, loading) => {
	return post('/ldap/login', request, undefined, loading);
};

/**
 * 获取验证码
 * @param username 用户名
 * @param loading 接口加载器
 */
export const getCaptcha: (username?: string, loading?: RequestLoading) => Promise<Result<any>> = (
	username,
	loading,
) => {
	return get('/user/captcha', { username }, loading);
};

/**
 * 登录业务编排函数，给 React Query 的 mutationFn 使用。
 *
 * - LDAP 模式：直接提交完整表单。
 * - LOCAL 模式：如果传入 rsaKey 和 encrypt，则先生成 encryptedData，再只提交 encryptedData 与 username。
 * - 当前阶段不在这里处理路由跳转、验证码刷新、workspace 写入，这些属于页面副作用。
 */
export function loginApi(request: LoginApiRequest): Promise<Result<any>> {
	const { loginMode = 'LOCAL', rsaKey, encrypt, ...loginForm } = request;
	const normalizedLoginForm: LoginRequest = {
		username: loginForm.username,
		password: loginForm.password || '',
		captcha: loginForm.captcha || '',
		encryptedData: loginForm.encryptedData,
	};

	if (loginMode === 'LDAP') {
		return ldapLogin(normalizedLoginForm);
	}

	if (rsaKey && encrypt) {
		const encryptedData = encrypt(normalizedLoginForm, rsaKey);
		return login({
			username: normalizedLoginForm.username,
			encryptedData: encryptedData || undefined,
			password: '',
			captcha: '',
		});
	}

	return login(normalizedLoginForm);
}
