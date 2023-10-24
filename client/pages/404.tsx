import { Button, Divider, Paper, Typography } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import OnyxLink from '../components/basics/OnyxLink';
import AuthBoxHeader from '../components/pages/auth/components/AuthBoxHeader';
import ErrorLayout from '../components/pages/auth/components/ErrorLayout';

const Error404Page = () => {
	const router = useRouter();

	return (
		<>
			<Head>
				<title>Не найдено</title>
				<meta name='description' content='Страницы не существует' />
			</Head>

			<main>
				<ErrorLayout
					footer={[
						<Paper key='footer-1' elevation={5} sx={{ width: '60%' }}>
							<Button
								color='primary'
								variant='outlined'
								fullWidth
								sx={{ fontSize: '1.1rem', padding: '.5rem 2.05rem' }}
								onClick={() => router.back()}
							>
								Назад
							</Button>
						</Paper>,
						<Paper key='footer-2' elevation={5} sx={{ width: '100%' }}>
							<OnyxLink href='/' blockElement>
								<Button
									color='primary'
									variant='contained'
									fullWidth
									sx={{ fontSize: '1.1rem', padding: '.5rem' }}
								>
									войти в систему
								</Button>
							</OnyxLink>
						</Paper>,
					]}
				>
					<AuthBoxHeader>
						<Typography variant='h1' fontWeight='bold' fontSize='2rem' color='primary' align='left'>
							СТРАНИЦА НЕ НАЙДЕНА
						</Typography>
						<img src='/icons/lock_error.svg' alt='Not found error icon' width={75} height={75} />
					</AuthBoxHeader>
					<Divider sx={{ margin: '.25rem 0 1rem' }} />

					<Typography variant='body2' fontSize='1.25rem' align='left'>
						Веб-ресурс по запрошенному адресу не найден!
					</Typography>
					<Typography variant='body1' fontSize='1.25rem' align='left' marginTop='.5rem'>
						Вы перешли на веб-адрес страницы <strong>системы дистанционного обучения</strong>&nbsp;
						научно-образовательного центра ООО &quot;Газпром межрегионгаз инжиниринг&quot;.
					</Typography>

					<Divider sx={{ marginTop: '.75rem' }} />
					<Typography variant='body1' fontSize='1.25rem' align='left' marginTop='.5rem'>
						<strong>Войдите в систему</strong> для поиска искомой информации или вернитесь назад по истории
						просмотра.
					</Typography>
				</ErrorLayout>
			</main>
		</>
	);
};

export default Error404Page;
