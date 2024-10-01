import { Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import React from 'react';
import { OnyxApiErrorResponseType, rtkApi } from '../../../redux/api';
import { useTypedSelector } from '../../../redux/hooks';
import { checkProductionMode } from '../../../utils/utilityFunctions';
import { OnyxTypography } from '../../basics/OnyxTypography';
import OnyxImgUploader from '../../basics/imageUploader/OnyxImageUploader';
import { notification } from '../notifications/Notification';

interface BgAvatarsI {
	avatar?: {
		username?: string;
		fio: string;
		avatarUrl: string;
	};
	bg?: boolean;
	widthAvatar?: string;
	heightAvatar?: string;
	uploadMode?: boolean | { callback?: () => void };
	usernameOverride?: string;
}

export const BgAvatars = (payload: BgAvatarsI) => {
	const username = useTypedSelector(store => store.user.username);
	const [uploaderState, setUploaderState] = React.useState<boolean>(false);

	const { data, refetch } = rtkApi.usePersonalQuery(payload.avatar?.username);
	const avatarsQueryData = rtkApi.useAllAvatarsQuery('', {
		refetchOnReconnect: true,
		refetchOnMountOrArgChange: 30,
		pollingInterval: 7 * 6e4,
	});
	const [personalDataUpdate] = rtkApi.usePutPersonalMutation();
	// const imageIdentifier = React.useMemo<number>(() => new Date().getTime(), []);

	const name = payload.avatar
		? payload.avatar.fio
		: data != null && (payload.usernameOverride || data.name || data?.surname)
		? `${data.surname || ''} ${data.name || ''}}`.trim()
		: 'Пользователь Системы';

	React.useEffect(() => {
		refetch();
	}, [payload.avatar?.username]);

	const handleAvatarUpload = React.useCallback(
		(avatarUrl: string) => {
			personalDataUpdate
				.call('', {
					...data,
					username: payload.avatar?.username,
					avatar: avatarUrl.split('avatars/')[1],
				})
				.then(response => {
					if (typeof response === 'object' && 'error' in response)
						avatarNotification(false, (response.error as OnyxApiErrorResponseType).data?.message);
					else avatarNotification(true);
				})
				.catch(() => avatarNotification(false))
				.finally(() => setUploaderState(false));
		},
		[data, payload.avatar?.username],
	);

	function avatarNotification(result: boolean, message?: string) {
		if (result) notification({ message: message || 'Аватар успешно изменен!', type: 'success' });
		else
			notification({
				message:
					message || 'Не удалось изменить аватар! Попробуйте перезагрузить страницу и попробовать снова.',
				type: 'error',
			});
	}

	return (
		<>
			{(!payload.avatar || !!payload.avatar.username) && !!payload.uploadMode ? (
				<OnyxTypography
					boxWrapper
					boxWidth='fit-content'
					ttNode='Выбрать другой аватар'
					ttPlacement='bottom'
					ttFollow={false}
				>
					<AvatarElement />
				</OnyxTypography>
			) : (
				<AvatarElement />
			)}

			{(!payload.avatar || !!payload.avatar.username) && !!payload.uploadMode && (
				<OnyxImgUploader
					showFileNames
					showFileSizes
					disableControls
					displayMode='small'
					maxSizeKb={512}
					fileTypes={['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']}
					state={uploaderState}
					setState={setUploaderState}
					image={data?.avatar}
					setImage={handleAvatarUpload}
					onUploadEnd={() => {
						rtkApi.util.invalidateTags(['User', 'Avatars']);
						refetch();
						if (typeof payload.uploadMode !== 'boolean' && !!payload.uploadMode?.callback)
							payload.uploadMode.callback();
						setUploaderState(false);
					}}
					url={{
						get: { ...avatarsQueryData, currentData: avatarsQueryData.data || undefined },
						create: {
							uri: '/files/users/avatars/' + (payload.avatar?.username || username),
							method: 'PUT',
						},
					}}
					urlSplitter='avatars/'
					sortingAlgoritm={(a, b) =>
						parseInt(a.split('_')[1].slice(0, 2)) - parseInt(b.split('_')[1].slice(0, 2))
					}
				/>
			)}
		</>
	);

	function AvatarElement() {
		const avatarSrc = payload.avatar
			? payload.avatar.username
				? avatarUrlParse(data?.avatar)
				: avatarUrlParse(payload.avatar.avatarUrl)
			: data?.avatar != null
			? avatarUrlParse(data.avatar)
			: undefined;

		return (
			<Box
				sx={{
					padding: '2px',
					borderRadius: '50%',
					background: `linear-gradient(to right bottom, ${stringToColor(name)}, ${stringToColor(
						name.split(' ').reverse().join(' '),
					)})`,
					transition: 'all .3s ease-in-out',
					zIndex: 0,
					...(!!payload.uploadMode && {
						cursor: 'pointer',
						'&:hover > div': {
							bgcolor: stringToColor(name.split(' ').reverse().join(' ')),
						},
					}),
				}}
			>
				<Avatar
					src={avatarSrc}
					alt='User avatar'
					{...stringAvatar(name, payload.bg, payload.widthAvatar, payload.heightAvatar)}
					onClick={!!payload.uploadMode ? () => setUploaderState(prev => !prev) : undefined}
				/>
			</Box>
		);
	}
};

function stringAvatar(name: string, bg = false, widthAvatar = '46px', heightAvatar = '46px'): Object {
	return {
		sx: {
			zIndex: 1,
			transition: 'all .25s ease-in-out',
			bgcolor: !bg ? '#cecece' : stringToColor(name),
			width: widthAvatar,
			height: heightAvatar,
		},
		children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
	};
}

export function stringToColor(string: string): string {
	let hash = 0;
	let i;

	/* eslint-disable no-bitwise */
	for (i = 0; i < string.length; i += 1) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}

	let color = '#';

	for (i = 0; i < 3; i += 1) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.slice(-2);
	}
	/* eslint-enable no-bitwise */

	return color;
}

export function avatarUrlParse(url?: string): string | undefined {
	if (!url) return undefined;
	let avatarUrl = url;
	if (url.includes('files/users/avatars')) avatarUrl = avatarUrl.split('files/users/avatars')[1];
	else if (url.includes('users/avatars')) avatarUrl = avatarUrl.split('users/avatars')[1];
	return (
		(checkProductionMode() ? 'https://api.sdo.rnprog.ru' : 'http://localhost:4444') +
		`/files/users/avatars/${avatarUrl.startsWith('/') ? avatarUrl.slice(1) : avatarUrl}`
	);
}
