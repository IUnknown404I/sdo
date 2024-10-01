import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import ContactSupportRoundedIcon from '@mui/icons-material/ContactSupportRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import SwipeOutlinedIcon from '@mui/icons-material/SwipeOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import { Stack, SxProps, Tabs, Theme, useMediaQuery } from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useRouter } from 'next/router';
import React from 'react';
import { createPortal } from 'react-dom';
import { rtkApi } from '../../../redux/api';
import { useTypedSelector } from '../../../redux/hooks';
import { OnyxTypography } from '../../basics/OnyxTypography';
import { SidebarBadgeButton } from '../../layout/sidebar/SidebarElements';
import { MessengerSearchBox, MessengerSidebarTab } from './../BasicComponents';
import MessengerTabContent from './../MessengerTabContent';

export type DialogType = {
	tab: number;
	name: string;
};

interface MessengerSidebarProps {
	sideOverride?: 'left' | 'right';
	detachedDrawer?: boolean;
	controlled?: {
		state: boolean;
		setState: React.Dispatch<React.SetStateAction<boolean>>;
	};
	sx?: SxProps<Theme>;
}

const MessengerSidebar = (props: MessengerSidebarProps) => {
	const router = useRouter();
	const drawerID = React.useId();
	const portalID = React.useId();
	const lgBreakpoint = useMediaQuery('(min-width:1200px)');

	const activeDialogState = useTypedSelector(store => store.messenger.activeDialog);
	const [tab, setTab] = React.useState<number>(0);
	const [side, setSide] = React.useState<'left' | 'right'>(props.sideOverride || lgBreakpoint ? 'left' : 'right');
	const [dragging, setDragging] = React.useState<boolean>(false);
	const [sidebarState, setSidebarState] = React.useState<boolean>(false);
	const [searchChatsValue, setSearchChatsValue] = React.useState<string>('');

	const { data: friendsObject } = rtkApi.useFriendsQuery('');

	React.useEffect(() => {
		if (!!props.sideOverride) return;

		if (!lgBreakpoint && side === 'left') setSide('right');
		else if (lgBreakpoint && side === 'right') setSide('left');
	}, [lgBreakpoint]);

	return (
		<>
			{!props.detachedDrawer && (
				<SidebarBadgeButton
					color='error'
					text='Сообщения'
					badgeContent={0 + (friendsObject?.pending.length || 0) + (friendsObject?.requested.length || 0)}
					selected={router.asPath.includes('/communication') || router.asPath.includes('/communication/hub')}
					listItemIcon={<TextsmsOutlinedIcon />}
					onClick={() =>
						props.controlled !== undefined ? props.controlled.setState(true) : setSidebarState(true)
					}
				/>
			)}

			<SwipeableDrawer
				id={drawerID}
				anchor={side}
				elevation={4}
				swipeAreaWidth={lgBreakpoint ? 0 : 25}
				draggable={lgBreakpoint}
				open={props.controlled !== undefined ? props.controlled.state : sidebarState}
				allowSwipeInChildren
				hideBackdrop={lgBreakpoint && !!activeDialogState?.name}
				aria-label='messenger-sidebar'
				onClose={() =>
					props.controlled !== undefined ? props.controlled.setState(false) : setSidebarState(false)
				}
				onOpen={() =>
					props.controlled !== undefined ? props.controlled.setState(true) : setSidebarState(true)
				}
				onDragStart={() => setDragging(true)}
				PaperProps={{
					sx: {
						borderTopLeftRadius: '14px',
						borderTopRightRadius: '14px',
						border: theme => (theme.palette.mode === 'light' ? undefined : '1px solid lightgray'),
						borderTop: 'unset',
					},
				}}
				ModalProps={{ sx: { zIndex: '1200', left: !!activeDialogState ? 'unset' : '0' } }}
				onDragEnd={e => {
					if (
						(side === 'right' && e.clientX <= 320) ||
						(side === 'left' &&
							// @ts-ignore
							e.clientX >= (e.view?.innerWidth || document.scrollingElement?.clientWidth || 1920) - 320)
					)
						setSide(side === 'right' ? 'left' : 'right');
					setDragging(false);
				}}
				onClick={e => e.stopPropagation()}
				sx={props.sx}
			>
				<Stack
					component='section'
					direction='column'
					gap={2}
					height='100vh'
					sx={{
						overflow: 'hidden',
						width: 'min(100vw, 450px)',
						backgroundColor: theme =>
							theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.primary.main[200],
					}}
				>
					<Tabs
						value={tab}
						TabIndicatorProps={{ sx: { display: 'none' } }}
						onChange={(_, index) => setTab(index)}
						sx={{
							width: '100%',
							backgroundColor: theme => (theme.palette.mode === 'light' ? 'gray' : '#162534'),
							button: {
								flex: '1',
								fontSize: '.85rem',
								paddingTop: 'unset',
								paddingBottom: '.25rem',
								marginBottom: '.75rem',
								text: { fontSize: '1.5rem' },
								svg: { marginBottom: 'unset !important' },
								borderTopLeftRadius: '14px',
								borderTopRightRadius: '14px',
							},
						}}
					>
						<MessengerSidebarTab
							tab={tab}
							tabIndex={0}
							label='Системные'
							iconPosition='top'
							icon={<AllInclusiveIcon />}
						/>
						<MessengerSidebarTab
							tab={tab}
							tabIndex={1}
							label='Группы'
							iconPosition='top'
							icon={<GroupRoundedIcon />}
						/>
						<MessengerSidebarTab
							tab={tab}
							tabIndex={2}
							label='Личные'
							iconPosition='top'
							icon={<QuestionAnswerRoundedIcon />}
							badgeProps={[
								{ badgeContent: friendsObject?.pending.length, badgeColor: 'success' },
								{ badgeContent: friendsObject?.requested.length, badgeColor: 'primary' },
							]}
						/>
						<MessengerSidebarTab
							tab={tab}
							tabIndex={3}
							label='Справка'
							iconPosition='top'
							icon={<ContactSupportRoundedIcon />}
							sx={{ marginBottom: '.5rem !important' }}
						/>
					</Tabs>

					{tab !== 3 && (
						<MessengerSearchBox
							value={searchChatsValue}
							setValue={setSearchChatsValue}
							contacts={tab === 2}
						/>
					)}

					<Stack
						gap={1}
						direction='column'
						width='100%'
						height='100%'
						maxHeight='100%'
						sx={{ overflowY: 'auto' }}
						justifyContent='space-between'
					>
						<MessengerTabContent side={side} tab={tab} tabIndex={0} />
						<MessengerTabContent side={side} tab={tab} tabIndex={1} />
						<MessengerTabContent side={side} tab={tab} tabIndex={2} />
						<MessengerTabContent side={side} tab={tab} tabIndex={3} />

						<OnyxTypography
							ttNode='Открыть в полном режиме'
							lkHref={`/communication/hub?tab=${
								tab === 0 ? 'public' : tab === 1 ? 'group' : tab === 2 ? 'personal' : 'help'
							}`}
							// lkProps={{ target: '_blank' }}
							tpColor='secondary'
							tpSize='.85rem'
							boxWrapper
							boxAlign='center'
							boxVerticalAlign='center'
							sx={{ margin: '.5rem 0', padding: '.25rem', svg: { fontSize: '1rem' } }}
						>
							<OpenInNewRoundedIcon /> Открыть на всю страницу
						</OnyxTypography>
					</Stack>
				</Stack>
			</SwipeableDrawer>

			{createPortal(
				<Stack
					key={portalID}
					id={`chat-dragzone-${portalID}`}
					aria-details='chat-dragzone'
					hidden={!dragging}
					display={dragging ? 'flex' : 'none'}
					flexDirection='column'
					textAlign='center'
					alignItems='center'
					justifyContent='center'
					gap={1}
					sx={{
						position: 'fixed',
						left: side === 'right' ? '0' : 'unset',
						right: side === 'right' ? 'unset' : '0',
						top: '0',
						bottom: '0',
						width: '320px',
						opacity: dragging ? '1' : '0',
						backgroundColor: dragging ? 'rgba(0,164,82,.75)' : 'white',
						transition: 'all .2s ease-in',
						zIndex: '9999',
						color: 'white',
						padding: '1rem',
						svg: { color: 'white', fontWeight: 'bold', fontSize: '2rem' },
					}}
				>
					<SwipeOutlinedIcon />
					Перетащите сюда, чтобы зафиксировать панель на этой стороне.
				</Stack>,
				document.body,
			)}
		</>
	);
};

export default MessengerSidebar;
