import EditIcon from '@mui/icons-material/Edit';
import { Button, Stack, SxProps, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import React, { ComponentProps, ReactNode } from 'react';
import { rtkApi } from '../../../../../redux/api';
import { useTypedSelector } from '../../../../../redux/hooks';
import { CoursesReduxI } from '../../../../../redux/slices/courses';
import { selectUser, SystemRolesOptions } from '../../../../../redux/slices/user';
import OnyxLink from '../../../../basics/OnyxLink';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import ContentLinkEditModal from '../../config-elements/ContentLinkEditModal';
import { ContentItemLinksType, LINKS_MAP, SectionItemBaseProps } from '../../courseItemsTypes';
import SectionContentSkeleton from '../SectionContentSkeleton';
import {
	EditFieldset,
	EditFieldsetLegend,
	SectionEditCofigButton,
	SectionEditConfigSubDial,
} from '../SectionEditElements';
import { CourseSectionItemFooter } from '../SectionItems';
import { EditMovementSubDial, EditWidthSubDial, ManageOptionsSubDial } from '../edit-sub-dials/edit-sub-dials';

interface ISectionContentLinkItem
	extends Omit<SectionItemBaseProps, 'csiid'>,
		Partial<Pick<SectionItemBaseProps, 'csiid'>> {
	forcedMode?: CoursesReduxI['mode'];
	linkType: ContentItemLinksType;
	href?: string;
	sx?: SxProps;
}

function SectionContentLinkItem(props: ISectionContentLinkItem) {
	const theme = useTheme();
	const router = useRouter();
	const userData = useTypedSelector(selectUser);
	const mobileMode = useMediaQuery(theme.breakpoints.down('lg'));
	const viewMode = useTypedSelector(store => store.courses.mode);

	const [changeItemStatus] = rtkApi.useSetViewedItemStatusMutation();
	const { data: currentProgressData } = rtkApi.useCurrentCourseProgressQuery((router.query.cid as string) || '');

	const isViewed = !!currentProgressData
		? !!currentProgressData.data.progress[router.query.csid as string]?.find(
				item => item.itemID === (props.csiid || ''),
		  )?.visited || false
		: false;

	function handleViewStatusChange(_event: any, status: boolean = true) {
		if (!!props.csiid && !!router.query.csid && !!currentProgressData?.data.cpid)
			changeItemStatus({
				cpid: currentProgressData.data.cpid,
				csid: router.query.csid as string,
				csiid: props.csiid,
				status: status,
			});
	}

	const ContentLink = (
		<OnyxLink
			disabled={!props.href}
			href={props.hide && SystemRolesOptions[userData._systemRole].accessLevel < 2 ? '/' : props.href || '/'}
			title={LINKS_MAP[props.linkType].hrefTitle}
			target={props.linkType === 'link' || props.linkType === 'feedback' ? '_blank' : undefined}
			rel={props.linkType === 'link' || props.linkType === 'feedback' ? 'norefferer' : undefined}
			style={{
				display:
					SystemRolesOptions[userData._systemRole].accessLevel < 1 && !!props.hide && viewMode === 'observe'
						? 'none'
						: '',
				opacity:
					SystemRolesOptions[userData._systemRole].accessLevel < 1 && !!props.hide && viewMode === 'observe'
						? '0'
						: !!props.hide
						? '.75'
						: '1',
				filter: !!props.hide ? 'grayscale(1)' : undefined,
				width: mobileMode ? '100%' : props.basis ? `${props.basis}%` : '100%',
				flexBasis: mobileMode ? '100%' : props.basis ? `${props.basis}%` : '100%',
			}}
			onClick={handleViewStatusChange}
		>
			<Button
				fullWidth
				variant='outlined'
				sx={{
					height: '100%',
					padding: '.5rem .5rem .25rem !important',
					flexDirection: 'column',
					flexBasis: mobileMode ? '100%' : props.basis ? `${props.basis}%` : '100%',
					borderWidth:
						props.styles?.borderWidth !== undefined ? `${props.styles.borderWidth}px !important` : '1px',
					borderColor: `${props.styles?.borderColor} !important`,
					borderStyle: `${props.styles?.borderStyle} !important`,
					color: props.styles?.color,
				}}
			>
				<Stack width='100%' height='100%' direction='row' alignItems='center' gap={2}>
					<img
						alt='Link linkType icon'
						src={LINKS_MAP[props.linkType].href}
						style={{ width: LINKS_MAP[props.linkType].width }}
					/>
					<OnyxTypography text={props.text} />
				</Stack>
				<CourseSectionItemFooter
					viewed={isViewed}
					onStatusClickCallback={isViewed ? () => handleViewStatusChange(undefined, false) : undefined}
					additional={{ fileSize: props.fileSize, fileType: props.linkType }}
				/>
			</Button>
		</OnyxLink>
	);

	return !!props.skeleton ? (
		<SectionContentSkeleton {...props} iconType='link' linkType={props.linkType} />
	) : props.forcedMode === 'observe' || (props.forcedMode !== 'editor' && viewMode === 'observe') ? (
		ContentLink
	) : (
		<EditFieldsetLinkWrapper {...props}>{ContentLink}</EditFieldsetLinkWrapper>
	);
}

export default SectionContentLinkItem;

export function EditFieldsetLinkWrapper(
	props: ComponentProps<typeof SectionContentLinkItem> & { title?: string; children: ReactNode },
) {
	const [configState, setConfigState] = React.useState<boolean>(false);
	const [configModalState, setConfigModalState] = React.useState<boolean>(false);

	return (
		<EditFieldset styles={{ borderStyle: 'ridge', width: !!props.basis ? `${props.basis}%` : '100%' }}>
			<EditFieldsetLegend>
				{!!props.hide && (
					<OnyxTypography
						tpSize='.7rem'
						component='span'
						tpColor='warning'
						sx={{
							padding: '1px .25rem',
							marginRight: '.25rem',
							borderRadius: '6px',
							border: theme => `1px solid ${theme.palette.warning.dark}`,
						}}
					>
						Скрытый элемент
					</OnyxTypography>
				)}
				Элемент - {LINKS_MAP[props.linkType]['fileType']}
				<SectionEditCofigButton configState={configState} setConfigState={setConfigState} />
				<SectionEditConfigSubDial
					orderNumber={1}
					configState={configState}
					ariaLabel='Container config'
					items={[
						{
							name: 'Редактировать',
							icon: <EditIcon />,
							onClick: () => setConfigModalState(prev => !prev),
						},
					]}
				/>
				<EditMovementSubDial
					orderNumber={2}
					state={configState}
					csiid={props.csiid}
					parentCsiid={props.parentCsiid}
					excludeOutOfContainer={!props.parentCsiid}
				/>
				<EditWidthSubDial basis={props.basis} orderNumber={3} csiid={props.csiid} state={configState} />
				<ManageOptionsSubDial orderNumber={4} state={configState} hide={props.hide} csiid={props.csiid} />
			</EditFieldsetLegend>

			{props.children}

			<ContentLinkEditModal {...props} modalState={configModalState} setModalState={setConfigModalState} />
		</EditFieldset>
	);
}
