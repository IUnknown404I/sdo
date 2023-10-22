import { Box, Grow, Paper, Stack, Tab, Tabs } from '@mui/material';
import React from 'react';
import { rtkApi } from '../../../../../redux/api';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import { ChatContainer } from '../../../../messenger/chatContainer/ChatContainer';

const CommonTabCommunication = (props: { state: boolean }) => {
	const [systemTab, setSystemTab] = React.useState<number>(0);

	const { data: generalChatData } = rtkApi.useChatDataQuery('general', {});
	const { data: helpChatData } = rtkApi.useChatDataQuery('help', {});
	const { data: notificationsChatData } = rtkApi.useChatDataQuery('notifications', {});

	return (
		<Grow in={props.state} hidden={!props.state} timeout={750}>
			<Box>
				<Paper
					elevation={1}
					sx={{
						borderRadius: '14px',
						width: { xs: 'min(100%, 95vw)', sm: 'fit-content' },
						margin: '1rem auto',
					}}
				>
					<Tabs
						value={systemTab}
						onChange={(_, index) => setSystemTab(index)}
						variant='scrollable'
						scrollButtons
						allowScrollButtonsMobile
						sx={{
							bgcolor: 'background.paper',
							borderRadius: '14px',
							paddingInline: { sm: '', md: '1.5rem' },
						}}
						aria-label='tabs for chat public groups'
					>
						<Tab
							label={generalChatData?.name || 'Общий чат системы'}
							sx={{ fontSize: { xs: '.85rem', sm: '.85rem', md: '' } }}
						/>
						<Tab
							label={helpChatData?.name || 'Вопросы и Помощь'}
							sx={{ fontSize: { xs: '.85rem', sm: '.85rem', md: '' } }}
						/>
						<Tab
							label={notificationsChatData?.name || 'Уведомления системы'}
							sx={{ fontSize: { xs: '.85rem', sm: '.85rem', md: '' } }}
						/>
					</Tabs>
				</Paper>

				<Grow in={systemTab === 0} timeout={750} hidden={systemTab !== 0}>
					<Box sx={{ marginInline: 'auto' }}>
						<Stack
							direction='row'
							alignItems='center'
							justifyContent='space-between'
							width='100%'
							padding='0 .25rem'
							marginBottom='.5rem'
						>
							<OnyxTypography tpColor='secondary' tpSize='1rem'>
								Общий чат для всех пользователей.
							</OnyxTypography>
							<OnyxTypography tpColor='secondary' tpSize='1rem'>
								Всего комнат: 1
							</OnyxTypography>
						</Stack>

						<ChatContainer
							publicChat
							focused={systemTab === 0}
							rid='general'
							mode='full'
							inputEnable
							elevatedHeader
							maxHeight='450px'
						/>
					</Box>
				</Grow>

				<Grow in={systemTab === 1} timeout={750} hidden={systemTab !== 1}>
					<Box sx={{ marginInline: 'auto' }}>
						<Stack
							direction='row'
							alignItems='center'
							justifyContent='space-between'
							width='100%'
							padding='0 .25rem'
							marginBottom='.5rem'
						>
							<OnyxTypography tpColor='secondary' tpSize='1rem'>
								Задавайте вопросы и помогайте коллегам.
							</OnyxTypography>
							<OnyxTypography tpColor='secondary' tpSize='1rem'>
								Всего комнат: 1
							</OnyxTypography>
						</Stack>

						<ChatContainer
							publicChat
							focused={systemTab === 1}
							rid='help'
							mode='full'
							inputEnable
							elevatedHeader
							maxHeight='450px'
						/>
					</Box>
				</Grow>

				<Grow in={systemTab === 2} timeout={750} hidden={systemTab !== 2}>
					<Box sx={{ marginInline: 'auto' }}>
						<Stack
							direction='row'
							alignItems='center'
							justifyContent='space-between'
							width='100%'
							padding='0 .25rem'
							marginBottom='.5rem'
						>
							<OnyxTypography tpColor='secondary' tpSize='1rem'>
								Оповещения о событиях и новостях системы.
							</OnyxTypography>
							<OnyxTypography tpColor='secondary' tpSize='1rem'>
								Всего комнат: 1
							</OnyxTypography>
						</Stack>

						<ChatContainer
							publicChat
							focused={systemTab === 2}
							rid='notifications'
							mode='full'
							inputEnable
							elevatedHeader
							maxHeight='450px'
						/>
					</Box>
				</Grow>
			</Box>
		</Grow>
	);
};

export default CommonTabCommunication;
