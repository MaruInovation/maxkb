import { Result } from '@/request/Result';
import { get, post } from '@/request';
import type { User } from '@maxkb/types/user.type';

/**
 * 获取profile
 */
export const getProfile: () => Promise<Result<any>> = () => {
	return get('/profile');
};

/**
 * 获取用户基本信息
 * @param loading 接口加载器
 * @returns 用户基本信息
 */
export const getUserProfile: () => Promise<Result<User>> = () => {
	return get('/user/profile');
};
