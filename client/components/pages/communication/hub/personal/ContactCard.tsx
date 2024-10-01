import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Button, Paper, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { rtkApi } from '../../../../../redux/api';
import { ChatContactsI, UserFriendsI } from '../../../../../redux/endpoints/chatEnd';
import { useTypedSelector } from '../../../../../redux/hooks';
import OnyxAlertModal from '../../../../basics/OnyxAlertModal';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import { BgAvatars } from '../../../../utils/bgAvatars/BgAvatars';
import ClassicLoader from '../../../../utils/loaders/ClassicLoader';
import { notification } from '../../../../utils/notifications/Notification';

interface IContactCard extends ChatContactsI {
	disableControls?: boolean;
	friend?: boolean;
	friendsObject?: UserFriendsI;
	participator?: boolean;
	participators?: string[];
	excludeContact?: Function;
}

/**
 * @IUnknown404I
 * @param contact as ChatContactT object with public user chat-data;
 * @returns Chat contact card of passed user.
 */
function ContactCard(contact: IContactCard) {
	const router = useRouter();
	const userData = useTypedSelector(store => store.user);

	const [adding, setAdding] = React.useState<boolean>(false);
	const [creating, setCreating] = React.useState<boolean>(false);
	const [excludeState, setExcludeState] = React.useState<boolean>(false);

	const { data: privateRid, refetch: privateRidRefetch } = rtkApi.usePrivateChatRidQuery(contact.username);
	const { data: userFriends } = rtkApi.useFriendsQuery('');

	const [requestFriendMutation] = rtkApi.useFriendsRequestMutation();
	const [createPrivateChatMutation] = rtkApi.useCreatePrivateChatMutation();

	return (
		<Paper
			elevation={3}
			sx={{
				width: '100%',
				minWidth: contact.username === userData.username ? 'min(98vw, 300px)' : 'fit-content',
				borderRadius: '15px',
				padding: '.5rem',
				border: theme => `1px inset ${theme.palette.primary.light}`,
			}}
			onContextMenu={e => e.stopPropagation()}
		>
			<Stack
				gap={2}
				alignItems='center'
				justifyContent='space-between'
				sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
			>
				<Stack gap={2} direction='row' alignItems='center' justifyContent='center' sx={{ width: '100%' }}>
					<BgAvatars
						bg
						widthAvatar='60px'
						heightAvatar='60px'
						avatar={{ avatarUrl: contact.avatar || '', fio: `${contact.surname} ${contact.name}` }}
					/>

					<Stack direction='column' width='100%'>
						<OnyxTypography text={`${contact.surname} ${contact.name}`} tpWeight='bold' tpSize='1.15rem' />
						<OnyxTypography
							text={contact.email}
							tpColor='secondary'
							tpSize='.85rem'
							sx={{ margin: '0 0 .5rem' }}
						/>
						{contact.position && !contact.disableControls && (
							<OnyxTypography text={contact.position} tpColor='secondary' tpSize='.85rem' />
						)}
					</Stack>

					{contact.disableControls && contact.position && (
						<OnyxTypography
							text={contact.position}
							tpColor='secondary'
							tpSize='.85rem'
							sx={{ width: contact.disableControls ? '100%' : '' }}
						/>
					)}
				</Stack>

				{contact.username !== userData.username && !contact.disableControls && (
					<Stack
						minWidth='175px'
						sx={{
							flexDirection: { xs: 'row', sm: 'column' },
							width: { xs: '100%', sm: 'fit-content' },
							gap: '.25rem',
							'> button': { fontSize: '.85rem' },
						}}
					>
						{contact.excludeContact !== undefined && (
							<>
								<Button
									variant='contained'
									size='small'
									sx={{ paddingInline: '1.25rem' }}
									onClick={() => setExcludeState(true)}
								>
									<PersonRemoveIcon sx={{ marginRight: '.5rem', fontSize: '1.25rem' }} />
									Исключить
								</Button>

								<OnyxAlertModal
									title='Подтвердите действие'
									state={excludeState}
									setState={setExcludeState}
									hideButtonOnOpen
									disableCloseButton
									sx={{ zIndex: excludeState ? '99999' : '' }}
								>
									<OnyxTypography tpSize='1rem'>
										Вы уверены, что хотите исключить выбранного пользователя?
									</OnyxTypography>
									<OnyxTypography tpSize='1rem'>
										Это действие носит безвозвратный характер.
									</OnyxTypography>
									<OnyxTypography tpSize='1rem' tpWeight='bold'>
										Исключаемый пользователь навсегда потеряет доступ к информации текущего чата.
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
											onClick={() => setExcludeState(false)}
										>
											Отменить
										</Button>
										<Button
											variant='outlined'
											size='small'
											onClick={() => contact.excludeContact!()}
										>
											Исключить пользователя
										</Button>
									</Stack>
								</OnyxAlertModal>
							</>
						)}

						{!!privateRid ? (
							<OnyxTypography
								lkHref={`/communication/rooms/${privateRid.rid}`}
								lkTitle={
									router.asPath.includes(`/rooms/${privateRid.rid}`) ? 'Чат уже открыт' : undefined
								}
								onClick={e => {
									if (
										contact.username === userData.username ||
										router.asPath.includes(`/rooms/${privateRid.rid}`)
									)
										e.preventDefault();
								}}
							>
								<Button
									size='small'
									variant='contained'
									disabled={
										contact.username === userData.username ||
										router.asPath.includes(`/rooms/${privateRid.rid}`)
									}
									sx={{ paddingInline: '1.25rem', width: '100%', fontSize: '.85rem' }}
									onClick={() => (contact.username === userData.username ? {} : createChatInit())}
								>
									<RateReviewIcon sx={{ marginRight: '.5rem', fontSize: '1.25rem' }} />
									Открыть чат
								</Button>
							</OnyxTypography>
						) : (
							<Button
								size='small'
								variant='outlined'
								disabled={contact.username === userData.username}
								sx={{ paddingInline: '1.25rem' }}
								onClick={() => (contact.username === userData.username ? {} : createChatInit())}
							>
								{creating && <ClassicLoader iconVariant />}
								<MarkUnreadChatAltIcon sx={{ marginRight: '.5rem', fontSize: '1.25rem' }} /> Создать чат
							</Button>
						)}

						<Button
							disabled={isFriendButtonDisabled(contact, contact.friendsObject || userFriends)}
							size='small'
							color='success'
							variant='outlined'
							sx={{ paddingInline: '1.25rem' }}
							onClick={requestFriendInit}
						>
							{adding && <ClassicLoader iconVariant />}
							{contact.friend
								? 'В списке друзей'
								: getFriendButtonContent(contact, contact.friendsObject || userFriends)}
						</Button>
					</Stack>
				)}
			</Stack>
		</Paper>
	);

	function createChatInit() {
		if (!userData.username) return;
		setCreating(true);
		createPrivateChatMutation
			.call('', {
				name: `${userData.username} - ${contact.username}`,
				initialUsers: [userData.username, contact.username],
			})
			.then(res => {
				if (!('error' in res)) {
					privateRidRefetch();
					notification({
						type: 'success',
						message: 'Новый чат успешно создан! Он появится в разделе "Личные".',
					});
				}
			})
			.catch(() =>
				notification({
					type: 'error',
					message: 'Не удалось создать приватный чат. Обновите страницу или попробуйте позже.',
				}),
			)
			.finally(() => setCreating(false));
	}

	function requestFriendInit() {
		if (
			(contact.friendsObject?.accepted && contact.friendsObject.accepted.includes(contact.username)) ||
			(contact.friendsObject?.requested && contact.friendsObject.requested.includes(contact.username)) ||
			(contact.friendsObject?.pending && contact.friendsObject.pending.includes(contact.username))
		)
			return;

		setAdding(true);
		requestFriendMutation
			.call('', { friendUsername: contact.username })
			.then(res => {
				if (!('error' in res))
					notification({
						type: 'success',
						message: 'Заявка на добавление в друзья успешно отправлена!',
					});
			})
			.catch(() =>
				notification({
					type: 'error',
					message: 'Не отправить заявку на добавление в друзья! Обновите страницу или попробуйте позже.',
				}),
			)
			.finally(() => setAdding(false));
	}
}

export default ContactCard;

function isFriendButtonDisabled(
	contact: IContactCard,
	friends: UserFriendsI | undefined = undefined,
	currentUsername: string = '',
	adding: boolean = false,
): boolean {
	return !!(
		contact.username === currentUsername ||
		contact.friend ||
		adding ||
		(!!contact.friendsObject
			? (contact.friendsObject?.accepted && contact.friendsObject.accepted.includes(contact.username)) ||
			  (contact.friendsObject?.requested && contact.friendsObject.requested.includes(contact.username)) ||
			  (contact.friendsObject?.pending && contact.friendsObject.pending.includes(contact.username))
			: (friends?.accepted && friends.accepted.includes(contact.username)) ||
			  (friends?.requested && friends.requested.includes(contact.username)) ||
			  (friends?.pending && friends.pending.includes(contact.username)))
	);
}

function getFriendButtonContent(contact: IContactCard, friends: UserFriendsI | undefined = undefined): React.ReactNode {
	return friends?.accepted ? (
		friends.accepted.includes(contact.username) ? (
			'В списке друзей'
		) : friends?.requested && friends.requested.includes(contact.username) ? (
			'Заявка уже отправлена'
		) : friends?.pending && friends.pending.includes(contact.username) ? (
			'Ожидает подтверждения!'
		) : (
			<>
				<PersonAddIcon sx={{ marginRight: '.5rem', fontSize: '1.25rem' }} />
				&nbsp;В друзья
			</>
		)
	) : (
		<>
			<ClassicLoader iconVariant /> Проверяем...
		</>
	);
}
