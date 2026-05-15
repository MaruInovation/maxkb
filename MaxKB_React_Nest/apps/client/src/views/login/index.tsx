import { Button, Form, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useLoginStore } from '@/stores/login';
import type { LoginRequest } from '@maxkb/types/login.type';

export default function Login() {
	const asyncLogin = useLoginStore((state) => state.asyncLogin);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginRequest>({
		defaultValues: {
			username: 'qiang11.li',
			password: 'MaxKB@123...',
		},
	});

	const loginMutation = useMutation({
		// TODO: 这是暂时的方案，先传明文
		mutationFn: loginHandle,
		onSuccess: () => {
			console.log('请求成功');
			// locale.value = localStorage.getItem('MaxKB-locale') || getBrowserLang() || 'en-US'
			// router.push({ name: 'home' })
		},
		onError: (error) => {
			console.log('请求失败', error);
		},
		onSettled: () => {
			console.log('请求结束');
		},
	});

	const onSubmit = handleSubmit((values) => {
		loginMutation.mutate(values);
	});

	async function loginHandle(value: LoginRequest) {
		// TODO: loginMode
		return asyncLogin(value);
	}

	return (
		<div>
			<Form
				name="basic"
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				style={{ maxWidth: 600 }}
				autoComplete="off"
				onFinish={onSubmit}
			>
				<Form.Item
					label="Username"
					validateStatus={errors.username ? 'error' : undefined}
					help={errors.username?.message}
				>
					<Controller
						name="username"
						control={control}
						rules={{ required: 'Please input your username!' }}
						render={({ field }) => <Input {...field} />}
					/>
				</Form.Item>

				<Form.Item
					label="Password"
					validateStatus={errors.password ? 'error' : undefined}
					help={errors.password?.message}
				>
					<Controller
						name="password"
						control={control}
						rules={{ required: 'Please input your password!' }}
						render={({ field }) => <Input.Password {...field} />}
					/>
				</Form.Item>

				<Form.Item label={null}>
					<Button type="primary" htmlType="submit" loading={loginMutation.isPending}>
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}
