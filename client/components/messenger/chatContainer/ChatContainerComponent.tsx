import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import SendAndArchiveOutlinedIcon from '@mui/icons-material/SendAndArchiveOutlined';
import { Box, Button, Divider, Paper, Stack, TextField } from '@mui/material';
import { Categories, Theme as EmojiTheme } from 'emoji-picker-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import { rtkApi } from '../../../redux/api';
import { ChatContactsI, ChatI, ChatMessageI } from '../../../redux/endpoints/chatEnd';
import { useTypedSelector } from '../../../redux/hooks';
import { ColorModeContext } from '../../../theme/Theme';
import { scrollDivToBottom } from '../../../utils/utilityFunctions';
import { OnyxTypography } from '../../basics/OnyxTypography';
import ModernLoader from '../../utils/loaders/ModernLoader';
import { MessengerAvatarElement } from '../BasicComponents';
import DialogContainer from '../DialogContainer';
import DialogMessage from '../DialogMessage';
import { TOP_SPACING } from '../sidebarComponents/DialogDrawer';
import { ChatContainerProps } from './ChatContainer';

const Picker = dynamic(
	() => {
		return import('emoji-picker-react');
	},
	{ ssr: false },
);

const EMOJI_CATEGORIES = [
	{
		name: 'Последние',
		category: Categories.SUGGESTED,
	},
	{
		name: 'Смайлы',
		category: Categories.SMILEYS_PEOPLE,
	},
	{
		name: 'Природа',
		category: Categories.ANIMALS_NATURE,
	},
	{
		name: 'Активности',
		category: Categories.ACTIVITIES,
	},
	{
		name: 'Символы',
		category: Categories.SYMBOLS,
	},
];

interface ChatContainerComponentProps extends ChatContainerProps {
	chatDomRef: React.RefObject<HTMLDivElement>;
	chatID: string;
	isFullMode: boolean;
	online?: number;
	isSocketConnected: boolean;
	messages?: ChatMessageI[];
	emoji: {
		state: boolean;
		setState: React.Dispatch<React.SetStateAction<boolean>>;
	};
	inputText: {
		state: string;
		setState: React.Dispatch<React.SetStateAction<string>>;
	};
	handleSendMessage: () => void;
	updateMessageText: (additionalText: string) => void;
}

function ChatContainerComponent(props: ChatContainerComponentProps) {
	const router = useRouter();
	const inputRef = React.useRef<HTMLInputElement>();
	const firstRenderCheck = React.useRef<boolean>(false);
	const userData = useTypedSelector(store => store.user);
	const colorMode = React.useContext(ColorModeContext).mode;
	const { data: chatData } = rtkApi.useChatDataQuery(props.rid || '');

	const username = parseChatUsername(chatData, userData?.username);
	const { data: userChatData } = rtkApi.useUserChatDataQuery({ username });
	const currentDialogName = parseChatName(chatData, userChatData);

	// validating auto-scroll at the initial render with ready-data state
	React.useEffect(() => {
		if (!chatData || !props.messages) return;
		if (props.mode !== 'line' && !firstRenderCheck.current) scrollDivToBottom(props.chatDomRef);
		firstRenderCheck.current = true;
	}, [chatData, props.messages]);

	return (
		// @ts-ignore
		<Paper
			id={props.chatID}
			elevation={props.transparent ? 0 : 3}
			sx={{
				height: '100%',
				padding: '.75rem',
				overflowY: 'auto',
				maxHeight: '100%',
				borderRadius: '14px',
				backgroundColor: theme =>
					props.transparent ? 'transparent' : theme.palette.mode === 'light' ? '#ffffff' : '',
				display: props.mode !== 'full' ? 'flex' : '',
				flexDirection: { xs: 'column', lg: props.mode !== 'full' ? 'row' : '' },
				alignItems: props.mode !== 'full' ? 'center' : '',
				justifyContent: props.mode !== 'full' ? 'space-between' : '',
				gap: props.mode !== 'full' ? '1rem' : '',
				...props.sx,
			}}
		>
			<Stack
				direction={props.isFullMode ? 'column' : 'row'}
				gap={1}
				spacing={1}
				alignItems='center'
				justifyContent='space-between'
				sx={{ width: '100%' }}
			>
				{props.mode === 'line' && chatData?.status === 'private' && (
					<MessengerAvatarElement
						avatarUrl={userChatData?.avatar || undefined}
						name={currentDialogName}
						widthAvatar={70}
						heightAvatar={70}
						fontSize='1.5rem'
					/>
				)}

				<Stack
					direction='column'
					spacing={1}
					justifyContent='flex-start'
					sx={{
						width: '100%',
						paddingRight: props.isFullMode ? 'undefined' : '.5rem',
						borderRight: { xs: 'none', lg: props.isFullMode ? undefined : '1px solid lightgrey' },
					}}
				>
					{props.elevatedHeader != null ? (
						<Paper
							elevation={props.transparent ? 0 : 2}
							sx={{
								padding: '.5rem',
								margin: '-.75rem',
								marginBottom: '0',
								borderRadius: '5px',
								borderBottomLeftRadius: '5px',
								borderBottomRightRadius: '5px',
								backgroundColor: 'rgba(#eef8ff, .85)',
							}}
						>
							<Stack direction='row' alignItems='center' gap={2}>
								{props.mode === 'full' &&
									chatData?.status === 'private' &&
									router.asPath.includes('/communication/rooms/') && (
										<MessengerAvatarElement
											avatarUrl={userChatData?.avatar || undefined}
											name={currentDialogName}
											widthAvatar={55}
											heightAvatar={55}
										/>
									)}
								<OnyxTypography
									tpColor='primary'
									tpWeight='bold'
									boxWrapper
									sx={{ fontSize: { sx: '1.15rem', lg: '1.25rem' } }}
								>
									{currentDialogName || chatData?.name || 'Заголовок диалога'}
								</OnyxTypography>
							</Stack>
						</Paper>
					) : (
						!!!props.disableHeader && (
							<OnyxTypography
								tpColor='primary'
								tpWeight='bold'
								boxWrapper
								sx={{ fontSize: { sx: '1.15rem', lg: '1.25rem' } }}
							>
								{currentDialogName || chatData?.name || 'Заголовок диалога'}
							</OnyxTypography>
						)
					)}

					{props.mode === 'full' && (
						<Stack
							width='100%'
							direction={props.isFullMode ? 'row' : 'column'}
							justifyContent={
								router.asPath.includes(`/communication/rooms/${props.rid || ''}`)
									? 'flex-end'
									: 'space-between'
							}
							textAlign='right'
							gap={props.isFullMode ? 2 : 0}
						>
							{!router.asPath.includes(`/communication/rooms/${props.rid || ''}`) && (
								<OnyxTypography
									tpSize='.85rem'
									tpColor='secondary'
									ttNode='Открыть в полном режиме'
									// lkProps={{ target: '_blank' }}
									lkHref={`/communication/rooms/${chatData?.rid}`}
									boxWrapper
									boxAlign='flex-start'
									boxWidth='fit-content'
									boxVerticalAlign='flex-start'
									sx={{ svg: { fontSize: '1rem' } }}
								>
									<OpenInNewRoundedIcon /> Войти в комнату
								</OnyxTypography>
							)}

							<Box sx={{ display: 'inline-flex', gap: '.5rem' }}>
								<OnyxTypography
									tpColor='secondary'
									tpSize='.85rem'
									tpAlign={typeof props.participators === 'string' ? 'left' : 'right'}
								>
									{
										<>
											Участников:&nbsp;
											{props.publicChat
												? 'общий чат'
												: Array.isArray(props.participators)
												? props.participators?.length || '1'
												: chatData?.participators.length}
										</>
									}
								</OnyxTypography>

								{!props.publicChat && props.online !== undefined && (
									<OnyxTypography tpColor='secondary' tpAlign='right' tpSize='.85rem'>
										<>
											Сейчас в сети:&nbsp;
											{props.online || '1'}
										</>
									</OnyxTypography>
								)}
							</Box>
						</Stack>
					)}

					<Box
						height={
							props.sidebarChat
								? `calc(100vh - ${parseInt(TOP_SPACING.slice(0, TOP_SPACING.length - 2)) + 160}px)`
								: undefined
						}
						overflow='hidden'
						borderRadius='5px'
						sx={{ display: { xs: props.isFullMode ? 'block' : 'none', sm: 'block' } }}
					>
						<DialogContainer
							chatDomRef={props.chatDomRef}
							mode={props.isFullMode ? 'full' : 'line'}
							minHeight={props.mode === 'full' ? props.minHeight : 'fit-content'}
							maxHeight={
								props.mode === 'full'
									? props.maxHeight
									: props.mode === 'line'
									? '100px'
									: 'fit-content'
							}
						>
							{firstRenderCheck.current && props.isSocketConnected ? (
								!!props.messages?.length ? (
									props.mode !== 'line' ? (
										props.messages.map((message, index) => (
											<DialogMessage key={index} {...message} fullwidth={props.mode === 'line'} />
										))
									) : (
										<DialogMessage {...props.messages.slice(-1)[0]} fullwidth />
									)
								) : undefined
							) : (
								<ModernLoader
									tripleLoadersMode
									centered
									loading={true}
									containerSx={{ height: '100%' }}
								/>
							)}
						</DialogContainer>
					</Box>

					{props.bottomDivider != null && <Divider sx={{ width: '100%' }} />}
				</Stack>
			</Stack>

			<Stack
				width={props.isFullMode ? '100%' : 'fit-content'}
				alignItems={props.isFullMode ? 'flex-end' : 'center'}
				justifyContent='space-between'
				sx={{
					flexDirection: { xs: 'row', lg: props.isFullMode ? 'row' : 'column' },
					gap: { xs: '1rem', lg: '' },
				}}
			>
				{props.mode !== 'full' && (
					<Stack
						direction={props.isFullMode ? 'row' : 'column'}
						justifyContent='space-between'
						gap={props.isFullMode ? 2 : 0}
					>
						<OnyxTypography
							tpSize='.85rem'
							tpColor='secondary'
							sx={{
								textAlign: {
									xs: 'unset',
									lg: typeof props.participators === 'string' ? 'left' : 'right',
								},
							}}
						>
							{
								<>
									Участников:&nbsp;
									{props.publicChat
										? 'общий чат'
										: Array.isArray(props.participators)
										? props.participators?.length || '1'
										: chatData?.participators.length}
								</>
							}
						</OnyxTypography>

						{!props.publicChat && props.online !== undefined && (
							<OnyxTypography tpColor='secondary' tpAlign='right' tpSize='.85rem'>
								<>
									Сейчас в сети:&nbsp;
									{props.online || '1'}
								</>
							</OnyxTypography>
						)}
					</Stack>
				)}

				{props.inputEnable ? (
					<Stack width='100%' direction='column' alignItems='center' overflow='hidden' gap={0}>
						<Divider sx={{ width: '100%', margin: '.25rem auto 0' }} />

						<Stack
							width='100%'
							direction='row'
							alignItems='center'
							justifyContent='center'
							gap={1}
							sx={{
								'> p': {
									position: 'relative',
									marginTop: '.25rem',
									height: '27.5px',
									zIndex: '1',
									'&:before': {
										content: '""',
										position: 'absolute',
										inset: '0 0 0 0',
										borderRadius: '50%',
										opacity: '0',
										zIndex: '-1',
										transition: 'all .2s ease-in',
										backgroundColor: theme =>
											theme.palette.mode === 'light'
												? theme.palette.secondary.main
												: theme.palette.primary.main,
									},
								},
								'&:hover': { '&:before': { opacity: '1' } },
								svg: {
									color: theme => theme.palette.secondary.main,
									'&:hover': {
										color: theme => theme.palette.primary.main,
									},
								},
							}}
						>
							<TextField
								disabled={chatData?.status === 'private' && chatData.name.includes('до:')}
								inputRef={inputRef}
								id={`${props.chatID}-message-text`}
								label='Введите сообщение'
								multiline
								fullWidth
								maxRows={4}
								size='small'
								value={props.inputText.state}
								variant='standard'
								inputProps={{ maxLength: 1024 }}
								onChange={e => {
									if (
										e.target.value === '\n' ||
										(e.target.value === 'Backspace' && props.inputText.state.endsWith('\n'))
									) {
										e.preventDefault();
										e.stopPropagation();
										return;
									}
									props.inputText.setState(e.target.value);
								}}
								onKeyDown={handleKeyDown}
								sx={{
									div: {
										'::before': { borderBottom: 'unset !important' },
									},
								}}
							/>
							<OnyxTypography ttNode='Эмодзи' ttFollow={false} ttPlacement='top' hoverStyles>
								<EmojiEmotionsOutlinedIcon onClick={() => props.emoji.setState(prev => !prev)} />
							</OnyxTypography>
							<OnyxTypography
								hoverStyles
								ttNode='Отправить'
								ttPlacement='top'
								ttFollow={false}
								onClick={props.handleSendMessage}
							>
								<SendAndArchiveOutlinedIcon />
							</OnyxTypography>
						</Stack>

						<Box
							position={props.modalEmojis ? 'absolute' : undefined}
							width={props.modalEmojis ? 'min(320px, 98vw)' : '100%'}
							height={props.modalEmojis ? '300px' : props.emoji.state ? '350px' : '0px'}
							sx={{
								marginTop: props.modalEmojis ? '' : props.emoji.state ? '.5rem' : '0',
								transition: 'all .25s ease-in',
								bottom: props.modalEmojis ? '0' : '',
								right: props.modalEmojis ? '0' : '',
							}}
						>
							{props.emoji.state && (
								<Picker
									height={props.modalEmojis ? '300px' : props.emoji.state ? '350px' : '0px'}
									width={props.modalEmojis ? 'min(320px, 98vw)' : '100%'}
									searchDisabled
									lazyLoadEmojis
									skinTonesDisabled
									previewConfig={{ showPreview: false }}
									onEmojiClick={(emoji, e) => props.updateMessageText(emoji.emoji)}
									theme={colorMode as EmojiTheme | undefined}
									categories={EMOJI_CATEGORIES}
								/>
							)}
						</Box>
					</Stack>
				) : (
					<OnyxTypography lkHref={`/communication/rooms/${chatData?.rid}`} boxWrapper boxWidth='fit-content'>
						<Button
							variant={colorMode === 'light' ? 'outlined' : 'contained'}
							size='small'
							sx={{ marginTop: props.isFullMode ? undefined : '.5rem', width: '185px' }}
						>
							Войти в комнату
						</Button>
					</OnyxTypography>
				)}
			</Stack>
		</Paper>
	);

	function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
		if (event.code === 'Backspace' && props.inputText.state.endsWith('\n')) {
			event.preventDefault();
			event.stopPropagation();
			props.inputText.setState(prev => prev.slice(0, prev.length - 1));
			return;
		}

		if (event.code === 'Enter' || event.code === 'NumpadEnter') {
			event.preventDefault();
			event.stopPropagation();

			if (event.ctrlKey) {
				props.inputText.setState(prev =>
					inputRef.current?.selectionEnd
						? prev
								.slice(0, inputRef.current.selectionEnd)
								.concat('\n', prev.slice(inputRef.current.selectionEnd))
						: prev.concat('\n'),
				);
				setTimeout(
					() =>
						inputRef.current?.setSelectionRange(
							inputRef.current.selectionEnd,
							inputRef.current.selectionEnd,
						),
					40,
				);
				return;
			}

			// fetch logic
			props.handleSendMessage();
		}
	}
}

export function parseChatUsername(chatData?: Omit<ChatI, 'messages'>, chatUsername?: string): string {
	return chatData && chatUsername
		? chatData.status === 'private' && !chatData.name.includes('до:')
			? chatData.name
					.split('-')
					.filter(username => username.trim() !== chatUsername)[0]
					.trim()
			: chatData.name.includes('до:')
			? chatData.name.split('до:')[0].trim()
			: ''
		: '';
}

export function parseChatName(chatData?: Omit<ChatI, 'messages'>, friendData?: ChatContactsI): string {
	return chatData?.status === 'private' && chatData.name.includes('до:')
		? `${
				friendData?.surname && friendData?.name
					? `${friendData?.surname} ${friendData?.name}`
					: chatData?.name || 'Чат системы'
		  } до:`.concat(chatData.name.split('до:')[1])
		: friendData?.surname && friendData?.name
		? `${friendData?.surname} ${friendData?.name}`
		: chatData?.name || 'Чат системы';
}

export default ChatContainerComponent;
