import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import SendAndArchiveOutlinedIcon from '@mui/icons-material/SendAndArchiveOutlined';
import { Box, Divider, Stack, TextField, useMediaQuery } from '@mui/material';
import React, { ReactNode } from 'react';
import { rtkApi } from '../../redux/api';
import { ChatMessageI } from '../../redux/endpoints/chatEnd';
import { useTypedSelector } from '../../redux/hooks';
import { SystemRolesOptions } from '../../redux/slices/user';
import chatSocket from '../../sockets/chat.ws';
import { ColorModeContext } from '../../theme/Theme';
import { formatDate } from '../../utils/date-utils';
import { copyTextToClipboard } from '../../utils/utilityFunctions';
import { OnyxTypography } from '../basics/OnyxTypography';
import ContactCard from '../pages/communication/hub/personal/ContactCard';
import DialogMessageContextMenu from './DialogMessageContextMenu';
import { getTpColor, relativeDateFormatter } from './chats-utility';

export const DialogMessage = (props: ChatMessageI & { fullwidth?: boolean }) => {
	const lgBreakpoint = useMediaQuery('(min-width:1200px)');
	const colorMode = React.useContext(ColorModeContext).mode;

	const userData = useTypedSelector(state => state.user);
	const { data: userChatContact } = rtkApi.useUserChatDataQuery({ username: props.username });
	const { data: friendsObject } = rtkApi.useFriendsQuery('');
	const { data: participatorsArray } = rtkApi.usePrivateParticipatorsQuery('');

	const formattedMessageDateTime = relativeDateFormatter(props.timeSent);
	const messageFontColor = getTpColor({ role: props.role }, colorMode as 'light' | 'dark');

	const [contextMenuState, setContextMenuState] = React.useState<boolean>(false);
	const [modifyingState, setModifyingState] = React.useState<boolean>(false);
	const [modifiedText, setModifiedText] = React.useState<string>(props.message);

	React.useEffect(() => {
		if (props.message !== modifiedText) setModifiedText(props.message);
	}, [props.message]);

	React.useEffect(() => {
		let timerId = setTimeout(function tick() {
			requestAnimationFrame(() => {});
			timerId = setTimeout(tick, 30e3);
		}, 30e3);
		return () => clearTimeout(timerId);
	}, [props.message]);

	return (
		<Stack
			width='100%'
			direction='column'
			alignItems={
				props.role === 'system' ? 'center' : props.username === userData.username ? 'flex-end' : 'flex-start'
			}
			justifyContent={
				props.role === 'system' ? 'center' : props.username === userData.username ? 'flex-end' : 'flex-start'
			}
		>
			<Box
				position='relative'
				sx={{
					backgroundColor:
						props.role === 'system'
							? theme => (theme.palette.mode === 'light' ? '#eaeaea' : '#949494')
							: props.username === userData.username
							? theme => (theme.palette.mode === 'light' ? '#d5f9ea' : '#349e79')
							: theme => (theme.palette.mode === 'light' ? '#e8f3ff' : '#6464e1'),
					width: props.fullwidth ? '100%' : 'fit-content',
					minWidth: '300px',
					maxWidth: props.fullwidth ? 'unset' : lgBreakpoint ? 'min(90%, 1000px)' : '95%',
					borderRadius: '12px',
					padding: '.5rem .75rem',
					border: theme => (modifyingState ? `2px solid ${theme.palette.primary.main}` : ''),
					cursor: props.role === 'system' ? 'help' : '',
				}}
				onContextMenu={e => {
					if (modifyingState) return;

					e.preventDefault();
					setContextMenuState(true);
				}}
			>
				{props.role !== 'system' && (
					<Stack
						direction='row'
						justifyContent='space-between'
						gap={1}
						alignItems='center'
						marginBottom='.25rem'
					>
						<Stack direction='row' justifyContent='space-between' gap={1} alignItems='center'>
							<OnyxTypography
								component='div'
								tpSize='.85rem'
								hoverStyles={props.username !== userData.username}
								ttNode={
									props.username !== userData.username && userChatContact ? (
										<ContactCard
											{...userChatContact}
											friendsObject={friendsObject}
											participators={participatorsArray}
										/>
									) : undefined
								}
								ttOnClickMode
								ttFollow={false}
								ttPlacement='bottom'
								tpColor={messageFontColor}
								sx={{ display: 'inline', fontStyle: 'italic' }}
							>
								{props.fio}
							</OnyxTypography>
							{props.role !== undefined && props.role !== 'common' && (
								<OnyxTypography
									component='i'
									tpSize='.85rem'
									tpColor={messageFontColor}
									sx={{ display: 'inline', fontStyle: 'italic', marginLeft: '.5rem' }}
								>
									&nbsp;{props.role}
								</OnyxTypography>
							)}
						</Stack>

						<OnyxTypography tpSize='.85rem' sx={{ fontStyle: 'italic' }} tpColor={messageFontColor}>
							{formattedMessageDateTime}
						</OnyxTypography>
					</Stack>
				)}

				{modifyingState ? (
					<>
						<Divider sx={{ margin: '.5rem auto' }} />
						<Stack direction='row' justifyContent='center' sx={{ gap: '.25rem' }}>
							<TextField
								focused
								multiline
								fullWidth
								maxRows={4}
								size='small'
								value={modifiedText}
								variant='standard'
								inputProps={{ maxLength: 1024 }}
								onChange={e => {
									if (
										e.target.value === '\n' ||
										(e.target.value === 'Backspace' && modifiedText.endsWith('\n'))
									) {
										e.preventDefault();
										e.stopPropagation();
										return;
									}
									setModifiedText(e.target.value);
								}}
								onKeyDown={handleKeyDown}
								sx={{
									minWidth: 'min(90vw, 450px)',
									fontSize: '.85rem',
									textarea: { fontSize: '1rem' },
									div: {
										'::before': { borderBottom: 'unset !important' },
									},
								}}
							/>
							<Stack
								sx={{
									flexDirection: modifiedText.split('\n').length > 1 ? 'column-reverse' : 'row',
									gap: '.25rem',
								}}
								alignItems='center'
								justifyContent='center'
							>
								<OnyxTypography
									hoverStyles
									tpSize='1.25rem'
									tpColor='secondary'
									ttNode='Отменить изменение'
									ttFollow={false}
									ttPlacement={modifiedText.split('\n').length > 1 ? 'bottom' : 'top'}
								>
									<DoNotDisturbIcon onClick={handleModifyingCancel} />
								</OnyxTypography>
								<OnyxTypography
									hoverStyles
									tpSize='1.25rem'
									tpColor='secondary'
									ttNode='Изменить сообщение'
									ttFollow={false}
									ttPlacement='top'
								>
									<SendAndArchiveOutlinedIcon onClick={handleModify} />
								</OnyxTypography>
							</Stack>
						</Stack>
					</>
				) : (
					<OnyxTypography
						tpSize={props.role === 'system' ? '.85rem' : undefined}
						tpAlign={props.role === 'system' ? 'center' : undefined}
						sx={{ fontStyle: props.role === 'system' ? 'italic' : undefined }}
						ttNode={
							props.role === 'system'
								? `Дата оповещения: ${formatDate(new Date(props.timeSent), { mode: 'full' })}`
								: undefined
						}
						ttPlacement='bottom'
						ttFollow={false}
					>
						{props.message.split('\n').map((line, index) =>
							index === 0 ? (
								<ParsedMessageLine key={index} line={line} />
							) : (
								<>
									{<ParsedMessageLine key={index} line={line} />}
									<br />
								</>
							),
						)}
					</OnyxTypography>
				)}

				{props.modified && (
					<Stack
						direction='row'
						width='100%'
						justifyContent='flex-end'
						alignItems='center'
						sx={{ gap: '.35rem', svg: { color: theme => theme.palette.secondary.main, fontSize: '1rem' } }}
					>
						<ManageHistoryIcon />
						<OnyxTypography
							text='было изменено'
							tpSize='.85rem'
							tpColor='secondary'
							ttNode={`Изменено: ${props.modified?.by ? props.modified.by + ' ' : ''}${formatDate(
								new Date(props.modified.timestamp),
								{ mode: 'full' },
							)}`}
							sx={{ '&:hover': { cursor: 'help' } }}
						/>
					</Stack>
				)}

				{props.role !== 'system' && !modifyingState && (
					// <ContextMenu
					<DialogMessageContextMenu
						timeSent={typeof props.timeSent === 'number' ? props.timeSent : undefined}
						openSide={props.username === userData.username ? 'right' : 'left'}
						state={contextMenuState}
						updateState={setContextMenuState}
						handleCopy={handleContextCopy}
						handleModify={userData.username === props.username ? handleContextModifyClick : undefined}
						handleDelete={
							SystemRolesOptions[userData._systemRole].accessLevel >= 4 ||
							userData.username === props.username
								? handleContextDelete
								: undefined
						}
					/>
				)}
			</Box>
		</Stack>
	);

	function handleContextCopy() {
		copyTextToClipboard(props.message);
	}

	function handleContextDelete() {
		chatSocket.emit('message:delete', props);
	}

	function handleContextModifyClick() {
		setModifyingState(true);
	}

	function handleModify() {
		setModifyingState(false);
		if (!modifiedText || modifiedText === props.message) return;
		chatSocket.emit('message:modify', { message: props, text: modifiedText });
	}

	function handleModifyingCancel() {
		setModifiedText(props.message);
		setModifyingState(false);
	}

	function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
		if (event.code === 'Backspace' && modifiedText.endsWith('\n')) {
			event.preventDefault();
			event.stopPropagation();
			setModifiedText(prev => prev.slice(0, prev.length - 1));
			return;
		}

		if (event.code === 'Enter' || event.code === 'NumpadEnter') {
			event.preventDefault();
			event.stopPropagation();

			if (event.ctrlKey) {
				setModifiedText(prev => prev + '\n');
				return;
			}
			handleModify();
		}
	}

	function ParsedMessageLine({ line }: { line: string }): ReactNode {
		const words = line.split(' ');
		return words.map((word, index) =>
			word.startsWith('http://') || word.startsWith('https://') ? (
				<OnyxTypography
					key={index}
					component='span'
					hoverStyles
					text={word.concat(' ')}
					lkHref={word}
					ttNode='Перейти по ссылке'
					lkProps={{ rel: 'norefferer', target: '_blank' }}
				/>
			) : (
				word.concat(' ')
			),
		);
	}
};

export default DialogMessage;
