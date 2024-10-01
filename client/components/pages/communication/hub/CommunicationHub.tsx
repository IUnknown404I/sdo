import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import ContactSupportRoundedIcon from '@mui/icons-material/ContactSupportRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import { Box, Divider, Grow, Paper, Stack, Tab, Tabs } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { rtkApi } from '../../../../redux/api';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import { MessangerHelpTabContent } from '../../../messenger/MessengerTabContentComponents';
import { CommunicationHubGroupOrPrivateBlock } from './CommunicationHubComponents';
import ContactsModal from './personal/ContactsModal';
import FriendsModal from './personal/FriendsModal';
import CommonTabCommunication from './system/CommonTab';

const CommunicationHub = () => {
	const router = useRouter();
	const { data: chats, fulfilledTimeStamp } = rtkApi.useUserChatsQuery('');

	const [rootTab, setRootTab] = React.useState<number>(
		router.query?.tab === 'groups'
			? 1
			: router.query?.tab === 'personal'
			? 2
			: router.query?.tab === 'help'
			? 3
			: 0,
	);

	const handleTabChange = (newIndex: number) => {
		setRootTab(newIndex);
		router.replace(
			router.route +
				`?tab=${newIndex === 0 ? 'system' : newIndex === 1 ? 'groups' : newIndex === 2 ? 'personal' : 'help'}`,
		);
	};

	React.useEffect(() => {
		if (!router.query) return;
		switch (router.query.tab) {
			case 'public': {
				if (rootTab !== 0) handleTabChange(0);
				break;
			}
			case 'group': {
				if (rootTab !== 1) handleTabChange(1);
				break;
			}
			case 'personal': {
				if (rootTab !== 2) handleTabChange(2);
				break;
			}
			case 'help': {
				if (rootTab !== 3) handleTabChange(3);
				break;
			}
		}
	}, [router.query]);

	return (
		<Box>
			<Stack
				gap={1}
				spacing={1}
				padding='.75rem'
				alignItems='center'
				justifyContent='space-between'
				sx={{
					flexDirection: { sm: 'column-reverse', md: 'row' },
					'> a': { width: { sm: '100%', md: 'fit-content' } },
				}}
			>
				<Box>
					<OnyxTypography tpColor='secondary'>
						В данном разделе вы можете общаться с другими пользователями системы.
					</OnyxTypography>
					<OnyxTypography tpColor='secondary'>
						Можно написать кому-то конкретному в личном чате или взаимодействовать с группой людей в общих
						чатах, к примеру, в системных комнатах.
					</OnyxTypography>
				</Box>

				<Paper
					elevation={1}
					sx={{
						borderRadius: '14px',
						width: 'fit-content',
						padding: '0',
					}}
				>
					<Tabs
						value={rootTab}
						onChange={(e, value) => handleTabChange(value)}
						variant='scrollable'
						scrollButtons
						allowScrollButtonsMobile
						sx={{
							bgcolor: 'background.paper',
							borderRadius: '14px',
							padding: '0',
							button: { fontSize: '.85rem !important', padding: '0' },
						}}
						aria-label='tabs for chat groups'
					>
						<Tab label='Системные' iconPosition='top' icon={<AllInclusiveIcon />} />
						<Tab label='Группы' iconPosition='top' icon={<GroupRoundedIcon />} />
						<Tab label='Личные' iconPosition='top' icon={<QuestionAnswerRoundedIcon />} />
						<Tab label='Справка' iconPosition='top' icon={<ContactSupportRoundedIcon />} />
					</Tabs>
				</Paper>
			</Stack>
			<Divider sx={{ margin: '.75rem auto 1rem' }} />

			<CommonTabCommunication state={rootTab === 0} />

			<Grow in={rootTab === 1} hidden={rootTab !== 1}>
				<Box>
					<Stack
						direction='row'
						alignItems='center'
						justifyContent='space-between'
						width='100%'
						padding='0 .75rem'
					>
						<OnyxTypography tpColor='secondary' tpSize='1rem'>
							Доступные вам группы
						</OnyxTypography>
						<OnyxTypography tpColor='secondary' tpSize='1rem'>
							Всего комнат: {chats?.group.length || 0}
						</OnyxTypography>
					</Stack>

					<Stack
						position='relative'
						direction='column'
						justifyContent='space-between'
						marginTop='.25rem'
						spacing={1}
						gap={1}
						padding='.5rem'
						sx={{ overflowY: 'auto', maxHeight: { md: 'unset', lg: 'calc(100vh - 290px)' } }}
					>
						<CommunicationHubGroupOrPrivateBlock type='group' />
					</Stack>
				</Box>
			</Grow>

			<Grow in={rootTab === 2} hidden={rootTab !== 2}>
				<Box>
					<Stack
						alignItems='flex-end'
						justifyContent='space-between'
						width='100%'
						padding='0 .75rem'
						maxHeight='100%'
						gap={1}
						sx={{ flexDirection: { md: 'column', lg: 'row' } }}
					>
						<Stack direction='row' gap={1}>
							<FriendsModal />
							<ContactsModal />
						</Stack>
						<OnyxTypography tpColor='secondary' tpSize='1rem'>
							Всего комнат: {chats?.private.length || 0}
						</OnyxTypography>
					</Stack>

					<Stack
						position='relative'
						direction='column'
						justifyContent='space-between'
						marginTop='.25rem'
						spacing={1}
						gap={1}
						padding='.5rem'
						sx={{
							overflowY: 'auto',
							overflowX: 'hidden',
							minHeight: '150px',
							maxHeight: { md: 'unset', lg: 'calc(100vh - 290px)' },
						}}
					>
						<CommunicationHubGroupOrPrivateBlock type='private' />
					</Stack>
				</Box>
			</Grow>

			<Grow in={rootTab === 3} hidden={rootTab !== 3}>
				<Box>
					<MessangerHelpTabContent />
				</Box>
			</Grow>
		</Box>
	);
};

export default CommunicationHub;
