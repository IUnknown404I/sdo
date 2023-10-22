import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import * as yup from 'yup';
import useLoading from '../../../../hooks/useLoading';
import { useTypedSelector } from '../../../../redux/hooks';
import { selectAxiosInstance } from '../../../../redux/slices/axiosInstance';
import logapp from '../../../../utils/logapp';
import { errorMessage, notification } from '../../../utils/notifications/Notification';
import AuthFormLayout from '../components/AuthFormLayout';
import { PasswordRewriteElement } from './PasswordRewriteElement';

const recoveryValidationSchema = yup.object({
	password: yup
		.string()
		.required('Необходимо ввести новый пароль!')
		.min(12, 'Минимальная длина пароля 12 символов!')
		.max(64, 'Достигнута максимальная длина.')
		.matches(
			/^.(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$*%&/^? "]).*$/i,
			'Пароль должен содержать заглавные и строчные буквы, цифры и спец. символы (*^%&/$#!?)!',
		),
	secondPassword: yup
		.string()
		.required('Необходимо повторить новый пароль!')
		.matches(
			/^.(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$*%&/^? "]).*$/i,
			'Пароль должен содержать заглавные и строчные буквы, цифры и спец. символы (*^%&/$#!?)!',
		)
		.min(12, 'Минимальная длина пароля 12 символов!')
		.max(64, 'Достигнута максимальная длина.')
		.oneOf([yup.ref('password'), null], 'Пароли не совпадают'),
});

const PasswordRewriteForm = () => {
	const theme = useTheme();
	const router = useRouter();
	const axiosInstance = useTypedSelector(state => selectAxiosInstance(state));
	const recoveryTokenRef = React.useRef<string>('');
	const [renderedFlag, setRenderedFlag] = React.useState<boolean>(false);
	const [tokenStatus, setTokenStatus] = React.useState<boolean>(false);
	const [modalState, setModalState] = React.useState<boolean>(false);
	const [showPassword, setShowPassword] = React.useState(false);
	const { Loader, state: loadingState, setState: setLoadingState } = useLoading({ iconVariant: true });

	const { Loader: FirstLoader } = useLoading({
		size: 50,
		value: 25,
		disableShrink: false,
		animationDuration: '2.5s',
	});
	const { Loader: SecondLoader } = useLoading({
		size: 64,
		value: 100,
		disableShrink: false,
		animationDuration: '2.5s',
	});
	const { Loader: ThirdLoader } = useLoading({
		size: 50,
		value: 25,
		disableShrink: false,
		animationDuration: '2.5s',
	});

	const formik = useFormik({
		initialValues: {
			password: '',
			secondPassword: '',
		},
		validationSchema: recoveryValidationSchema,
		onSubmit: values => {
			if (!recoveryTokenRef.current || recoveryTokenRef.current === 'none') {
				disableTokenNotification();
				return;
			}
			setLoadingState(true);
			const requestTypeQuery = router.query.request;
			axiosInstance
				.put(
					`${process.env.NEXT_PUBLIC_SERVER}/users/recovery/password${
						requestTypeQuery ? `?request=${requestTypeQuery}` : ''
					}`,
					{
						token: recoveryTokenRef.current,
						newPassword: values.password,
					},
				)
				.then(res => {
					if (res.data as boolean) {
						notification({
							message: 'Пароль успешно изменён! Авторизуйтесь в системе с новыми данными.',
							type: 'success',
							autoClose: 7500,
							theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
						});
						setModalState(prev => !prev);
					} else
						notification({
							message:
								'Запрос на изменение отменён! Проверьте введенные данные или оформите новую заявку на восстановление.',
							type: 'error',
							autoClose: 5000,
							theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
						});
					formik.resetForm();
				})
				.catch(err =>
					notification({
						message:
							errorMessage(err) ||
							'Запрос на изменение отменён! Проверьте введенные данные или оформите новую заявку на восстановление.',
						type: 'error',
						autoClose: 4000,
						theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
					}),
				)
				.finally(() => setLoadingState(false));
		},
	});

	React.useEffect(() => {
		if (!router.isReady) return;
		const tokenQuery = router.query.token;

		if (tokenQuery) recoveryTokenRef.current = tokenQuery as string;
		else recoveryTokenRef.current = 'none';
		setRenderedFlag(prev => !prev);
	}, [router.isReady]);

	React.useEffect(() => {
		if (!renderedFlag) return;
		if (recoveryTokenRef.current == null || recoveryTokenRef.current === 'none') {
			logapp.log('[!] Empty recovery token detected!');
			router.push('/recovery/error').then(() => disableTokenNotification());
			return;
		}

		axiosInstance
			.get(`${process.env.NEXT_PUBLIC_SERVER}/users/recovery-token-validate?token=${recoveryTokenRef.current}`)
			.then(res => {
				logapp.log('fetched data: ', res.data);
				setTokenStatus(!!res.data);
				if (!(res.data as boolean)) {
					router.push('/recovery/error').then(() => {
						disableTokenNotification();
					});
					return;
				}
			})
			.catch(err => {
				logapp.log('verifying error');
				setTokenStatus(false);
				router.push('/recovery/error').then(() => {
					disableTokenNotification();
				});
			})
			.finally(() => {
				if (loadingState) setLoadingState(prev => !prev);
			});
	}, [renderedFlag]);

	return tokenStatus && !loadingState ? (
		<PasswordRewriteElement
			formik={formik}
			loadingState={loadingState}
			Loader={Loader}
			showPassword={showPassword}
			modalState={modalState}
			setModalState={setModalState}
			handleClickShowPassword={handleClickShowPassword}
			handleMouseDownPassword={handleMouseDownPassword}
		/>
	) : (
		<AuthFormLayout submitFunction={() => {}}>
			<Box
				sx={{
					position: 'absolute',
					inset: '15px 0 100px 0',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '1.25rem',
					borderRadius: '2rem',
					backgroundColor: theme => (theme.palette.mode === 'light' ? '#ffffff' : '#162433'),
				}}
			>
				<Box
					sx={{
						position: 'relative',
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						gap: '1.5rem',
					}}
				>
					{FirstLoader} {SecondLoader} {ThirdLoader}
				</Box>
			</Box>
		</AuthFormLayout>
	);

	function disableTokenNotification(error?: unknown) {
		notification({
			message:
				errorMessage(error) ||
				'Предоставлен неактивный ключ восстановления! Оформите заявку на восстановление доступа к Вашему аккаунту.',
			type: 'warning',
			autoClose: 7000,
			theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
		});
	}

	function handleClickShowPassword() {
		setShowPassword(show => !show);
	}

	function handleMouseDownPassword(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
	}
};

export default PasswordRewriteForm;
