import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Head from 'next/head';
import OnyxLink from '../../components/basics/OnyxLink';
import AuthBoxHeader from '../../components/pages/auth/components/AuthBoxHeader';
import ErrorLayout from '../../components/pages/auth/components/ErrorLayout';

const ChangingError = () => {
	return (
		<>
			<Head>
				<title>Ошибка изменения</title>
				<meta name='description' content='Ошибка изменения учетной записи' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main>
				<ErrorLayout
					footer={
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
						</Paper>
					}
				>
					<AuthBoxHeader>
						<Typography variant='h1' fontWeight='bold' fontSize='2rem' color='primary' align='center'>
							ОШИБКА
						</Typography>

						<img src='/icons/lock_error.svg' alt='Changing error' width={75} height={75} />
					</AuthBoxHeader>

					<Divider sx={{ margin: '.25rem 0 1rem' }} />
					<Typography variant='body2' fontSize='1.25rem' fontWeight='bold' align='left'>
						Не удалось изменить личные данные учетной записи!
					</Typography>
					<Typography variant='body1' fontSize='1.25rem' align='left' marginTop='.5rem'>
						Изменение можно внести в течении 1 часа с момента получения уведомления на соответственную
						электронную почту.
						<br />
						Оформите заявку повторно или свяжитесь с технической поддержкой, если слокнулись с трудностями.
					</Typography>
				</ErrorLayout>
			</main>
		</>
	);
};

export default ChangingError;
