import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Button, ListItem, ListItemAvatar, ListItemText, Stack } from '@mui/material';
import { OnyxTypography } from '../../../../basics/OnyxTypography';

interface ProfileCardElementI {
	icon: JSX.Element;
	helperText: string;
	value: string | JSX.Element;
	passwordMode?: {
		visibility: boolean;
		setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
		passwordRef: { loading: boolean; value: string | undefined };
	};
	modifyClick?: { onClick: (e: React.MouseEventHandler<HTMLButtonElement>) => void };
}

function ProfileCardElement(payload: ProfileCardElementI) {
	return (
		<ListItem>
			<ListItemAvatar>{payload.icon}</ListItemAvatar>
			<ListItemText
				disableTypography
				primary={payload.helperText}
				secondary={
					<OnyxTypography tpVariant='body1' tpSize='1.25rem'>
						{payload.value}
					</OnyxTypography>
				}
			/>
			<Stack direction='row' spacing={0} gap={0}>
				{payload.passwordMode != null && payload?.passwordMode?.setVisibility != null && (
					<OnyxTypography
						boxWrapper
						boxWidth='fit-content'
						ttNode={payload.passwordMode.visibility ? 'Скрыть пароль' : 'Показать пароль'}
					>
						<Button
							size='large'
							onClick={() => payload.passwordMode!.setVisibility(prev => !prev)}
							sx={{ borderRadius: '20px' }}
						>
							{payload.passwordMode.visibility ? (
								<VisibilityOffOutlinedIcon />
							) : (
								<VisibilityOutlinedIcon />
							)}
						</Button>
					</OnyxTypography>
				)}
				{payload.modifyClick != null && (
					<OnyxTypography boxWrapper boxWidth='fit-content' ttNode='Изменить'>
						<Button
							size='large'
							onClick={
								payload.modifyClick && payload.modifyClick.onClick
									? //@ts-ignore
									  e => payload.modifyClick?.onClick(e)
									: undefined
							}
							sx={{ borderRadius: '20px' }}
						>
							<ModeEditOutlineOutlinedIcon />
						</Button>
					</OnyxTypography>
				)}
			</Stack>
		</ListItem>
	);
}

export default ProfileCardElement;
