import { Visibility, VisibilityOff } from '@mui/icons-material';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import ContactsIcon from '@mui/icons-material/Contacts';
import DangerousIcon from '@mui/icons-material/Dangerous';
import DoneIcon from '@mui/icons-material/Done';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import { FormHelperText, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import React, { MouseEventHandler } from 'react';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import AuthBoxHeader from '../components/AuthBoxHeader';
import AuthFormLayout from '../components/AuthFormLayout';
import AuthModal from '../components/AuthModal';

interface LoginElementI {
	formik: any;
	dataSave: boolean;
	emailMode: boolean;
	Loader: JSX.Element;
	attempts: number;
	loadingState: boolean;
	setDataSave: (x: boolean) => void;
	showPassword: boolean;
	handleAdditionalRecoveryRequest: Function;
	handleClickEmailMode: MouseEventHandler<HTMLButtonElement>;
	handleClickShowPassword: MouseEventHandler<HTMLButtonElement>;
	handleMouseDownPassword: MouseEventHandler<HTMLButtonElement>;
}

const LoginElement = (props: LoginElementI): JSX.Element => {
	const [blockModalState, setBlockModalState] = React.useState<boolean>(false);
	return (
		<>
			<AuthFormLayout submitFunction={props.formik.handleSubmit}>
				<>
					<AuthBoxHeader>
						<Typography variant='h2' fontWeight='bold' fontSize='2rem' color='primary' align='left'>
							АВТОРИЗАЦИЯ
						</Typography>

						<img src='/icons/auth.svg' alt='Authorization' width={75} height={75} />
					</AuthBoxHeader>

					<FormControl variant='outlined'>
						<InputLabel
							htmlFor={props.emailMode ? 'email' : 'username'}
							sx={
								props.formik.touched.password && Boolean(props.formik.errors.password)
									? { color: '#d63e3e' }
									: {}
							}
						>
							{props.emailMode ? 'Введите почту' : 'Введите логин'}
						</InputLabel>
						<OutlinedInput
							fullWidth
							id={props.emailMode ? 'email' : 'username'}
							disabled={props.loadingState}
							value={props.emailMode ? props.formik.values.email : props.formik.values.username}
							onChange={props.emailMode ? props.formik.handleChange : props.formik.handleChange}
							error={
								props.emailMode
									? props.formik.touched.email && Boolean(props.formik.errors.email)
									: props.formik.touched.username && Boolean(props.formik.errors.username)
							}
							type={props.emailMode ? 'email' : 'text'}
							endAdornment={
								<InputAdornment position='end'>
									<IconButton
										aria-label='toggle login or email mode'
										onClick={props.handleClickEmailMode}
										onMouseDown={props.handleMouseDownPassword}
										edge='end'
									>
										<Tooltip title={props.emailMode ? 'Использовать логин' : 'Использовать почту'}>
											{props.emailMode ? (
												<AlternateEmailRoundedIcon />
											) : (
												<AccountCircleRoundedIcon />
											)}
										</Tooltip>
									</IconButton>
								</InputAdornment>
							}
							label={props.emailMode ? 'Введите почту' : 'Введите логин'}
						/>
						{((props.formik.touched.username && Boolean(props.formik.errors.username)) ||
							(props.formik.touched.email && Boolean(props.formik.errors.email))) && (
							<FormHelperText error id='login-or-email-error'>
								{props.emailMode
									? props.formik.errors.email && props.formik.errors.email
									: props.formik.errors.username && props.formik.errors.username}
							</FormHelperText>
						)}
					</FormControl>

					<FormControl variant='outlined'>
						<InputLabel
							htmlFor='password'
							sx={
								props.formik.touched.password && Boolean(props.formik.errors.password)
									? { color: '#d63e3e' }
									: {}
							}
						>
							Введите пароль
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
							label='Введите пароль'
						/>
						{props.formik.touched.password && Boolean(props.formik.errors.password) && (
							<FormHelperText error id='accountId-error'>
								{props.formik.touched.password && props.formik.errors.password}
							</FormHelperText>
						)}
					</FormControl>

					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginTop: '-.5rem',
						}}
					>
						<FormControlLabel
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
							}}
							control={
								<Checkbox checked={props.dataSave} onClick={() => props.setDataSave(!props.dataSave)} />
							}
							label={
								<Typography component='span' variant='body2' align='right'>
									Запомнить меня
								</Typography>
							}
						/>
						<OnyxTypography
							text='Забыли пароль?'
							lkHref='/recovery'
							tpColor='primary'
							tpAlign='right'
							ttNode='Восстановить доступ'
						/>
					</Box>

					<Button
						disabled={props.loadingState}
						color='primary'
						variant='contained'
						fullWidth
						type='submit'
						sx={{
							fontSize: '1.1rem',
							// marginBottom: '1.25rem',
							marginTop: '-.5rem',
						}}
					>
						Войти
						{props.Loader}
					</Button>

					{props.attempts !== 5 && (
						<Typography
							variant='body1'
							marginTop='-.5rem'
							marginBottom='-.75rem'
							fontSize='1rem'
							align='center'
							sx={{ color: '#d63e3e' }}
						>
							{props.attempts === 9999
								? `Необходимо активировать учётную запись! Проверьте почту.`
								: props.attempts > 0
								? `Осталось попыток: ${props.attempts}`
								: `Ваша учетная запись была заблокирована!`}
						</Typography>
					)}

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
							component='div'
							tpColor='secondary'
							text='Аккаунт заблокирован?'
							ttNode='Показать справку'
							tpAlign='left'
							hoverStyles
							boxWrapper
							boxWidth='fit-content'
							onClick={() => setBlockModalState(prev => !prev)}
						/>

						<OnyxTypography
							tpColor='secondary'
							text='Ещё нет аккаунта?'
							lkHref='/registration'
							ttNode='Регистрация'
							tpAlign='right'
							boxWrapper
							boxAlign='flex-end'
							boxWidth='fit-content'
						/>
					</Box>

					{props.attempts === 9999 && (
						<OnyxTypography
							ttArrow
							boxWrapper
							hoverStyles
							centeredFlex
							tpAlign='left'
							boxAlign='center'
							boxWidth='center'
							tpColor='secondary'
							ttNode='Отправить новый ключ на почту'
							ttPlacement='top'
							onClick={() => props.handleAdditionalRecoveryRequest()}
						>
							<PrivacyTipOutlinedIcon sx={{ fontSize: '1.5rem' }} /> Отправить новое письмо с активацией
						</OnyxTypography>
					)}
				</>
			</AuthFormLayout>

			<AuthModal
				state={blockModalState}
				setState={setBlockModalState}
				title='Справка - аккаунт заблокирован'
				disableButton
				hideFooter
			>
				<Stack direction='column' gap={1}>
					<OnyxTypography
						tpSize='1.15rem'
						tpWeight='bold'
						text='Если учетная запись была заблокирована вследствии некорректного ввода данных для авторизации'
					/>
					<Stack direction='row' alignItems='center' gap={1} sx={{ paddingLeft: '.5rem' }}>
						<DoneIcon sx={{ color: 'green' }} />
						<OnyxTypography text='Блокировка пройдет сама через 1 час. По истечении часа Вы снова сможете пользоваться системой в полной мере.' />
					</Stack>
					<Stack direction='row' alignItems='center' gap={1} sx={{ paddingLeft: '.5rem' }}>
						<DoneIcon sx={{ color: 'green' }} />
						<OnyxTypography text='Система выставляет причину блокировки для таких аккаунтов как "Подозрительное поведение" или "Подозрительная активность".' />
					</Stack>
					<Divider sx={{ margin: '.5rem 0' }} />

					<OnyxTypography
						tpSize='1.15rem'
						tpWeight='bold'
						text='Блокировка аккаунта по любым иным причинам'
						tpVariant='subtitle1'
					/>

					<Stack direction='row' alignItems='center' gap={1} sx={{ paddingLeft: '.5rem' }}>
						<DangerousIcon sx={{ color: 'red' }} />
						<OnyxTypography text='В случае блокировки в системе по другой причине, Вам необходимо связаться с технической поддержкой для выяснения дальнейших действий.' />
					</Stack>
					<Stack direction='row' alignItems='center' gap={1} sx={{ paddingLeft: '.5rem' }}>
						<ContactsIcon sx={{ color: '#006fba' }} />
						<OnyxTypography component='div'>
							Контакты технической поддержки можно найти в верхней части текущей страницы или на нашем
							сайте&nbsp;
							<OnyxTypography
								sx={{ width: 'fit-content', display: 'inline' }}
								lkHref='https://umcmrg.ru'
								// lkTitle='Перейти на сайт'
								ttNode='Перейти на сайт'
								text='https://umcmrg.ru'
							/>
						</OnyxTypography>
					</Stack>

					<Divider sx={{ margin: '.5rem 0 .25rem' }} />
					<OnyxTypography
						text='Попытки обнуляются после успешной авторизации или через 1 час после последней попытки'
						tpColor='secondary'
						tpSize='.85rem'
						boxWrapper
						tpAlign='center'
						boxAlign='center'
					/>
				</Stack>
			</AuthModal>
		</>
	);
};

export default LoginElement;
