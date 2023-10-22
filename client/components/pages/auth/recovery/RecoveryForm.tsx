import { TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import {useFormik} from 'formik';
import React from 'react';
import * as yup from 'yup';
import useLoading from '../../../../hooks/useLoading';
import { useTypedSelector } from '../../../../redux/hooks';
import { selectAxiosInstance } from '../../../../redux/slices/axiosInstance';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import { errorMessage, notification } from '../../../utils/notifications/Notification';
import AuthBoxHeader from '../components/AuthBoxHeader';
import AuthFormLayout from '../components/AuthFormLayout';
import AuthModal from '../components/AuthModal';
import { InvisibleLabel } from '../../../utils/components/InvLabel';

const RecoveryForm = () => {
	const theme = useTheme();
	const axiosInstance = useTypedSelector(state => selectAxiosInstance(state));
	const [state, setState] = React.useState<boolean>(false);
	const { Loader, state: loadingState, setState: setLoadingState } = useLoading({ iconVariant: true });

	const recoveryValidationSchema = yup.object({
		username: yup
			.string()
			.trim()
			.matches(
				/^[a-zA-Z]+(-[a-zA-Z0-9]+)*$/i,
				'Логин содержит только латиницу, начинается с буквы! Можно после дефиса использовать числа (прим. user-1sub).',
			)
			.min(5, 'Минимальная длина логина 5 символов!')
			.max(64, 'Достигнута максимальная длина.')
			.required('Необходимо ввести имя пользователя!'),
		email: yup
			.string()
			.email('Некорректно введена электронная почта!')
			.min(6, 'Минимальная длина электронной почты 6 символов!')
			.max(64, 'Достигнута максимальная длина.')
			.required('Необходимо ввести электронную почту!'),
	});

	const formik = useFormik({
		initialValues: {
			username: '',
			email: '',
		},
		validationSchema: recoveryValidationSchema,
		onSubmit: values => {
			setLoadingState(true);
			axiosInstance
				.post(`${process.env.NEXT_PUBLIC_SERVER}/users/recovery`, { ...values })
				.then(() => {
					notification({
						message: 'Заявка успешно отправлена! Проверьте Вашу почту.',
						type: 'success',
						autoClose: 6000,
						theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
					});
					setState(true);
					formik.resetForm();
				})
				.catch((err: any) => {
					notification({
						message:
							errorMessage(err) || 'Не удалось отправить заявку! Проверьте данные и попробуйте снова.',
						type: 'error',
						autoClose: 4000,
						theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
					});
				})
				.finally(() => setLoadingState(false));
		},
	});

	return (
		<AuthFormLayout submitFunction={formik.handleSubmit}>
			<>
				<AuthBoxHeader>
					<Typography variant='h2' fontWeight='bold' fontSize='2rem' color='primary' align='left'>
						ВОССТАНОВЛЕНИЕ
					</Typography>

					<img src='/icons/recoveryIcon.svg' alt='Recovery' width={75} height={75} />
				</AuthBoxHeader>

				<InvisibleLabel htmlFor='username' />
				<TextField
					disabled={loadingState}
					fullWidth
					id='username'
					name='username'
					label='Введите логин*'
					value={formik.values.username}
					onChange={formik.handleChange}
					error={formik.touched.username && Boolean(formik.errors.username)}
					helperText={formik.touched.username && formik.errors.username}
				/>
				<Typography
					variant='body1'
					fontSize='1rem'
					color='gray'
					align='left'
					marginTop='-.25rem'
					marginBottom='-.35rem'
				>
					После формирования заявки Вам на почту будет отправлено письмо для подтверждения смены пароля.
				</Typography>

				<InvisibleLabel htmlFor='email' />
				<TextField
					disabled={loadingState}
					fullWidth
					id='email'
					name='email'
					label='Укажите электронную почту*'
					type='email'
					value={formik.values.email}
					onChange={formik.handleChange}
					error={formik.touched.email && Boolean(formik.errors.email)}
					helperText={formik.touched.email && formik.errors.email}
				/>

				<Button
					disabled={loadingState}
					color='primary'
					variant='contained'
					fullWidth
					type='submit'
					sx={{
						fontSize: '1.1rem',
						marginBottom: '1.25rem',
						marginTop: '-.5rem',
					}}
				>
					Отправить заявку
					{Loader}
				</Button>

				<Divider />
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
					}}
				>
					<OnyxTypography
						text='Не регистрировались?'
						tpColor='secondary'
						lkHref='/registration'
						ttNode='Регистрация'
						boxWrapper
					/>
					<OnyxTypography
						text='Вспомнили данные?'
						tpColor='secondary'
						lkHref='/login'
						ttNode='Войти в систему'
						tpAlign='right'
						boxWrapper
						boxAlign='flex-end'
					/>
				</Box>

				<AuthModal state={state} setState={setState} title='Проверьте электронную почту' disableButton>
					<div>
						Вам на почту было выслано письмо для восстановления учётной записи. Пожалуйста, зайдите в
						указанную при регистрации электронную почту и проследуйте по шагам инструкции для сброса пароля!
					</div>
				</AuthModal>
			</>
		</AuthFormLayout>
	);
};

export default RecoveryForm;
