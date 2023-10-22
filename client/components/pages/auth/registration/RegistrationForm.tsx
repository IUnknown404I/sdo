import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FormHelperText, TextField, Tooltip, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
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

export interface RegistrationDataI {
	username: string;
	password: string;
	email: string;
	company: string;
}

const registryValidationSchema = yup.object({
	username: yup
		.string()
		.trim()
		.matches(
			/^[a-zA-Z]+([a-zA-Z0-9]+)*$/i,
			'Должен содержать латиницу или числа и начинаться с буквы! (пример: user1sub).',
		)
		.min(5, 'Минимальная длина логина 5 символов!')
		.max(64, 'Достигнута максимальная длина.')
		.required('Необходимо ввести имя пользователя!'),
	password: yup
		.string()
		.matches(
			/^.(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$*%&/^? "]).*$/i,
			'Пароль должен содержать латинские заглавные и строчные буквы, цифры и спец. символы (*^%&/$#!?)!',
		)
		.min(12, 'Минимальная длина пароля 12 символов!')
		.max(64, 'Достигнута максимальная длина.')
		.required('Необходимо ввести пароль!'),
	email: yup
		.string()
		.email('Некорректно введена электронная почта!')
		.min(6, 'Минимальная длина электронной почты 6 символов!')
		.max(64, 'Достигнута максимальная длина.')
		.required('Необходимо ввести электронную почту!'),
	company: yup
		.string()
		.min(3, 'Минимальная длина названия организации 3 символа!')
		.max(128, 'Достигнута максимальная длина.'),
});

const RegistrationForm = () => {
	const theme = useTheme();
	const axiosInstance = useTypedSelector(state => selectAxiosInstance(state));
	const [state, setState] = React.useState<boolean>(false);
	const [showPassword, setShowPassword] = React.useState(false);
	const { Loader, state: loadingState, setState: setLoadingState } = useLoading({ iconVariant: true });

	const formik = useFormik({
		initialValues: {
			username: '',
			password: '',
			email: '',
			company: '',
		},
		validationSchema: registryValidationSchema,
		onSubmit: values => {
			setLoadingState(true);
			axiosInstance
				.post(`${process.env.NEXT_PUBLIC_SERVER}/users`, { ...values })
				.then(res => {
					notification({
						message: 'Успешно! Вам на почту отправлено письмо для активации учётной записи.',
						type: 'info',
						autoClose: 6000,
						theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
					});
					setState(true);
					formik.resetForm();
				})
				.catch(err => {
					notification({
						message:
							errorMessage(err) || 'Не удалось зарегистрироваться! Проверьте данные и попробуйте снова.',
						type: 'error',
						autoClose: 4000,
						theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
					});
				})
				.finally(() => setLoadingState(false));
		},
	});

	const handleClickShowPassword = () => setShowPassword(show => !show);

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	return (
		<AuthFormLayout submitFunction={formik.handleSubmit}>
			<>
				<AuthBoxHeader>
					<Typography variant='h2' fontWeight='bold' fontSize='2rem' color='primary' align='left'>
						РЕГИСТРАЦИЯ
					</Typography>

					<img src='/icons/safe.svg' alt='Authorization' width={75} height={75} />
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

				<FormControl variant='outlined'>
					<InputLabel
						htmlFor='password'
						sx={formik.touched.password && Boolean(formik.errors.password) ? { color: '#d63e3e' } : {}}
					>
						Введите пароль*
					</InputLabel>
					<OutlinedInput
						fullWidth
						id='password'
						aria-label='password'
						disabled={loadingState}
						value={formik.values.password}
						onChange={formik.handleChange}
						error={formik.touched.password && Boolean(formik.errors.password)}
						type={showPassword ? 'text' : 'password'}
						endAdornment={
							<InputAdornment position='end'>
								<IconButton
									aria-label='toggle password visibility'
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									edge='end'
								>
									<Tooltip title={showPassword ? 'Скрыть пароль' : 'Показать пароль'}>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</Tooltip>
								</IconButton>
							</InputAdornment>
						}
						label='Введите пароль*'
					/>
					{formik.touched.password && Boolean(formik.errors.password) && (
						<FormHelperText error id='accountId-error'>
							{formik.touched.password && formik.errors.password}
						</FormHelperText>
					)}
				</FormControl>

				<Typography variant='h1' fontSize='.95rem' color='gray' align='left' marginBottom='-.35rem'>
					На эту почту будет отправлено письмо для активации аккаунта
				</Typography>
				<InvisibleLabel htmlFor='email' />
				<TextField
					disabled={loadingState}
					fullWidth
					id='email'
					name='email'
					label='Введите электронную почту*'
					type='email'
					value={formik.values.email}
					onChange={formik.handleChange}
					error={formik.touched.email && Boolean(formik.errors.email)}
					helperText={formik.touched.email && formik.errors.email}
				/>

				<InvisibleLabel htmlFor='company' />
				<TextField
					disabled={loadingState}
					fullWidth
					id='company'
					name='company'
					label='Ваша организация'
					type='company'
					value={formik.values.company}
					onChange={formik.handleChange}
					error={formik.touched.company && Boolean(formik.errors.company)}
					helperText={formik.touched.company && formik.errors.company}
				/>

				<Button
					disabled={loadingState}
					color='primary'
					variant='contained'
					fullWidth
					type='submit'
					sx={{ fontSize: '1.1rem' }}
				>
					Подтвердить регистрацию
					{Loader}
				</Button>

				<Divider />
				<OnyxTypography
					text='Уже имеете аккаунт?'
					tpColor='secondary'
					lkHref='/login'
					ttNode='Войти в систему'
					tpAlign='right'
					boxWrapper
					boxAlign='flex-end'
				/>

				<AuthModal state={state} setState={setState} title='Проверьте электронную почту' disableButton>
					<div>
						Вам на почту было выслано письмо для активации учётной записи. Пожалуйста, зайдите в указанную
						при регистрации электронную почту и проследуйте по шагам инструкции для завершения регистрации!
					</div>
				</AuthModal>
			</>
		</AuthFormLayout>
	);
};

export default RegistrationForm;
