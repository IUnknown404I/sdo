import { useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { MouseEventHandler } from 'react';
import * as yup from 'yup';
import useLoading from '../../../../hooks/useLoading';
import { LoginFullObjI } from '../../../../redux/api';
import { useAppDispatch } from '../../../../redux/store';
import AuthThunks from '../../../../redux/thunks/auth';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import { errorMessage, notification } from '../../../utils/notifications/Notification';
import AuthModal from '../components/AuthModal';
import LoginElement from './LoginElement';

export interface AuthLogindataI {
	username: string;
	password: string;
	email: string;
}

const LoginForm = () => {
	const theme = useTheme();
	const router = useRouter();
	const dispatcher = useAppDispatch();

	// where 1 - 4 are attempts; 0 - -infinity is a blocked state and 999 is an inactive account.
	const [attempts, setAttepmts] = React.useState<number>(5);
	const [emailMode, setEmailMode] = React.useState(false);
	const [dataSave, setDataSave] = React.useState<boolean>(true);
	const [showPassword, setShowPassword] = React.useState(false);
	const { Loader, state: isLoading, setState: setIsLoading } = useLoading({ iconVariant: true });
	const [sourceModalState, setSourceModalState] = React.useState<boolean>(false);
	const [blockModalState, setBlockModalState] = React.useState<{ state: boolean; blockReason?: string }>({
		state: false,
	});

	const cachedUsernameOrEmail = React.useRef({ username: '', email: '' });

	const formik = useFormik({
		initialValues: {
			username: '',
			password: '',
			email: 'Disable@dis.no',
		},
		validationSchema: getValidationScheme(emailMode),
		onSubmit: async values => {
			setIsLoading(true);
			dispatcher(AuthThunks.authorize({ ...values, dataSave }))
				.then(res =>
					validateLoginResponce(res.payload as string | LoginFullObjI, values.username, values.email),
				)
				.catch(err => {
					notification({
						message: errorMessage(err) || 'Не удалось авторизоваться! Проверьте данные и попробуйте снова.',
						type: 'error',
						autoClose: 4000,
						theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
					});
				})
				.finally(() => setIsLoading(false));
		},
	});

	React.useEffect(() => {
		if (!router.isReady) return;
		if (router.query.source && !Array.isArray(router.query.source)) setSourceModalState(true);
	}, [router.isReady]);

	return (
		<>
			<LoginElement
				{...{
					dataSave,
					emailMode,
					Loader,
					loadingState: isLoading,
					setDataSave: (state: boolean) => setDataSave(() => state),
					showPassword,
					formik,
					attempts,
					handleAdditionalRecoveryRequest,
					handleClickShowPassword: () => setShowPassword(show => !show),
					handleClickEmailMode: handleClickEmailMode as MouseEventHandler<HTMLButtonElement>,
					handleMouseDownPassword: (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault(),
				}}
			/>

			<AuthModal
				uncontrolled
				state={sourceModalState}
				setState={() => setSourceModalState(prev => !prev)}
				title={
					router.query.source === 'validation'
						? 'Учетная запись активирована!'
						: 'Данные учетной записи изменены!'
				}
				disableButton
			>
				<p>
					{router.query.source === 'validation'
						? 'Ваша учетная запись успешно активирована! Теперь вам предоставлен доступ к образовательной платформе. Войдите в свой личный кабинет, заполнив форму авторизации.'
						: 'Данные учетной записи были успешно изменены! В целях безопасности вы были отключены от системы. Пожалуйста, войдите в свой личный кабинет, чтобы увидеть изменения.'}
				</p>
			</AuthModal>
			
			<AuthModal
				uncontrolled
				state={blockModalState.state}
				setState={() => setBlockModalState({ state: false, blockReason: undefined })}
				title='Учётная запись заблокирована!'
				disableButton
			>
				<p>
					Ваша учётная запись пользователя была заблокирована!
					<br />
					Обратитесь в техническую поддержку.
					<br />
					{blockModalState?.blockReason && (
						<OnyxTypography
							component='span'
							tpSize='inherit'
							tpWeight='bold'
							sx={{ textDecoration: 'unset' }}
							text={blockModalState.blockReason}
						/>
					)}
				</p>
			</AuthModal>
		</>
	);

	/**
	 * @IUnknown404I
	 * The function for displaing toast according passed response and control the error messages for Login form.
	 * @param payload as [object]: AccessTokenI & { lastPages?: string } or you can pass an error string for displaying corresponding info.
	 */
	function validateLoginResponce(payload: string | LoginFullObjI, username?: string, email?: string): void {
		// string equals to error message => handling errors
		if (typeof payload === 'string') {
			if (payload.trim().includes('Attempts left: ')) {
				const avaibleAtemptsCount = payload.trim().split('Attempts left: ')[1];
				setAttepmts(() => +avaibleAtemptsCount);
				notification({
					message: `Указаны неправильные данные! Попробуйте снова, еще доступно ${avaibleAtemptsCount} ${
						avaibleAtemptsCount === '1' ? 'попытка' : 'попытки'
					}.`,
					type: 'warning',
					autoClose: 6500,
					theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
				});
				return;
			} else if (
				payload.toLowerCase().trim().includes('заблокирован') ||
				payload.toLowerCase().trim().includes('blocked')
			) {
				setAttepmts(() => 0);
				notification({
					message: payload,
					type: 'error',
					autoClose: 4000,
					theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
				});
				setBlockModalState({ state: true, blockReason: payload.trim().split('!')[1].trim() });
			} else if (
				payload.toLowerCase().trim().includes('не активирована') ||
				payload.toLowerCase().trim().includes('not activ') ||
				payload.toLowerCase().trim().includes('inactive')
			) {
				if ((username && username !== 'DisabledValue*0') || (email && email !== 'Disable@dis.no'))
					cachedUsernameOrEmail.current = {
						username: username || 'DisabledValue*0',
						email: email || 'Disable@dis.no',
					};
				setAttepmts(() => 9999);
				notification({
					message: payload,
					type: 'error',
					autoClose: 4000,
					theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
				});
			} else {
				setAttepmts(() => 5);
				notification({
					message: 'Не удалось авторизоваться! Проверьте данные и попробуйте снова.',
					type: 'error',
					autoClose: 4000,
					theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
				});
			}
		} else {
			notification({
				message: 'Вы успешно авторизовались в системе дистанционного образования!',
				type: 'success',
				autoClose: 6000,
				theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
			});
			setAttepmts(() => 5);
			formik.resetForm();
			formik.setValues({ username: '', email: '', password: '' });
		}
	}

	function handleAdditionalRecoveryRequest(): void {
		if (!cachedUsernameOrEmail.current.email && !cachedUsernameOrEmail.current.username) return;
		dispatcher(AuthThunks.additionalRecoveryRequest(cachedUsernameOrEmail.current)).then(res =>
			typeof res.payload === 'boolean' && res.payload
				? notification({
						message: 'Заявка успешно отправлена! Проверьте Вашу почту.',
						type: 'success',
						autoClose: 6000,
						theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
				  })
				: notification({
						message: res.payload as string,
						type: 'error',
						autoClose: 4000,
						theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
				  }),
		);
	}

	function handleClickEmailMode() {
		if (!emailMode) {
			formik.values.email = formik.values.username;
			formik.values.username = 'DisabledValue*0';
		} else {
			formik.values.username = formik.values.email;
			formik.values.email = 'disable@dis.no';
		}
		setEmailMode(mode => !mode);
	}
};

function getValidationScheme(emailMode?: boolean) {
	return !emailMode
		? yup.object({
				username: yup
					.string()
					.trim()
					.min(5, 'Минимальная длина логина 5 символов!')
					.max(64, 'Достигнута максимальная длина.')
					.required('Необходимо ввести имя пользователя!'),
				password: yup
					.string()
					.min(12, 'Минимальная длина пароля 12 символов!')
					.max(64, 'Достигнута максимальная длина.')
					.required('Необходимо ввести пароль!'),
		  })
		: yup.object({
				email: yup
					.string()
					.email('Некорректно введена электронная почта!')
					.min(6, 'Минимальная длина электронной почты 6 символов!')
					.max(64, 'Достигнута максимальная длина.')
					.required('Необходимо ввести электронную почту!'),
				password: yup
					.string()
					.min(12, 'Минимальная длина пароля 12 символов!')
					.max(64, 'Достигнута максимальная длина.')
					.required('Необходимо ввести пароль!'),
		  });
}

export default LoginForm;
