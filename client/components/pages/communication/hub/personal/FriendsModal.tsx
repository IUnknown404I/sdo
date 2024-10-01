import AddReactionIcon from '@mui/icons-material/AddReaction';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
import { Badge, Box, Button, Divider, Grow, Paper, Stack, SxProps, Tab, Tabs, TextField } from '@mui/material';
import React from 'react';
import { rtkApi } from '../../../../../redux/api';
import OnyxAlertModal from '../../../../basics/OnyxAlertModal';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import ClassicLoader from '../../../../utils/loaders/ClassicLoader';
import ModernLoader from '../../../../utils/loaders/ModernLoader';
import FriendCard from './FriendCard';

interface FriendsModalProps {
	buttonProps?: {
		fullwidth?: boolean;
		buttonText?: string;
		size?: 'small' | 'medium' | 'large';
		variant?: 'text' | 'contained' | 'outlined';
		sx?: SxProps;
	};
}

const FriendsModal = (props: FriendsModalProps) => {
	const contactsID = React.useId();
	const [friendsTab, setFriendsTab] = React.useState<number>(0);
	const { data: participatorsArray, refetch: participatorsRefetch } = rtkApi.usePrivateParticipatorsQuery('', {
		pollingInterval: 5 * 6e4,
		refetchOnMountOrArgChange: true,
		refetchOnReconnect: true,
	});
	const {
		data: friendsObject,
		refetch: friendsRefetch,
		isLoading,
		isFetching,
	} = rtkApi.useFriendsQuery('', {
		pollingInterval: 15 * 6e4,
		refetchOnMountOrArgChange: true,
		refetchOnReconnect: true,
	});

	const [state, setState] = React.useState<boolean>(false);
	const [searchText, setSearchText] = React.useState<string>('');

	return (
		<>
			<Button
				fullWidth={props.buttonProps?.fullwidth || false}
				size={props.buttonProps?.size || 'medium'}
				variant={props.buttonProps?.variant || 'contained'}
				sx={{ fontSize: '.85rem', paddingInline: '1.5rem', ...props.buttonProps?.sx }}
				onClick={() => setState(true)}
			>
				{props.buttonProps?.buttonText || 'Пользователи в друзьях'}
				{!!friendsObject?.pending.length && (
					<Badge
						badgeContent={friendsObject.pending.length}
						color='success'
						sx={{ '> span': { position: 'static', transform: 'unset', marginLeft: '.5rem' } }}
					/>
				)}
				{!!friendsObject?.requested.length && (
					<Badge
						badgeContent={friendsObject.requested.length}
						color='info'
						sx={{ '> span': { position: 'static', transform: 'unset', marginLeft: '.5rem' } }}
					/>
				)}
			</Button>

			<OnyxAlertModal
				id={contactsID}
				state={state}
				setState={setState}
				title='Пользователи в друзьях'
				keepMounted={false}
				width='fit-content'
				disableButton
				hideFooter
			>
				<Paper
					elevation={3}
					sx={{
						borderRadius: '14px',
						width: { xs: 'min(100%, 95vw)', sm: 'fit-content' },
						margin: '0 auto 1.25rem',
					}}
				>
					<Tabs
						value={friendsTab}
						onChange={(_, index) => setFriendsTab(index)}
						variant='scrollable'
						scrollButtons
						allowScrollButtonsMobile
						sx={{
							bgcolor: 'background.paper',
							borderRadius: '14px',
							paddingInline: { sm: '', md: '1.5rem' },
						}}
						aria-label='tabs for friends groups'
					>
						<Tab label='Подтвержденные друзья' sx={{ fontSize: { xs: '.85rem', sm: '.85rem', md: '' } }} />
						<Tab
							label={
								<Stack direction='row' alignItems='center' justifyContent='center' gap={1}>
									Ожидают подтверждения
									{!!friendsObject?.pending.length && (
										<Badge
											badgeContent={friendsObject.pending.length}
											color='success'
											sx={{ '> span': { position: 'static', transform: 'unset' } }}
										/>
									)}
								</Stack>
							}
							sx={{ fontSize: { xs: '.85rem', sm: '.85rem', md: '' } }}
						/>
						<Tab
							label={
								<Stack direction='row' alignItems='center' justifyContent='center' gap={1}>
									Отправленные заявки
									{!!friendsObject?.requested.length && (
										<Badge
											badgeContent={friendsObject.requested.length}
											color='info'
											sx={{ '> span': { position: 'static', transform: 'unset' } }}
										/>
									)}
								</Stack>
							}
							sx={{ fontSize: { xs: '.85rem', sm: '.85rem', md: '' } }}
						/>
					</Tabs>
				</Paper>

				<Grow in={friendsTab === 0} timeout={150} hidden={friendsTab !== 0}>
					<Box component='section'>
						<OnyxTypography tpColor='secondary' tpSize='.85rem'>
							Здесь отображаются все ваши подтвержденные друзья на платформе.
						</OnyxTypography>

						<Stack
							justifyContent='space-between'
							alignItems='center'
							gap={2}
							width='100%'
							minWidth='300px'
							marginTop='.5rem'
							sx={{ flexDirection: { sm: 'column', md: 'row' } }}
						>
							<TextField
								disabled={isLoading || isFetching}
								fullWidth
								id='search-contacts'
								label='Введите логин или почту'
								size='small'
								value={searchText}
								onChange={e => setSearchText(e.target.value)}
								variant='outlined'
							/>

							<Button
								disabled={!!!friendsObject?.accepted.length}
								size='medium'
								type='submit'
								variant='outlined'
								sx={{ paddingInline: '1.6rem', marginRight: '.4rem' }}
							>
								{isFetching && <ClassicLoader iconVariant />}
								Показать
							</Button>
						</Stack>

						{isLoading ||
							(isFetching && (
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
							))}

						{!isLoading && !isFetching && friendsObject?.accepted && friendsObject.accepted.length > 0 && (
							<>
								<Divider sx={{ margin: '1rem auto .5rem' }} />
								<OnyxTypography
									text={`Пользователей в списке друзей: ${friendsObject.accepted.length}`}
									tpColor='secondary'
									tpSize='.85rem'
									sx={{ marginBottom: '.5rem' }}
								/>
								<Stack component='section' width='100%' direction='column' gap={1}>
									{friendsObject.accepted.map((username, index) => (
										<FriendCard
											key={index}
											mode='accepted'
											friendUsername={username}
											friendsObject={friendsObject}
											privateParticipators={participatorsArray}
										/>
									))}
								</Stack>
							</>
						)}

						{!isLoading && !isFetching && !!!friendsObject?.accepted.length && (
							<>
								<Divider sx={{ margin: '1rem auto .5rem' }} />

								<Stack
									direction='column'
									alignItems='center'
									justifyContent='center'
									margin='2rem 0'
									gap={0}
								>
									<Diversity3Icon color='primary' sx={{ fontSize: '2.75rem' }} />
									<Stack
										direction='column'
										alignItems='center'
										justifyContent='center'
										marginTop='.75rem'
									>
										<OnyxTypography
											text='Ваш список друзей ещё пуст!'
											tpColor='primary'
											tpSize='1rem'
										/>
										<OnyxTypography
											text='Находите пользователей в контактах и добавляйте их в друзья.'
											tpColor='primary'
											tpSize='1rem'
										/>
									</Stack>
								</Stack>
							</>
						)}
					</Box>
				</Grow>

				<Grow in={friendsTab === 1} timeout={150} hidden={friendsTab !== 1}>
					<Box component='section'>
						<OnyxTypography tpColor='secondary' tpSize='.85rem' tpAlign='center'>
							Здесь отображаются активные заявки в друзья от других пользователей.
						</OnyxTypography>

						{isLoading ||
							(isFetching && (
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
							))}

						{!isLoading && !isFetching && friendsObject?.pending && friendsObject.pending.length !== 0 && (
							<>
								<Divider sx={{ margin: '1rem auto .5rem' }} />
								<OnyxTypography
									text='Найденные заявки:'
									tpColor='secondary'
									tpSize='.85rem'
									sx={{ marginBottom: '.5rem' }}
								/>
								<Stack component='section' width='100%' direction='column' gap={1}>
									{friendsObject.pending.map((username, index) => (
										<FriendCard
											key={index}
											mode='pending'
											friendUsername={username}
											friendsObject={friendsObject}
											privateParticipators={participatorsArray}
										/>
									))}
								</Stack>
							</>
						)}

						{!isLoading && !isFetching && !!!friendsObject?.pending.length && (
							<>
								<Divider sx={{ margin: '1rem auto .5rem' }} />

								<Stack
									direction='column'
									alignItems='center'
									justifyContent='center'
									margin='2rem 0'
									gap={0}
								>
									<UnsubscribeIcon color='primary' sx={{ fontSize: '2.75rem' }} />
									<Stack
										direction='column'
										alignItems='center'
										justifyContent='center'
										marginTop='.75rem'
									>
										<OnyxTypography
											text='Пока список заявок пуст!'
											tpColor='primary'
											tpSize='1rem'
										/>
									</Stack>
								</Stack>
							</>
						)}
					</Box>
				</Grow>

				<Grow in={friendsTab === 2} timeout={150} hidden={friendsTab !== 2}>
					<Box component='section'>
						<OnyxTypography tpColor='secondary' tpSize='.85rem' tpAlign='center'>
							Здесь отображаются отправленные вами заявки другим пользователям.
						</OnyxTypography>

						{isLoading ||
							(isFetching && (
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
							))}

						{!isLoading &&
							!isFetching &&
							friendsObject?.requested &&
							friendsObject.requested.length !== 0 && (
								<>
									<Divider sx={{ margin: '1rem auto .5rem' }} />
									<OnyxTypography
										text='Найденные заявки:'
										tpColor='secondary'
										tpSize='.85rem'
										sx={{ marginBottom: '.5rem' }}
									/>
									<Stack component='section' width='100%' direction='column' gap={1}>
										{friendsObject.requested.map((username, index) => (
											<FriendCard
												key={index}
												mode='requested'
												friendUsername={username}
												friendsObject={friendsObject}
												privateParticipators={participatorsArray}
											/>
										))}
									</Stack>
								</>
							)}

						{!isLoading && !isFetching && !!!friendsObject?.requested.length && (
							<>
								<Divider sx={{ margin: '1rem auto .5rem' }} />

								<Stack
									direction='column'
									alignItems='center'
									justifyContent='center'
									margin='2rem 0'
									gap={0}
								>
									<AddReactionIcon color='primary' sx={{ fontSize: '2.75rem' }} />
									<Stack
										direction='column'
										alignItems='center'
										justifyContent='center'
										marginTop='.75rem'
									>
										<OnyxTypography
											text='Все отправленные вами заявки рассмотрены!'
											tpColor='primary'
											tpSize='1rem'
										/>
									</Stack>
								</Stack>
							</>
						)}
					</Box>
				</Grow>
			</OnyxAlertModal>
		</>
	);
};

export default FriendsModal;
