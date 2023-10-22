import Head from 'next/head';
import AuthLayout from '../components/pages/auth/components/AuthLayout';
import LoginForm from '../components/pages/auth/login/LoginForm';

const LoginPage = () => {
	return (
		<>
			<Head>
				<title>Вход в систему</title>
				<meta name='description' content='Вход в систему' />
				<meta name='robots' content='index, follow' />
			</Head>

			<main>
				<AuthLayout sideImgUrl='/images/utility/loginImg.svg'>
					<LoginForm />
				</AuthLayout>
			</main>
		</>
	);
};

export default LoginPage;
