import EditIcon from '@mui/icons-material/Edit';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import { Button, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import React, { ComponentProps, ReactNode } from 'react';
import { OnyxApiErrorResponseType, rtkApi } from '../../../../../redux/api';
import { parseCurrentContentID, parseCurrentUrlWithoutFromQuery } from '../../../../../redux/endpoints/lecturesEnd';
import { useTypedSelector } from '../../../../../redux/hooks';
import { CoursesReduxI } from '../../../../../redux/slices/courses';
import { selectUser, SystemRolesOptions } from '../../../../../redux/slices/user';
import OnyxLink from '../../../../basics/OnyxLink';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import { notification } from '../../../../utils/notifications/Notification';
import { CourseSectionItemLectureI } from '../../courseItemsTypes';
import { EditMovementSubDial, EditWidthSubDial, ManageOptionsSubDial } from '../edit-sub-dials/edit-sub-dials';
import SectionContentSkeleton from '../SectionContentSkeleton';
import {
	EditFieldset,
	EditFieldsetLegend,
	SectionEditCofigButton,
	SectionEditConfigSubDial,
} from '../SectionEditElements';
import { CourseSectionItemFooter } from '../SectionItems';
import LectureChangeModal from './LectureChangeModal';
import LectureItemEditModal from './LectureItemEditModal';

const LECTURES_MAP = {
	lecture: {
		iconHref: '/images/courses/sections/abstract.png',
		width: '50px',
		hrefTitle: 'Перейти к лекции',
		fileType: 'Лекционные материалы',
	},
};

interface ISectionContentLectureItem
	extends Pick<CourseSectionItemLectureI, 'cslid' | 'parentCsiid' | 'basis' | 'title' | 'styles'>,
		Partial<Pick<CourseSectionItemLectureI, 'csiid' | 'hide'>> {
	skeleton?: boolean;
	forcedMode?: CoursesReduxI['mode'];
}

function SectionContentLectureItem(props: ISectionContentLectureItem) {
	const theme = useTheme();
	const router = useRouter();
	const userData = useTypedSelector(selectUser);
	const viewMode = useTypedSelector(store => store.courses.mode);
	const mobileMode = useMediaQuery(theme.breakpoints.down('lg'));

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
			disabled={!props.cslid}
			href={
				props.hide && SystemRolesOptions[userData._systemRole].accessLevel < 2
					? '/'
					: router.asPath.split('?')[0].split('/').includes('additionals')
					? `/courses/${router.query.cid}/additionals/lecture?addType=${
							router.query.addType || 'files'
					  }&cslid=${props.cslid}&from=${parseCurrentUrlWithoutFromQuery(router)}`
					: `/courses/${router.query.cid}/${router.query.csid}/lecture?cslid=${props.cslid}&from=${
							router.asPath.includes('from=')
								? router.asPath.slice(0, router.asPath.indexOf('from=') + 1) +
								  parseCurrentUrlWithoutFromQuery(router)
								: router.asPath
					  }`
			}
			title={LECTURES_MAP.lecture.hrefTitle}
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
				}}
			>
				<Stack width='100%' height='100%' direction='row' alignItems='center' gap={2}>
					<img
						alt='Lecture icon'
						src={LECTURES_MAP.lecture.iconHref}
						style={{ width: LECTURES_MAP.lecture.width }}
					/>
					<OnyxTypography text={props.title} tpColor={props.styles?.color} />
				</Stack>
				<CourseSectionItemFooter
					viewed={isViewed}
					onStatusClickCallback={isViewed ? () => handleViewStatusChange(undefined, false) : undefined}
					additional={{ fileType: LECTURES_MAP.lecture.fileType }}
				/>
			</Button>
		</OnyxLink>
	);

	return !!props.skeleton ? (
		<SectionContentSkeleton {...props} iconType='lecture' />
	) : props.forcedMode === 'observe' || (props.forcedMode !== 'editor' && viewMode === 'observe') ? (
		ContentLink
	) : (
		<EditFieldsetLectureWrapper {...props}>{ContentLink}</EditFieldsetLectureWrapper>
	);
}

export default SectionContentLectureItem;

export function EditFieldsetLectureWrapper(
	props: ComponentProps<typeof SectionContentLectureItem> & { children: ReactNode },
) {
	const router = useRouter();
	const isAxiosFired = React.useRef<boolean>(false);

	const [configState, setConfigState] = React.useState<boolean>(false);
	const [editModalState, setEditModalState] = React.useState<boolean>(false);
	const [changeLectureModalState, setChangeLectureModalState] = React.useState<boolean>(false);

	const [editCourseLectureSource] = rtkApi.useEditCourseLectureSourceMutation();
	const [editLecturesLectureSource] = rtkApi.useEditLectureLectureSourceMutation();

	function handleChangeLectureSource(cslid: string) {
		if (!cslid || !props.csiid || isAxiosFired.current) return;
		isAxiosFired.current = true;
		const currentID = parseCurrentContentID(router);

		(currentID.isLecture
			? editLecturesLectureSource({
					cslid: currentID.id,
					csiid: props.csiid,
					newCSLID: cslid,
			  })
			: editCourseLectureSource({
					cid: router.query.cid as string,
					csid: currentID.id,
					csiid: props.csiid,
					cslid,
			  })
		)
			.then(response => {
				if (typeof response === 'object' && 'error' in response)
					notification({
						message: (response.error as OnyxApiErrorResponseType).data?.message,
						type: 'error',
					});
				else if ('result' in response.data && !!response.data.result) {
					notification({
						message: `Новая лекция успешно привязана!`,
						type: 'success',
					});
					setChangeLectureModalState(false);
				}
			})
			.catch(() =>
				notification({
					message:
						'Произошла ошибка в процессе привязывания лекции! Попробуйте позже или обратитесь в поддержку.',
					type: 'error',
				}),
			)
			.finally(() => (isAxiosFired.current = false));
	}

	return (
		<EditFieldset
			styles={{
				width: !!props.basis ? `${props.basis}%` : '100%',
				borderStyle: 'ridge',
			}}
		>
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
				Элемент - {LECTURES_MAP.lecture.fileType}
				<SectionEditCofigButton configState={configState} setConfigState={setConfigState} />
				<SectionEditConfigSubDial
					orderNumber={1}
					configState={configState}
					ariaLabel='Container config'
					items={[
						{
							name: 'Выбрать другую лекцию',
							icon: <StickyNote2OutlinedIcon />,
							onClick: () => setChangeLectureModalState(prev => !prev),
						},
						{ name: 'Редактировать', icon: <EditIcon />, onClick: () => setEditModalState(prev => !prev) },
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

			<LectureItemEditModal {...props} modalState={editModalState} setModalState={setEditModalState} />
			<LectureChangeModal
				{...props}
				modalState={changeLectureModalState}
				setModalState={setChangeLectureModalState}
				onSubmitCallback={handleChangeLectureSource}
			/>
		</EditFieldset>
	);
}
