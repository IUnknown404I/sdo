import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Head from 'next/head';
import OnyxLink from '../../components/basics/OnyxLink';
import AuthBoxHeader from '../../components/pages/auth/components/AuthBoxHeader';
import ErrorLayout from '../../components/pages/auth/components/ErrorLayout';

const RecoveryError = () => {
	return (
		<>
			<Head>
				<title>Ошибка восстановления</title>
				<meta name='description' content='Ошибка восстановления пароля' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main>
				<ErrorLayout
					footer={[
						<Paper key='footer-1' elevation={5} sx={{ width: '100%' }}>
							<OnyxLink href='/login' blockElement>
								<Button
									color='primary'
									variant='outlined'
									fullWidth
									sx={{ fontSize: '1.1rem', padding: '.5rem 2.05rem' }}
								>
									Вход в систему
								</Button>
							</OnyxLink>
						</Paper>,
						<Paper key='footer-2' elevation={5} sx={{ width: '100%' }}>
							<OnyxLink href='/recovery' blockElement>
								<Button
									color='primary'
									variant='contained'
									fullWidth
									sx={{ fontSize: '1.1rem', padding: '.5rem' }}
								>
									Восстановить доступ
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
						Ключ восстановления учётной записи неактивен!
					</Typography>
					<Typography variant='body1' fontSize='1.25rem' align='left' marginTop='.5rem'>
						Запрашиваемая операция по восстановлению доступа не может быть выполнена, так как предоставлен
						некорректный уникальный код.
					</Typography>
					<Typography variant='body1' fontSize='1.25rem' align='left' marginTop='.5rem'>
						Чтобы получить свой ключ восстановления, перейдите на страницу восстановления доступа и укажите
						данные от своего аккаунта в системе.{' '}
						<strong>Персональный ключ будет выслан в ответном письме</strong>.
					</Typography>
				</ErrorLayout>
			</main>
		</>
	);
};

export default RecoveryError;
