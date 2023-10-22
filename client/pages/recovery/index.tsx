import React from 'react';
import Head from 'next/head';
import RecoveryForm from '../../components/pages/auth/recovery/RecoveryForm';
import AuthLayout from '../../components/pages/auth/components/AuthLayout';

const Recovery = () => {
	return (
		<>
			<Head>
				<title>Восстановление аккаунта</title>
				<meta name='description' content='Восстановление аккаунта' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main>
				<AuthLayout sideImgUrl='/images/utility/passRecoveryImg.svg'>
					<RecoveryForm />
				</AuthLayout>
			</main>
		</>
	);
};

export default Recovery;
