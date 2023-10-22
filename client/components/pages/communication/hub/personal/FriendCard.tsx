import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Button, Paper, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { rtkApi } from '../../../../../redux/api';
import { UserFriendsI } from '../../../../../redux/endpoints/chatEnd';
import { useTypedSelector } from '../../../../../redux/hooks';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import { BgAvatars } from '../../../../utils/bgAvatars/BgAvatars';
import ClassicLoader from '../../../../utils/loaders/ClassicLoader';
import ModernLoader from '../../../../utils/loaders/ModernLoader';
import { notification } from '../../../../utils/notifications/Notification';

function FriendCard(props: {
	mode: keyof UserFriendsI;
	friendUsername: string;
	friendsObject?: UserFriendsI;
	privateParticipators?: string[];
}) {
	const router = useRouter();
	const userData = useTypedSelector(store => store.user);
	const {
		data: friendData,
		fulfilledTimeStamp,
		isLoading,
	} = rtkApi.useUserChatDataQuery({ username: props.friendUsername });
	const { data: privateRid, refetch: privateRidRefetch } = rtkApi.usePrivateChatRidQuery(props.friendUsername);

	const [createPrivateChatMutation] = rtkApi.useCreatePrivateChatMutation();
	const [friendsAddMutation] = rtkApi.useFriendsAddMutation();
	const [friendsRequestRejectMutation] = rtkApi.useFriendsRequestRejectMutation();
	const [friendsRejectMutation] = rtkApi.useFriendsRejectMutation();
	const [friendsDeleteMutation] = rtkApi.useFriendsDeleteMutation();

	const [creating, setCreating] = React.useState<boolean>(false);
	const [loading, setLoading] = React.useState<boolean>(false);

	return (
		<Paper
			elevation={3}
			sx={{
				width: '100%',
				borderRadius: '15px',
				padding: '.5rem',
				border: theme => `1px inset ${theme.palette.primary.light}`,
				minHeight: '75px',
			}}
		>
			<Stack
				gap={2}
				alignItems='center'
				justifyContent='space-between'
				sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
			>
				{fulfilledTimeStamp && !isLoading && friendData ? (
					<>
						<Stack gap={2} direction='row' alignItems='center' justifyContent='center'>
							<BgAvatars
								bg
								widthAvatar='60px'
								heightAvatar='60px'
								avatar={{
									avatarUrl: friendData.avatar || '',
									fio: `${friendData.surname} ${friendData.name}`,
								}}
							/>

							<Stack direction='column' width='100%'>
								<OnyxTypography
									text={`${friendData.surname} ${friendData.name}`}
									tpWeight='bold'
									tpSize='1.15rem'
								/>
								<OnyxTypography
									text={friendData.email}
									tpColor='secondary'
									tpSize='.85rem'
									sx={{ margin: '0 0 .5rem' }}
								/>
								{friendData.position && (
									<OnyxTypography text={friendData.position} tpColor='secondary' tpSize='.85rem' />
								)}
							</Stack>
						</Stack>

						<Stack
							minWidth='175px'
							sx={{
								flexDirection: { xs: 'row', sm: 'column' },
								width: { xs: '100%', sm: 'fit-content' },
								gap: '.25rem',
								'> button': { fontSize: '.85rem' },
							}}
						>
							{props.mode === 'pending' && (
								<>
									<Button
										disabled={loading}
										variant='contained'
										size='small'
										sx={{ paddingInline: '1.25rem' }}
										onClick={acceptFriendInit}
									>
										{loading && <ClassicLoader iconVariant />}
										<ThumbUpIcon sx={{ marginRight: '.5rem', fontSize: '1.25rem' }} />
										Принять
									</Button>
									<Button
										disabled={loading}
										variant='outlined'
										size='small'
										sx={{ paddingInline: '1.25rem' }}
										onClick={rejectFriendInit}
									>
										{loading && <ClassicLoader iconVariant />}
										<ThumbDownAltIcon sx={{ marginRight: '.5rem', fontSize: '1.25rem' }} />
										Отклонить
									</Button>
								</>
							)}

							{props.mode === 'requested' && (
								<Button
									disabled={loading}
									variant='contained'
									size='small'
									sx={{ paddingInline: '1.25rem' }}
									onClick={rejectRequestInit}
								>
									{loading && <ClassicLoader iconVariant />}
									<CancelScheduleSendIcon
										sx={{ marginRight: '.5rem', fontSize: '1.25rem', transform: 'rotate(180deg)' }}
									/>
									Отменить заявку
								</Button>
							)}

							{!!privateRid ? (
								<OnyxTypography
									lkHref={`/communication/rooms/${privateRid.rid}`}
									lkTitle={
										router.asPath.includes(`/rooms/${privateRid.rid}`)
											? 'Чат уже открыт'
											: undefined
									}
									onClick={e => {
										if (router.asPath.includes(`/rooms/${privateRid.rid}`)) e.preventDefault();
									}}
								>
									<Button
										size='small'
										disabled={router.asPath.includes(`/rooms/${privateRid.rid}`)}
										variant={props.mode === 'accepted' ? 'contained' : 'outlined'}
										sx={{ paddingInline: '1.25rem', width: '100%', fontSize: '.85rem' }}
										onClick={() => createChatInit()}
									>
										<RateReviewIcon sx={{ marginRight: '.5rem', fontSize: '1.25rem' }} />
										Открыть чат
									</Button>
								</OnyxTypography>
							) : (
								<Button
									disabled={
										creating ||
										(props.privateParticipators !== undefined &&
											props.privateParticipators.includes(props.friendUsername))
									}
									variant={props.mode === 'accepted' ? 'contained' : 'outlined'}
									size='small'
									sx={{ paddingInline: '1.25rem' }}
									onClick={() => createChatInit()}
								>
									{creating && <ClassicLoader iconVariant />}
									<MarkUnreadChatAltIcon sx={{ marginRight: '.5rem', fontSize: '1.25rem' }} /> Создать
									чат
								</Button>
							)}

							{props.mode === 'accepted' && (
								<Button
									disabled={loading}
									variant='outlined'
									size='small'
									sx={{ paddingInline: '1.25rem' }}
									onClick={deleteFriendInit}
								>
									{loading && <ClassicLoader iconVariant />}
									<PersonRemoveIcon sx={{ marginRight: '.5rem', fontSize: '1.25rem' }} />
									Удалить из друзей
								</Button>
							)}
						</Stack>
					</>
				) : (
					<>
						<ModernLoader centered />
					</>
				)}
			</Stack>
		</Paper>
	);

	function createChatInit(redirect: boolean = false) {
		if (!userData.username || !friendData?.username) return;
		setCreating(true);
		createPrivateChatMutation
			.call('', {
				name: `${userData.username} - ${friendData.username}`,
				initialUsers: [userData.username, friendData.username],
			})
			.then(res => {
				if (!('error' in res)) {
					notification({
						type: 'success',
						message: 'Новый чат успешно создан! Он появится в разделе "Личные".',
					});
					privateRidRefetch();
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

	function acceptFriendInit() {
		setLoading(true);
		friendsAddMutation
			.call('', { friendUsername: props.friendUsername })
			.then(res => {
				if (!('error' in res))
					notification({
						type: 'success',
						message: 'Пользователь успешно добавлен в список друзей!',
					});
			})
			.catch(() =>
				notification({
					type: 'error',
					message: 'Не удалось добватить пользователя в друзья! Обновите страницу или попробуйте позже.',
				}),
			)
			.finally(() => setLoading(false));
	}

	function rejectFriendInit() {
		setLoading(true);
		friendsRejectMutation
			.call('', { friendUsername: props.friendUsername })
			.then(res => {
				if (!('error' in res))
					notification({
						type: 'success',
						message: 'Заявка пользователя отклонена!',
					});
			})
			.catch(() =>
				notification({
					type: 'error',
					message: 'Не удалось отклонить заявку пользователя! Обновите страницу или попробуйте позже.',
				}),
			)
			.finally(() => setLoading(false));
	}

	function rejectRequestInit() {
		setLoading(true);
		friendsRequestRejectMutation
			.call('', { friendUsername: props.friendUsername })
			.then(res => {
				if (!('error' in res))
					notification({
						type: 'success',
						message: 'Заявка на добавление в друзья отозвана!',
					});
			})
			.catch(() =>
				notification({
					type: 'error',
					message: 'Не удалось отозвать заявку! Обновите страницу или попробуйте позже.',
				}),
			)
			.finally(() => setLoading(false));
	}

	function deleteFriendInit() {
		setLoading(true);
		friendsDeleteMutation
			.call('', { friendUsername: props.friendUsername })
			.then(res => {
				if (!('error' in res))
					notification({
						type: 'success',
						message: 'Пользователь удалён из списка друзей!',
					});
			})
			.catch(() =>
				notification({
					type: 'error',
					message: 'Не удалось удалить пользователя из друзей! Обновите страницу или попробуйте позже.',
				}),
			)
			.finally(() => setLoading(false));
	}
}

export default FriendCard;
