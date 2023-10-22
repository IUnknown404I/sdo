import Head from 'next/head';
import AuthLayout from '../../components/pages/auth/components/AuthLayout';
import PasswordRewriteForm from '../../components/pages/auth/recovery/PasswordRewriteForm';

const PasswordRewrite = () => {
	return (
		<>
			<Head>
				<title>Новый пароль</title>
				<meta name='description' content='Восстановление аккаунта - новый пароль' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main>
				<AuthLayout sideImgUrl='/images/utility/recoveryPass.svg'>
					<PasswordRewriteForm />
				</AuthLayout>
			</main>
		</>
	);
};

export default PasswordRewrite;
