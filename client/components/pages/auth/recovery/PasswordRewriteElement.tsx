import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Box,
	Button,
	Divider,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Tooltip,
	Typography,
} from '@mui/material';
import Link from 'next/link';
import { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import AuthBoxHeader from '../components/AuthBoxHeader';
import AuthFormLayout from '../components/AuthFormLayout';
import AuthModal from '../components/AuthModal';

export interface PasswordRewriteElementI {
	formik: any;
	loadingState: boolean;
	showPassword: boolean;
	modalState: boolean;
	setModalState: Dispatch<SetStateAction<boolean>>;
	Loader: JSX.Element;
	handleClickShowPassword: MouseEventHandler<HTMLButtonElement>;
	handleMouseDownPassword: MouseEventHandler<HTMLButtonElement>;
}

export const PasswordRewriteElement = (props: PasswordRewriteElementI) => {
	return (
		<AuthFormLayout submitFunction={props.formik.handleSubmit}>
			<>
				<AuthBoxHeader>
					<Typography variant='h2' fontWeight='bold' fontSize='2rem' color='primary' align='left'>
						СМЕНА ПАРОЛЯ
					</Typography>

					<img src='/icons/recoveryPass.svg' alt='Recovery' width={75} height={75} />
				</AuthBoxHeader>

				<FormControl variant='outlined'>
					<InputLabel
						htmlFor='password'
						sx={
							props.formik.touched.password && Boolean(props.formik.errors.password)
								? { color: '#d63e3e' }
								: {}
						}
					>
						Введите новый пароль*
					</InputLabel>
					<OutlinedInput
						fullWidth
						id='password'
						disabled={props.loadingState}
						value={props.formik.values.password}
						onChange={props.formik.handleChange}
						error={props.formik.touched.password && Boolean(props.formik.errors.password)}
						type={props.showPassword ? 'text' : 'password'}
						endAdornment={
							<InputAdornment position='end'>
								<IconButton
									aria-label='toggle password visibility'
									disabled={props.loadingState}
									onClick={props.handleClickShowPassword}
									onMouseDown={props.handleMouseDownPassword}
									edge='end'
								>
									<Tooltip title={props.showPassword ? 'Скрыть пароль' : 'Показать пароль'}>
										{props.showPassword ? <VisibilityOff /> : <Visibility />}
									</Tooltip>
								</IconButton>
							</InputAdornment>
						}
						label='Введите новый пароль*'
					/>
					{props.formik.touched.password && Boolean(props.formik.errors.password) && (
						<FormHelperText error id='accountId-error'>
							{props.formik.touched.password && props.formik.errors.password}
						</FormHelperText>
					)}
				</FormControl>

				<Typography
					variant='body1'
					fontSize='1rem'
					color='gray'
					align='left'
					marginTop='-.25rem'
					marginBottom='-.75rem'
				>
					Введите новый пароль ещё раз
				</Typography>
				<FormControl variant='outlined'>
					<InputLabel
						htmlFor='secondPassword'
						sx={
							props.formik.touched.secondPassword && Boolean(props.formik.errors.secondPassword)
								? { color: '#d63e3e' }
								: {}
						}
					>
						Повторите новый пароль*
					</InputLabel>
					<OutlinedInput
						fullWidth
						id='secondPassword'
						disabled={props.loadingState}
						value={props.formik.values.secondPassword}
						onChange={props.formik.handleChange}
						error={props.formik.touched.secondPassword && Boolean(props.formik.errors.secondPassword)}
						type={props.showPassword ? 'text' : 'password'}
						endAdornment={
							<InputAdornment position='end'>
								<IconButton
									aria-label='toggle second password visibility'
									disabled={props.loadingState}
									onClick={props.handleClickShowPassword}
									onMouseDown={props.handleMouseDownPassword}
									edge='end'
								>
									<Tooltip title={props.showPassword ? 'Скрыть пароль' : 'Показать пароль'}>
										{props.showPassword ? <VisibilityOff /> : <Visibility />}
									</Tooltip>
								</IconButton>
							</InputAdornment>
						}
						label='Повторите новый пароль*'
					/>
					{props.formik.touched.secondPassword && Boolean(props.formik.errors.secondPassword) && (
						<FormHelperText error id='accountId-error'>
							{props.formik.touched.secondPassword && props.formik.errors.secondPassword}
						</FormHelperText>
					)}
				</FormControl>

				<Button
					disabled={props.loadingState}
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
					Сменить пароль
					{props.Loader}
				</Button>

				<Divider />
				<OnyxTypography
					text='Вспомнили данные?'
					tpColor='secondary'
					lkHref='/login'
					ttNode='Войти в систему'
					tpAlign='right'
					boxWrapper
					boxAlign='flex-end'
				/>

				<AuthModal
					uncontrolled
					state={props.modalState}
					setState={props.setModalState}
					title='Новый пароль установлен!'
					disableButton
					disableCloseIcon
					hideFooter
				>
					<div>
						Новый пароль успешно установлен! Теперь перейдите на страницу авторизации и введите новые
						учётные данные Вашей учетной записи.
						<Box
							display='flex'
							justifyContent='flex-end'
							width='100%'
							marginTop='1.75rem'
							marginBottom='-.5rem'
						>
							<Link href='/login'>
								<Button variant='contained'>Авторизоваться</Button>
							</Link>
						</Box>
					</div>
				</AuthModal>
			</>
		</AuthFormLayout>
	);
};
