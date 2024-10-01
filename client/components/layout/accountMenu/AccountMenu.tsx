import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import Logout from '@mui/icons-material/Logout';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import Settings from '@mui/icons-material/Settings';
import { ListItemText } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import * as React from 'react';
import { BgAvatars } from '../..';
import { rtkApi } from '../../../redux/api';
import { useTypedSelector } from '../../../redux/hooks';
import { selectUser } from '../../../redux/slices/user';
import { useAppDispatch } from '../../../redux/store';
import AuthThunks from '../../../redux/thunks/auth';
import OnyxLink from '../../basics/OnyxLink';
import AccountRoleChanger from './AccountRoleChanger';

type AccountSubsType = {
	text: string;
	href?: string;
	onClick?: React.MouseEventHandler<HTMLLIElement>;
	icon?: JSX.Element;
};

export const AccountMenu = () => {
	const dispatcher = useAppDispatch();
	const userDTO = useTypedSelector(selectUser);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const { currentData } = rtkApi.usePersonalQuery('');

	const AccountSubs: { personal: AccountSubsType[]; config: AccountSubsType[] } = {
		personal: [
			{ text: 'Личный кабинет', href: '/', icon: <BadgeOutlinedIcon /> },
			{ text: 'Мой профиль', href: '/account/profile?current=cabinet', icon: <ManageAccountsOutlinedIcon /> },
			{ text: 'Мои курсы', href: '/account/courses', icon: <FolderOutlinedIcon /> },
		],
		config: [
			{ text: 'Настройки', href: '/account/profile?current=settings', icon: <Settings /> },
			{ text: 'Выйти', onClick: handleLogOut, icon: <Logout /> },
		],
	};

	return (
		<>
			<Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
				<Tooltip title='Профиль'>
					<IconButton
						onClick={handleClick}
						size='small'
						sx={{ ml: 2 }}
						aria-controls={open ? 'account-menu' : undefined}
						aria-haspopup='true'
						aria-expanded={open ? 'true' : undefined}
					>
						<BgAvatars bg={true} />
					</IconButton>
				</Tooltip>
			</Box>

			<Menu
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				sx={{ width: '100%' }}
				slotProps={{
					paper: {
						elevation: 0,
						sx: {
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							mt: 1.5,
							'& .MuiAvatar-root': {
								width: 32,
								height: 32,
								ml: -0.5,
								mr: 1,
							},
							'&:before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 0,
								right: 14,
								width: 10,
								height: 10,
								bgcolor: 'background.paper',
								transform: 'translateY(-50%) rotate(45deg)',
								zIndex: 0,
							},
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<Box sx={{ padding: '20px' }}>
					<Stack
						spacing={3}
						direction='row'
						alignItems='center'
						sx={{
							marginBottom:
								!!userDTO._permittedSystemRoles?.length && userDTO._permittedSystemRoles.length > 1
									? '.25rem'
									: 'unset',
						}}
					>
						<Typography
							color='primary'
							variant='body1'
							sx={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}
						>
							{currentData == null || (!currentData.surname && !currentData.name)
								? 'Пользователь Системы'
								: `${currentData.surname || ''} ${currentData.name || ''}`.trim()}
						</Typography>

						{!!userDTO._systemRole &&
							!(!!userDTO._permittedSystemRoles?.length && userDTO._permittedSystemRoles.length > 1) && (
								<AccountRoleChanger chipOnly />
							)}
					</Stack>

					{!!userDTO._permittedSystemRoles?.length && userDTO._permittedSystemRoles.length > 1 && (
						<AccountRoleChanger onyxSelectProps={{ fullwidth: true }} />
					)}
				</Box>

				<Divider />
				{AccountSubs.personal.map((el, index) =>
					el.href ? (
						<OnyxLink blockElement href={el.href} key={index}>
							<AccountMenuItem text={el.text} onClick={el.onClick} icon={el.icon} />
						</OnyxLink>
					) : (
						<AccountMenuItem text={el.text} onClick={el.onClick} icon={el.icon} key={index} />
					),
				)}

				<Divider />
				{AccountSubs.config.map((el, index) =>
					el.href ? (
						<OnyxLink blockElement href={el.href} key={index}>
							<AccountMenuItem text={el.text} onClick={el.onClick} icon={el.icon} />
						</OnyxLink>
					) : (
						<AccountMenuItem text={el.text} onClick={el.onClick} icon={el.icon} key={index} />
					),
				)}
			</Menu>
		</>
	);

	function handleLogOut() {
		dispatcher(AuthThunks.disconnect());
	}

	function handleClose() {
		setAnchorEl(null);
	}

	function handleClick(event: React.MouseEvent<HTMLElement>) {
		setAnchorEl(event.currentTarget);
	}
};

interface AccountMenuItemI {
	text: string;
	onClick?: React.MouseEventHandler<HTMLLIElement>;
	icon?: JSX.Element;
}
function AccountMenuItem(props: AccountMenuItemI) {
	return (
		<MenuItem onClick={props.onClick}>
			{props.icon && <ListItemIcon>{props.icon}</ListItemIcon>}
			<ListItemText>{props.text}</ListItemText>
		</MenuItem>
	);
}
