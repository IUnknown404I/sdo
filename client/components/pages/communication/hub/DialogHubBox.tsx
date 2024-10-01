import { Button, Divider, Paper, Stack } from '@mui/material';
import React from 'react';
import { ColorModeContext } from '../../../../theme/Theme';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import MessageHubBox from './MessageHubBox';

interface DialogHubBoxI {
	rid?: string;
	title?: string;
	publicChat?: boolean;
	enabledHeader?: boolean;
	bottomDivider?: boolean;
	align?: 'row' | 'column';
	participators?: { name: string; online: boolean }[] | 'system';
	lastMessages?: { name: string; time: string; message: string }[];
}

function DialogHubBox(payload: DialogHubBoxI) {
	const colorMode = React.useContext(ColorModeContext).mode;
	const horizontalAlign = !!payload.align && payload.align === 'row';

	return (
		<Paper
			elevation={3}
			sx={{
				height: '100%',
				padding: '.75rem',
				borderRadius: '14px',
				backgroundColor: theme => (theme.palette.mode === 'light' ? '#ffffff' : ''),
			}}
		>
			<Stack
				direction={horizontalAlign ? 'row' : 'column'}
				gap={1}
				spacing={1}
				alignItems='center'
				justifyContent='space-between'
				sx={{ width: '100%', height: '100%' }}
			>
				<Stack
					direction='column'
					spacing={1}
					justifyContent='flex-start'
					sx={{
						width: '100%',
						paddingRight: horizontalAlign ? '.5rem' : undefined,
						borderRight: horizontalAlign ? '1px solid lightgrey' : undefined,
					}}
				>
					{payload.enabledHeader != null ? (
						<Paper
							elevation={2}
							sx={{
								backgroundColor: 'rgba(#eef8ff, .85)',
								padding: '.5rem',
								margin: '-.75rem',
								borderRadius: '5px',
								marginBottom: '0',
								borderBottomLeftRadius: '5px',
								borderBottomRightRadius: '5px',
							}}
						>
							<OnyxTypography tpColor='primary' tpSize='1.25rem' tpWeight='bold' boxWrapper>
								{payload.title || 'Заголовок диалога'}
							</OnyxTypography>
						</Paper>
					) : (
						<OnyxTypography tpColor='primary' tpSize='1.25rem' tpWeight='bold' boxWrapper>
							{payload.title || 'Заголовок диалога'}
						</OnyxTypography>
					)}
					<MessageHubBox messages={payload.lastMessages || []} colorMode={colorMode} />
					{payload.bottomDivider != null && <Divider sx={{ width: '100%' }} />}
				</Stack>

				<Stack
					width='100%'
					direction={horizontalAlign ? 'column' : 'row'}
					justifyContent='space-between'
					alignItems={!horizontalAlign ? 'flex-end' : 'center'}
				>
					<Stack
						direction={horizontalAlign ? 'column' : 'row'}
						alignItems={typeof payload.participators === 'string' ? 'center' : 'flex-end'}
						justifyContent='space-between'
						gap={horizontalAlign ? 0 : 2}
					>
						<OnyxTypography
							tpColor='secondary'
							tpSize='.85rem'
							tpAlign={typeof payload.participators === 'string' ? 'left' : 'right'}
						>
							{
								<>
									Участников:&nbsp;
									{payload.publicChat
										? 'Для всех пользователей'
										: payload.participators?.length || '0'}
								</>
							}
						</OnyxTypography>

						{typeof payload.participators !== 'string' && (
							<OnyxTypography tpColor='secondary' tpAlign='right' tpSize='.85rem'>
								<>
									Сейчас в сети:&nbsp;
									{typeof payload.participators === 'string'
										? '-'
										: payload.participators?.filter(el => el.online)?.length || '0'}
								</>
							</OnyxTypography>
						)}
					</Stack>

					<OnyxTypography lkHref={`/communication/rooms/${payload?.rid}`} boxWrapper boxWidth='fit-content'>
						<Button
							variant={colorMode === 'light' ? 'outlined' : 'contained'}
							size='medium'
							sx={{ marginTop: !horizontalAlign ? undefined : '.5rem', width: '185px' }}
						>
							Войти в комнату
						</Button>
					</OnyxTypography>
				</Stack>
			</Stack>
		</Paper>
	);
}

export default DialogHubBox;
