import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import { Chip, List, Paper, Stack, Typography } from '@mui/material';
import { rtkApi } from '../../../../redux/api';
import { useTypedSelector } from '../../../../redux/hooks';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import { BgAvatars } from '../../../utils/bgAvatars/BgAvatars';
import ClassicLoader from '../../../utils/loaders/ClassicLoader';
import ProfileCardElement from './components/ProfileCardElement';

interface ProfileUserCardI {
	fio?: string;
	position?: string;
	role?: string;
	tel?: string;
	email?: string;
	company?: string;
	city?: string;
	passwordVisible?: {
		visibitily: boolean;
		visibilityChange: React.Dispatch<React.SetStateAction<boolean>>;
		passwordRef: { loading: boolean; value: string | undefined };
	};
	passwordChangeClick?: () => void;
	emailChangeClick?: () => void;
}

function ProfileUserCard(props: ProfileUserCardI) {
	const { currentData: userPersonal } = rtkApi.usePersonalQuery('');
	const userDTO = useTypedSelector(state => state.user);

	return (
		<Stack direction='column' spacing={2}>
			<Paper sx={{ borderRadius: '20px', padding: '11px' }}>
				<Stack
					sx={{ width: '100%' }}
					direction={{ xs: 'column', sm: 'row' }}
					spacing={3}
					alignItems='center'
					justifyContent='space-between'
				>
					<Stack direction={'row'} spacing={3} alignItems='center'>
						<BgAvatars bg={true} widthAvatar='80px' heightAvatar='80px' uploadMode />

						<Stack direction='column'>
							<Typography variant='h6'>
								{props.fio ||
									(userPersonal != null &&
										(!userPersonal.surname && !userPersonal.name
											? 'Пользователь Системы'
											: `${userPersonal.surname || ''} ${userPersonal.name || ''}`.trim()))}
							</Typography>
							<Typography variant='caption' maxWidth='180px'>
								{props.position ||
									(userPersonal != null && userPersonal.position) ||
									'Должность не указана'}
							</Typography>
						</Stack>
					</Stack>

					<Stack spacing={1} alignItems='center'>
						<Typography variant='caption'>роль в системе</Typography>
						{/* <Chip variant="outlined" color="info" label={'слушатель'} /> */}
						{/* <Chip variant="outlined" color="warning" label={'куратор'} /> */}
						<Chip variant='outlined' color='error' label='администратор' />
					</Stack>
				</Stack>
			</Paper>

			<Paper sx={{ borderRadius: '20px', padding: '20px' }}>
				<List sx={{ width: '100%' }}>
					<ProfileCardElement
						icon={<AccountCircleOutlinedIcon fontSize='large' color='primary' />}
						helperText='Логин'
						value={userDTO.username != null && userDTO.username || 'Не определен'}
					/>
					<ProfileCardElement
						icon={<VpnKeyOutlinedIcon fontSize='large' color='primary' />}
						helperText='Пароль'
						value={
							props.passwordVisible?.visibitily ? (
								props.passwordVisible.passwordRef.loading ? (
									<Stack direction='row' alignContent='center' gap={1}>
										<ClassicLoader /> Запрашиваем...
									</Stack>
								) : props.passwordVisible.passwordRef.value ? (
									'Данные получены'
								) : (
									'Не удалось получить данные'
								)
							) : (
								<OnyxTypography tpColor='primary'>
									<StarBorderOutlinedIcon />
									<StarBorderOutlinedIcon />
									<StarBorderOutlinedIcon />
									<StarBorderOutlinedIcon />
									<StarBorderOutlinedIcon />
									<StarBorderOutlinedIcon />
									<StarBorderOutlinedIcon />
								</OnyxTypography>
							)
						}
						modifyClick={props.passwordChangeClick ? { onClick: props.passwordChangeClick } : undefined}
					/>
					<ProfileCardElement
						icon={<EmailOutlinedIcon fontSize='large' color='primary' />}
						helperText='Электронная почта'
						value={props.email || userDTO.email || 'Почта не указана'}
						modifyClick={props.emailChangeClick ? { onClick: props.emailChangeClick } : undefined}
					/>
				</List>
			</Paper>
		</Stack>
	);
}

export default ProfileUserCard;
