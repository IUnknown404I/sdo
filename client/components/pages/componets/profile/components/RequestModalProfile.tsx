import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Button,
	Divider,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Stack,
	Tooltip,
} from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import useLoading from '../../../../../hooks/useLoading';
import { useTypedSelector } from '../../../../../redux/hooks';
import { YUP_SCHEMA_HELPERS } from '../../../../../utils/yup/validationSchemaHelpers';
import OnyxAlertModal from '../../../../basics/OnyxAlertModal';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import { errorMessage, notification } from '../../../../utils/notifications/Notification';

interface PasswordModalProfileI {
	state: boolean;
	setState: React.Dispatch<React.SetStateAction<boolean>>;
	callback: (payload: { password: string; email?: string }) => Promise<any>;
	emailField?: boolean;
}

/**
 * @IUnknown404I Provides Modals for changing protected profile-properties like email or password.
 * @param props as object:
 * - state as boolean Modal state;
 * - setState as Dispatch for Modal state changing events;
 * - callback as async Function with { password: string; email?: string } payload-object passed;
 * - emailField (optional) for email-Request modal pane mode.
 * @returns a ReactNode as Modal pane contained all according async logic.
 */
const RequestModalProfile = (props: PasswordModalProfileI) => {
	const userEmail = useTypedSelector(store => store.user.email);
	const { Loader, state: loadingState, setState: setLoadingState } = useLoading({ iconVariant: true });
	const [modalState, setModalState] = React.useState<boolean>(false);
	const [showPassword, setShowPassword] = React.useState(false);

	const passValidationSchema = yup.object(
		props.emailField
			? {
					password: YUP_SCHEMA_HELPERS.PASSWORD,
					email: YUP_SCHEMA_HELPERS.EMAIL,
			  }
			: {
					password: YUP_SCHEMA_HELPERS.PASSWORD,
			  },
	);

	const formik = useFormik({
		initialValues: props.emailField
			? {
					password: '',
					email: '',
			  }
			: {
					password: '',
			  },
		validationSchema: passValidationSchema,
		onSubmit: formData => {
			setLoadingState(true);
			props
				.callback({ password: formData.password, email: formData.email })
				.then(res => {
					if ((res as boolean) === false || res.message !== undefined) throw new Error(res.message);
					notification({ type: 'success', message: 'Запрос успешно создан! Проверьте вашу почту.' });
					setModalState(true);
				})
				.catch(err =>
					notification({
						type: 'warning',
						message: errorMessage(err) || 'Не удалось сформировать запрос!',
						autoClose: 6500,
					}),
				)
				.finally(() => setLoadingState(false));
		},
	});

	React.useEffect(() => {
		if (formik.values.password || formik.values.email)
			formik.setValues(props.emailField ? { password: '', email: '' } : { password: '' });
		if (formik.errors.password) delete formik.errors.password;
		if (formik.errors.email) delete formik.errors.email;
	}, [props.state]);

	React.useEffect(() => {
		if (!modalState && props.state) props.setState(false);
	}, [modalState]);

	return (
		<OnyxAlertModal
			state={props.state}
			setState={props.setState}
			title='Подтвердите действие'
			hideFooter
			sx={{ maxWidth: 'min(98%, 600px)' }}
		>
			<form
				name={props.emailField ? 'email-change-form' : 'password-change-form'}
				onSubmit={formik.handleSubmit}
				style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.75rem' }}
			>
				<OnyxTypography
					tpSize='1rem'
					tpColor='secondary'
					text={`На вашу привязанную почту будет отправлено письмо с дальнейшими инструкциями по изменению ${
						props.emailField ? 'электронной почты' : 'пароля от'
					} данной учетной записи.`}
					boxAlign='flex-end'
				/>

				<FormControl variant='outlined' fullWidth>
					<InputLabel
						htmlFor='password'
						sx={formik.touched.password && Boolean(formik.errors.password) ? { color: '#d63e3e' } : {}}
					>
						Введите текущий пароль
					</InputLabel>
					<OutlinedInput
						fullWidth
						id='password'
						disabled={loadingState}
						value={formik.values.password}
						onChange={formik.handleChange}
						error={formik.touched.password && !!formik.errors.password}
						type={showPassword ? 'text' : 'password'}
						inputProps={{ autoComplete: 'off' }}
						endAdornment={
							<InputAdornment position='end'>
								<IconButton
									aria-label='toggle password visibility'
									disabled={loadingState}
									onClick={() => setShowPassword(show => !show)}
									// onMouseDown={handleMouseDownPassword}
									edge='end'
								>
									<Tooltip title={showPassword ? 'Скрыть пароль' : 'Показать пароль'}>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</Tooltip>
								</IconButton>
							</InputAdornment>
						}
						label='Введите текущий пароль'
					/>
					{!!formik.errors.password && (
						<FormHelperText error id='password-error'>
							{formik.errors.password}
						</FormHelperText>
					)}
				</FormControl>
				<Divider sx={{ width: '100%' }} />

				{props.emailField != null && (
					<>
						<FormControl variant='outlined' fullWidth>
							<InputLabel
								htmlFor='email'
								sx={formik.touched.email && Boolean(formik.errors.email) ? { color: '#d63e3e' } : {}}
							>
								Введите новую почту
							</InputLabel>
							<OutlinedInput
								fullWidth
								id='email'
								disabled={loadingState}
								value={formik.values.email}
								onChange={formik.handleChange}
								error={formik.touched.email && !!formik.errors.email}
								inputProps={{ autoComplete: 'off' }}
								label='Введите новую почту'
								type='text'
							/>
							{!!formik.errors.email ||
								(formik.values.email === userEmail && (
									<FormHelperText error id='email-error'>
										{formik.values.email === userEmail
											? 'Почта уже привязана к аккаунту!'
											: formik.errors.email}
									</FormHelperText>
								))}
						</FormControl>
						<Divider sx={{ width: '100%' }} />
					</>
				)}

				<Button
					disabled={
						loadingState ||
						!!!formik.values.password ||
						!!formik.errors.password ||
						(props.emailField ? !!!formik.values.email || !!formik.errors.email : false) ||
						formik.values.email === userEmail
					}
					color='primary'
					variant='contained'
					fullWidth
					type='submit'
					sx={{ fontSize: '1.1rem' }}
				>
					Отправить заявку
					{Loader}
				</Button>
			</form>

			<OnyxAlertModal
				state={modalState}
				setState={setModalState}
				title='Заявка оформлена!'
				uncontrolled
				disableButton
			>
				<Stack direction='row' alignItems='center' gap={1}>
					<img
						src='/icons/ok_icon.png'
						style={{ filter: 'contrast(1.15)' }}
						alt='OK'
						height={150}
						width={150}
					/>
					<OnyxTypography
						text='Заявка подтверждена и обработана. Пожалуйста, проверьте вашу контактную почту: на нее были высланы дальнейшие инструкции.'
						sx={{ fontSize: '1.15rem' }}
					/>
				</Stack>
			</OnyxAlertModal>
		</OnyxAlertModal>
	);
};

export default RequestModalProfile;
