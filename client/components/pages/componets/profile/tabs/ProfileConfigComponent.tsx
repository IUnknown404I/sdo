import { Box, Divider, Paper, Stack } from '@mui/material';
import React from 'react';
import { rtkApi } from '../../../../../redux/api';
import { useTypedSelector } from '../../../../../redux/hooks';
import { UserMetaInformationI } from '../../../../../redux/slices/user';
import ThemeSwitcher from '../../../../../theme/ThemeSwitcher';
import OnyxSelect from '../../../../basics/OnyxSelect';
import OnyxSwitch from '../../../../basics/OnyxSwitch';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import { notification } from '../../../../utils/notifications/Notification';

interface ProfileConfigComponentI {}

const ProfileConfigComponent = (props: ProfileConfigComponentI) => {
	const syncFlag = React.useRef<boolean>(false);
	const [contactVisibility, setContactVisibility] = React.useState<boolean>(true);
	const [pushStatus, setPushStatus] = React.useState<boolean>(true);
	const [contactWay, setContactWay] = React.useState<'email' | 'tel' | 'service' | undefined>('email');

	const authState = useTypedSelector(store => store.auth.state);
	const [updateUserMetaInfo] = rtkApi.usePutMetaMutation();
	const { data, isLoading, isFetching, isError, refetch } = rtkApi.useMetaQuery();

	// sync with server user data
	React.useEffect(() => {
		// if in DB meta attribute is empty -> refetch or set defaults
		if (authState && data == null && !isError)
			refetch()
				// if refetch resolved and not empty
				.then(res => {
					if (res.data != null && Object.keys(res.data).length > 0) {
						if (
							res.data.contactVisibility !== undefined &&
							contactVisibility !== res.data.contactVisibility
						)
							setContactVisibility(res.data.contactVisibility);
						if (res.data.pushStatus !== undefined && pushStatus !== res.data.pushStatus)
							setPushStatus(res.data.pushStatus);
						if (
							res.data.prefferedCommunication !== undefined &&
							contactWay !== res.data.prefferedCommunication
						)
							setContactWay(res.data.prefferedCommunication);
					} else
						serverMetaDataUpdate({
							pushStatus,
							contactVisibility,
							prefferedCommunication: contactWay,
							callback: () => (syncFlag.current = true),
						});
				})
				// if refetch failed
				.catch(() =>
					serverMetaDataUpdate({
						pushStatus,
						contactVisibility,
						prefferedCommunication: contactWay,
						callback: () => (syncFlag.current = true),
					}),
				);
		// if attributes are not equal -> sync
		else if (authState && data != null && !isError) {
			if (data.contactVisibility !== undefined && contactVisibility !== data.contactVisibility)
				setContactVisibility(data.contactVisibility);
			if (data.pushStatus !== undefined && pushStatus !== data.pushStatus) setPushStatus(data.pushStatus);
			if (data.prefferedCommunication !== undefined && contactWay !== data.prefferedCommunication)
				setContactWay(data.prefferedCommunication);
			// macrotask for states sync with syncFlag update
			setTimeout(() => {
				if (!syncFlag.current) syncFlag.current = true;
			});
		}
	}, [authState]);

	// onDataChange sync with the server
	React.useEffect(() => {
		if (!syncFlag.current) return;
		if (
			(authState && data == null) ||
			contactVisibility !== data!.contactVisibility ||
			pushStatus !== data!.pushStatus ||
			contactWay !== data!.prefferedCommunication
		)
			serverMetaDataUpdate({
				pushStatus,
				contactVisibility,
				prefferedCommunication: contactWay,
			});
	}, [contactVisibility, pushStatus, contactWay]);

	return (
		<Paper sx={{ padding: '20px  30px', borderRadius: '20px', hr: { margin: '.75rem 0' } }}>
			<Stack direction='column' gap={0}>
				<OnyxTypography text='Применяется ко всем элементам системы' tpColor='secondary' />
				<ThemeSwitcher />

				<Divider sx={{ width: '100%' }} />
				<Box>
					<OnyxTypography
						text='Используется в чатах. Если включено, вас смогут найти другие пользователи.'
						tpColor='secondary'
					/>
					<OnyxSwitch
						disabled={isFetching || isLoading}
						label='Видимость профиля в системе'
						state={contactVisibility}
						setState={setContactVisibility}
						labelPlacement='end'
					/>
				</Box>

				<Divider sx={{ width: '100%' }} />
				<Box>
					<OnyxTypography
						text='Просим оставить ВКЛЮЧЕННЫМ! Они понадобятся для общения и уведомлений на платформе.'
						tpColor='secondary'
					/>
					<OnyxSwitch
						disabled={isFetching || isLoading}
						label='Разрешить push-уведомления'
						state={pushStatus}
						setState={setPushStatus}
						labelPlacement='end'
					/>
				</Box>

				<Divider sx={{ width: '100%' }} />
				<Box>
					<OnyxTypography
						text='Понадобится в случае организации обратной связи для нашей технической поддержки или наших операторов.'
						tpColor='secondary'
					/>
					<OnyxSelect
						disabled={isFetching || isLoading}
						value={contactWay || 'email'}
						setValue={e =>
							e.target.value === 'email' || e.target.value === 'tel' || e.target.value === 'service'
								? setContactWay(e.target.value)
								: {}
						}
						itemsIndexes={['email', 'tel', 'service']}
						listItems={['Электронная почта', 'Мобильный телефон', 'В рамках платформы']}
						helperText={{
							text: 'Укажите предпочитаемый способ связи с вами',
							type: 'button',
							containerSx: { alignItems: 'center', '> button': { textAlign: 'left' } },
						}}
					/>
				</Box>
			</Stack>
		</Paper>
	);

	function serverMetaDataUpdate(payload: Partial<UserMetaInformationI> & { callback?: () => void }): void {
		updateUserMetaInfo
			.call('', {
				pushStatus: payload.pushStatus,
				contactVisibility: payload.contactVisibility,
				prefferedCommunication: payload.prefferedCommunication,
			})
			.then(() => syncNotification())
			.catch(() => syncNotification(false))
			.finally(() => (payload.callback != null ? payload.callback() : {}));
	}

	/** @deprecated */
	function syncNotification(resolved: boolean = true, positiveDisabled: boolean = true): void {
		resolved
			? positiveDisabled
				? {}
				: notification({ message: 'Настройки учетной записи синхронизированы с сервером!', type: 'info' })
			: notification({
					message:
						'Настройки учетной не удалось синхронизировать с сервером! Обновите страницу или попробуйте позже.',
					type: 'warning',
			  });
	}
};

export default ProfileConfigComponent;
