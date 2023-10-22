import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Head from 'next/head';
import OnyxLink from '../../components/basics/OnyxLink';
import AuthBoxHeader from '../../components/pages/auth/components/AuthBoxHeader';
import ErrorLayout from '../../components/pages/auth/components/ErrorLayout';

const ActivationError = () => {
	return (
		<>
			<Head>
				<title>Ошибка активации</title>
				<meta name='description' content='Ошибка активации учетной записи' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main>
				<ErrorLayout
					footer={[
						<Paper key='footer-1' elevation={5} sx={{ width: '100%', height: '100%' }}>
							<OnyxLink href='/registration' blockElement>
								<Button
									color='primary'
									variant='outlined'
									fullWidth
									sx={{
										fontSize: '1.1rem',
										padding: '.5rem',
										height: '100%',
										'@media screen and (max-width: 332px)': { height: '77.56px' },
									}}
								>
									Регистрация
								</Button>
							</OnyxLink>
						</Paper>,
						<Paper key='footer-2' elevation={5} sx={{ width: '100%', height: '100%' }}>
							<OnyxLink href='/login' blockElement>
								<Button
									color='primary'
									variant='contained'
									fullWidth
									sx={{ fontSize: '1.1rem', padding: '.5rem', height: '100%' }}
								>
									Вход в систему
								</Button>
							</OnyxLink>
						</Paper>,
					]}
				>
					<AuthBoxHeader>
						<Typography variant='h1' fontWeight='bold' fontSize='2rem' color='primary' align='center'>
							ОШИБКА
						</Typography>

						<img src='/icons/lock_error.svg' alt='Email token error' width={75} height={75} />
					</AuthBoxHeader>

					<Divider sx={{ margin: '.25rem 0 1rem' }} />
					<Typography variant='body2' fontSize='1.25rem' fontWeight='bold' align='left'>
						Ключ активации учётной записи неактивен!
					</Typography>
					<Typography variant='body1' fontSize='1.25rem' align='left' marginTop='.5rem'>
						Вам необходимо обратиться в техническую поддержку или зарегистрировать новый аккаунт в системе и
						подтвердить его в течении 72 часов с момента получения.
					</Typography>
				</ErrorLayout>
			</main>
		</>
	);
};

export default ActivationError;
