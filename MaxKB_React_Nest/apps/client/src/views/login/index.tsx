import { Button, Form, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { loginApi } from '@/api/user/login';

type FieldType = {
	username: string;
	password?: string;
	captcha?: string;
};

export default function Login() {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldType>({
		defaultValues: {
			username: 'qiang11.li',
			password: 'MaxKB@123...',
			captcha: '',
		},
	});

	const loginMutation = useMutation({
		// TODO: 这是暂时的方案，先传明文
		mutationFn: (values: FieldType) => loginApi(values),
		onSuccess: () => {
			console.log('请求成功');
			localStorage.setItem('workspace_id', 'default');

			// navigate("/application");
		},
	});

	const onSubmit = handleSubmit((values) => {
		loginMutation.mutate(values);
	});

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
