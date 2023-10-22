import ForumIcon from '@mui/icons-material/Forum';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button, Stack, useMediaQuery } from '@mui/material';
import Head from 'next/head';
import React from 'react';
import { Layout } from '../../../../layout/Layout';
import { rtkApi } from '../../../../redux/api';
import { useTypedSelector } from '../../../../redux/hooks';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import { ChatContainer } from '../../../messenger/chatContainer/ChatContainer';
import ChatSettingsModal from '../../../messenger/sidebarComponents/ChatSettingsModal';
import ModernLoader from '../../../utils/loaders/ModernLoader';

const RoomPage = (props: { rid: string }) => {
	const userData = useTypedSelector(store => store.user);
	const lgBreakpoint = useMediaQuery('(min-width:1200px)');
	const [settingsState, setSettingsState] = React.useState<boolean>(false);
	const { data: chatData, fulfilledTimeStamp, isLoading } = rtkApi.useChatDataQuery(props.rid);

	return (
		<>
			<Head>
				<title>
					{chatData
						? chatData.status !== 'private'
							? chatData.name
							: chatData.name.includes('до:')
							? `Архив чата | ${chatData.name.split('до:')[0].trim()}`
							: `Чат | ${
									chatData?.participators?.filter(
										participator => participator.username !== userData.username,
									)[0]?.username
							  }`
						: 'Системный чат'}
				</title>
				<meta name='description' content='Комната для общения' />
				<meta name='robots' content='index, follow' />
			</Head>

			<Layout>
				<Stack
					width='100%'
					direction={lgBreakpoint ? 'row' : 'column'}
					alignItems='center'
					justifyContent='space-between'
					gap={1}
					sx={{ marginBottom: '1.25rem', marginTop: '.5rem' }}
				>
					<div>
						<OnyxTypography
							text='Пожалуйста, не делитесь персональной или личной информацией в чатах системы!'
							tpColor='secondary'
							tpSize='1rem'
						/>
						<OnyxTypography
							text='Администраторы платформы никогда не станут запрашивать чувствительную информацию в рамках чата и при необходимости сами свяжутся с вами вне цифровой системы.'
							tpColor='secondary'
							tpSize='1rem'
						/>
					</div>

					<Stack direction='row' gap={1} width={lgBreakpoint ? 'fit-content' : '100%'}>
						<OnyxTypography
							lkHref='/communication/hub'
							boxWrapper
							boxWidth='fit-content'
							sx={{ width: '100%' }}
						>
							<Button
								fullWidth={!lgBreakpoint}
								variant='contained'
								size='medium'
								sx={{ fontSize: '1rem' }}
							>
								<ForumIcon sx={{ marginRight: '.5rem' }} />
								Вернуться к чатам
							</Button>
						</OnyxTypography>
						<OnyxTypography ttNode='Параметры чата' ttFollow={false} ttPlacement='bottom'>
							<Button
								disabled={!chatData || chatData.status !== 'private'}
								variant='contained'
								size='medium'
								sx={{ fontSize: '1rem', height: '100%' }}
								onClick={() => setSettingsState(true)}
							>
								{!lgBreakpoint && 'Параметры'}
								<SettingsIcon sx={{ marginLeft: lgBreakpoint ? '' : '.5rem' }} />
							</Button>
						</OnyxTypography>
					</Stack>
				</Stack>

				{isLoading || !fulfilledTimeStamp || !chatData ? (
					<ModernLoader tripleLoadersMode centered />
				) : (
					<ChatContainer {...chatData} mode='full' inputEnable elevatedHeader />
				)}

				<ChatSettingsModal chatData={chatData} state={settingsState} setState={setSettingsState} />
			</Layout>
		</>
	);
};

export default RoomPage;
