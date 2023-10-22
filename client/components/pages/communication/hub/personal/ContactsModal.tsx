import { Button, Divider, Stack, SxProps, TextField, useMediaQuery } from '@mui/material';
import React from 'react';
import { rtkApi } from '../../../../../redux/api';
import { ChatContactsI } from '../../../../../redux/endpoints/chatEnd';
import { useTypedSelector } from '../../../../../redux/hooks';
import OnyxAlertModal from '../../../../basics/OnyxAlertModal';
import OnyxSelect from '../../../../basics/OnyxSelect';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import ClassicLoader from '../../../../utils/loaders/ClassicLoader';
import ModernLoader from '../../../../utils/loaders/ModernLoader';
import { notification } from '../../../../utils/notifications/Notification';
import ContactCard from './ContactCard';

interface ContactsModalProps {
	buttonProps?: {
		fullwidth?: boolean;
		buttonText?: string;
		size?: 'small' | 'medium' | 'large';
		variant?: 'text' | 'contained' | 'outlined';
		sx?: SxProps;
	};
}

const ContactsModal = (props: ContactsModalProps) => {
	const contactsID = React.useId();
	const xsBreakpoint = useMediaQuery('(max-width:600px)');
	const bearer = useTypedSelector(store => store.accessToken.access_token);
	const axiosInstance = useTypedSelector(state => state.axiosInstance.instance);

	const { data: friendsObject } = rtkApi.useFriendsQuery('', {
		pollingInterval: 15 * 6e4,
		refetchOnMountOrArgChange: true,
		refetchOnReconnect: true,
	});
	const { data: participatorsArray, refetch: participatorsRefetch } = rtkApi.usePrivateParticipatorsQuery('', {
		pollingInterval: 5 * 6e4,
		refetchOnMountOrArgChange: true,
		refetchOnReconnect: true,
	});

	const [state, setState] = React.useState<boolean>(false);
	const [fetching, setFetching] = React.useState<boolean>(false);
	const [searchText, setSearchText] = React.useState<string>('');
	const [emailMode, setEmailMode] = React.useState<boolean>(true);
	const [contacts, setContacts] = React.useState<ChatContactsI[]>([]);

	return (
		<>
			<Button
				fullWidth={props.buttonProps?.fullwidth || false}
				size={props.buttonProps?.size || 'medium'}
				variant={props.buttonProps?.variant || 'contained'}
				sx={{ fontSize: '.85rem', paddingInline: '1.5rem', ...props.buttonProps?.sx }}
				onClick={() => setState(true)}
			>
				{props.buttonProps?.buttonText || 'Контакты системы'}
			</Button>

			<OnyxAlertModal
				id={contactsID}
				state={state}
				setState={setState}
				title='Контакты пользователей системы'
				keepMounted={false}
				width='fit-content'
				disableButton
				hideFooter
			>
				<OnyxTypography tpColor='secondary' tpSize='.85rem'>
					Здесь Вы сможете найти пользователей платформы по логину или электронной почте.
				</OnyxTypography>
				<OnyxTypography tpColor='secondary' tpSize='.85rem'>
					<OnyxTypography sx={{ color: theme => theme.palette.error.main, display: 'inline' }}>
						ВАЖНО!
					</OnyxTypography>{' '}
					В профиле во вкладке "Безопасность" можно запретить поиск своего аккаунта в системе.
				</OnyxTypography>

				<form onSubmit={e => searchInit(e)}>
					<Stack
						justifyContent='space-between'
						alignItems='center'
						gap={2}
						width='100%'
						marginTop='.5rem'
						sx={{ flexDirection: { sm: 'column', md: 'row' }, paddingRight: { sm: '', md: '50px' } }}
					>
						<TextField
							disabled={fetching}
							fullWidth
							id='search-contacts'
							label={emailMode ? 'Введите почту пользователя' : 'Введите логин пользователя'}
							size='small'
							value={searchText}
							onChange={e => setSearchText(e.target.value)}
							variant='outlined'
							required
						/>
						<OnyxSelect
							disabled={fetching}
							fullwidth={xsBreakpoint}
							size='small'
							disableEmptyOption
							value={emailMode ? 2 : 1}
							setValue={e => setEmailMode(e.target.value === 1 ? false : true)}
							listItems={['Логин пользователя', 'Электронная почта']}
							itemsIndexes={[1, 2]}
						/>
					</Stack>

					<Stack alignItems='flex-end' width='100%' marginTop='.75rem'>
						<Button
							type='submit'
							variant='contained'
							size='small'
							disabled={fetching}
							sx={{ paddingInline: '1.6rem', marginRight: '.4rem' }}
						>
							{fetching && <ClassicLoader iconVariant />}
							Выполнить поиск
						</Button>
					</Stack>
				</form>

				{fetching && (
					<>
						<Divider sx={{ margin: '1rem auto' }} />
						<Stack
							direction='row'
							alignItems='center'
							justifyContent='space-around'
							gap={2}
							marginTop='2rem'
						>
							<ModernLoader loading />
							<ModernLoader loading />
							<ModernLoader loading />
						</Stack>
					</>
				)}
				{!fetching && !!contacts && contacts.length > 0 && (
					<>
						<Divider sx={{ margin: '1rem auto .5rem' }} />
						<OnyxTypography
							text='Найденные контакты:'
							tpColor='secondary'
							tpSize='.85rem'
							sx={{ marginBottom: '.5rem' }}
						/>
						<Stack component='section' width='100%' direction='column' gap={1}>
							{contacts.map((contact, index) => (
								<ContactCard
									key={index}
									{...contact}
									friendsObject={friendsObject}
									participators={participatorsArray}
								/>
							))}
						</Stack>
					</>
				)}
			</OnyxAlertModal>
		</>
	);

	function searchInit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!searchText) return;
		setFetching(true);

		axiosInstance
			.get(`chats/contacts?${emailMode ? `email=${searchText}` : `username=${searchText}`}`, {
				headers: { Authorization: `Bearer ${bearer}` },
			})
			.then(res => res.data)
			.then(res => {
				if (Array.isArray(res) && res.length > 0) setContacts(res as ChatContactsI[]);
				else notification({ message: 'По запросу не было найдено ни одного пользователя!', type: 'warning' });
			})
			.catch(() =>
				notification({
					message: 'Произошла ошибка запроса данных! Попробуйте ещё раз или перезагрузите страницу.',
					type: 'error',
				}),
			)
			.finally(() => setFetching(false));
	}
};

export default ContactsModal;
