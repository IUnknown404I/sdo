import Head from 'next/head';
import AuthLayout from '../../components/pages/auth/components/AuthLayout';
import RegistrationForm from '../../components/pages/auth/registration/RegistrationForm';

const RegistrationPage = () => {
	return (
		<>
			<Head>
				<title>Регистрация в образовательной системе</title>
				<meta name='description' content='Регистрация в образовательной системе' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main>
				<AuthLayout sideImgUrl='/images/utility/registryImg.svg'>
					<RegistrationForm />
				</AuthLayout>
			</main>
		</>
	);
};

export default RegistrationPage;
