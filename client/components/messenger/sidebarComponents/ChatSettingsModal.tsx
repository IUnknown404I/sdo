import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import TitleIcon from '@mui/icons-material/Title';
import { Box, Button, Divider, Grow, Stack } from '@mui/material';
import React from 'react';
import { rtkApi } from '../../../redux/api';
import { ChatI, ChatParticipatorI, UserFriendsI } from '../../../redux/endpoints/chatEnd';
import { useTypedSelector } from '../../../redux/hooks';
import { formatData } from '../../../utils/date-utils';
import OnyxAlertModal from '../../basics/OnyxAlertModal';
import { OnyxTypography } from '../../basics/OnyxTypography';
import ContactCard from '../../pages/communication/hub/personal/ContactCard';
import { notification } from '../../utils/notifications/Notification';

interface ChatSettingsModalI {
	state: boolean;
	setState: React.Dispatch<React.SetStateAction<boolean>>;
	chatData?: Omit<ChatI, 'messages'>;
}

const ChatSettingsModal = (props: ChatSettingsModalI) => {
	const userData = useTypedSelector(store => store.user);
	const [exitState, setExitState] = React.useState<boolean>(false);
	// const [nameChangeState, setNameChangeState] = React.useState<boolean>(false);
	const [participatorsShow, setParticipatorsShow] = React.useState<boolean>(false);

	const { data: friendsObject } = rtkApi.useFriendsQuery('');
	const { data: chatCreatorContact } = rtkApi.useUserChatDataQuery({
		username: props.chatData?.meta.createdBy || '',
	});
	const [leavePrivateChatMutation] = rtkApi.useLeavePrivateChatMutation();

	return (
		<OnyxAlertModal
			title='Параметры чата'
			state={props.state}
			setState={props.setState}
			hideButtonOnOpen
			disableCloseButton
		>
			<Stack direction='row' flexWrap='wrap' justifyContent='center' alignItems='center' gap={1}>
				{props.chatData?.status === 'group' && props.chatData?.meta.createdBy === userData.username ? (
					<Button variant='outlined' size='medium'>
						<TitleIcon sx={{ marginRight: '.25rem' }} />
						Переименовать чат
					</Button>
				) : (
					<OnyxTypography
						ttNode={
							props.chatData?.status !== 'group'
								? 'Запрещено для комнат данного типа.'
								: 'Вы не являетесь администратором комнаты.'
						}
						ttFollow
					>
						<Button variant='outlined' size='medium' disabled>
							<TitleIcon sx={{ marginRight: '.25rem' }} />
							Переименовать чат
						</Button>
					</OnyxTypography>
				)}
				<Button
					variant={participatorsShow ? 'contained' : 'outlined'}
					size='medium'
					onClick={() => setParticipatorsShow(prev => !prev)}
				>
					<GroupIcon sx={{ marginRight: '.5rem' }} />
					Участники
				</Button>
				<Button variant='outlined' size='medium' onClick={() => setExitState(true)}>
					<LogoutIcon sx={{ marginRight: '.5rem', transform: 'rotate(180deg)' }} />
					Выйти из диалога
				</Button>
			</Stack>

			{participatorsShow && !!props.chatData && (
				<Grow in={participatorsShow && !!props.chatData}>
					<Box
						sx={{
							height: participatorsShow && !!props.chatData ? '100%' : '0px',
							transition: 'all .25s ease-out',
							overflow: 'hidden',
						}}
					>
						<Divider sx={{ margin: '1rem auto' }} />
						<OnyxTypography
							tpSize='.85rem'
							tpColor='secondary'
							text={`Всего участников: ${props.chatData.participators.length}`}
						/>

						{props.chatData.participators
							.filter(participator => participator.username !== userData.username)
							.map((participator, index) => (
								<ParticipatorCard
									key={index}
									{...participator}
									friendsObject={friendsObject}
									excludeFunction={
										props.chatData && props.chatData?.meta.createdBy === userData.username
											? () => handleContactExclude(participator.username)
											: undefined
									}
								/>
							))}
					</Box>
				</Grow>
			)}

			{props.chatData?.status === 'private' && (
				<>
					<Divider sx={{ margin: '1rem auto' }} />
					{!!props.chatData?.meta.createdAt && (
						<OnyxTypography
							tpSize='.85rem'
							tpColor='secondary'
							text={`Дата создания комнаты: ${formatData(new Date(props.chatData.meta.createdAt), {
								mode: 'full',
							})}`}
						/>
					)}

					{!!chatCreatorContact && (
						<>
							<OnyxTypography
								tpSize='.85rem'
								tpColor='secondary'
								text='Администратор комнаты'
								sx={{ marginTop: '.25rem' }}
							/>
							<ContactCard
								participator
								{...chatCreatorContact}
								friendsObject={friendsObject}
								disableControls={props.chatData.meta.createdBy === userData.username}
							/>
						</>
					)}
				</>
			)}

			{/* <OnyxAlertModal
					title='Изменение названия комнаты'
					state={nameChangeState}
					setState={setNameChangeState}
					hideButtonOnOpen
					disableCloseButton
				>
					<OnyxTypography tpSize='1rem'>
						Введите новое название
					</OnyxTypography>
					<Stack
						width='100%'
						justifyContent='flex-end'
						alignItems='center'
						direction='row'
						gap={2}
						marginTop='.75rem'
					>
						<Button variant='contained' size='small' onClick={() => setNameChangeState(false)}>
							Отменить
						</Button>
						<Button variant='outlined' size='small' onClick={handleChatLeave}>
							Изменить название
						</Button>
					</Stack>
				</OnyxAlertModal> */}

			<OnyxAlertModal
				title='Подтвердите действие'
				state={exitState}
				setState={setExitState}
				hideButtonOnOpen
				disableCloseButton
			>
				<OnyxTypography tpSize='1rem'>
					Вы уверены, что хотите выйти из комнаты? Данное действие носит безвозратный характер.&nbsp;
					<OnyxTypography text='Вы потеряете доступ ко всей информации данного чата.' tpWeight='bold' />
				</OnyxTypography>
				<Stack
					width='100%'
					justifyContent='flex-end'
					alignItems='center'
					direction='row'
					gap={1}
					marginTop='.75rem'
				>
					<Button
						variant='contained'
						size='small'
						sx={{ paddingInline: '1.75rem' }}
						onClick={() => setExitState(false)}
					>
						Вернуться
					</Button>
					<Button variant='outlined' size='small' onClick={handleChatLeave}>
						Выйти из чата
					</Button>
				</Stack>
			</OnyxAlertModal>
		</OnyxAlertModal>
	);

	function handleChatLeave() {
		if (!props.chatData?.rid) return;
		leavePrivateChatMutation
			.call('', { rid: props.chatData.rid })
			.then(() => notification({ message: 'Вы успешно вышли из диалога!', type: 'success' }))
			.catch(() =>
				notification({
					message: 'Не удалось выйти из диалога! Перезагрузиту страницу или попробуйте ещё раз.',
					type: 'error',
				}),
			);
	}

	function handleContactExclude(username: string) {
		if (!username) return;
	}
};

function ParticipatorCard(
	participator: ChatParticipatorI & { friendsObject?: UserFriendsI; excludeFunction?: Function },
): JSX.Element {
	const { data: participatorData, isLoading } = rtkApi.useUserChatDataQuery({ username: participator.username });

	return isLoading || !participatorData ? (
		<></>
	) : (
		<OnyxTypography
			ttFollow={false}
			ttNode={`Присоединился к чату: ${formatData(new Date(participator.inTimestamp), { mode: 'full' })}`}
			ttPlacement='top'
		>
			<ContactCard
				participator
				{...participatorData}
				friendsObject={participator.friendsObject}
				excludeContact={participator.excludeFunction}
			/>
		</OnyxTypography>
	);
}

export default ChatSettingsModal;
