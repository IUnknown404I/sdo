import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import EditIcon from '@mui/icons-material/Edit';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';
import { Button, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import React, { ComponentProps, ReactNode } from 'react';
import { OnyxApiErrorResponseType, rtkApi } from '../../../../../redux/api';
import {
	isInLectureContent,
	parseCurrentContentID,
	parseCurrentUrlWithoutFromQuery,
} from '../../../../../redux/endpoints/lecturesEnd';
import { useTypedSelector } from '../../../../../redux/hooks';
import { CoursesReduxI } from '../../../../../redux/slices/courses';
import { selectUser, SystemRolesOptions } from '../../../../../redux/slices/user';
import OnyxLink from '../../../../basics/OnyxLink';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import { notification } from '../../../../utils/notifications/Notification';
import ContentScormChangePackageModal from '../../config-elements/ContentScormChangePackageModal';
import ContentScormEditModal from '../../config-elements/ContentScormEditModal';
import { SectionItemBaseProps } from '../../courseItemsTypes';
import SectionContentSkeleton from '../SectionContentSkeleton';
import {
	EditFieldset,
	EditFieldsetLegend,
	SectionEditCofigButton,
	SectionEditConfigSubDial,
} from '../SectionEditElements';
import { CourseSectionItemFooter } from '../SectionItems';
import { EditMovementSubDial, EditWidthSubDial, ManageOptionsSubDial } from '../edit-sub-dials/edit-sub-dials';

type ScormItemsTypes = 'ispring' | 'storyline';
const SCORM_MAP = {
	scorm: {
		href: '/images/courses/sections/scorm.png',
		width: '50px',
		hrefTitle: 'Интерактивная презентация',
		fileType: 'Scorm-пакет',
	},
};

interface ISectionScormItem extends Omit<SectionItemBaseProps, 'csiid'>, Partial<Pick<SectionItemBaseProps, 'csiid'>> {
	scid: string;
	type: ScormItemsTypes;
	disableControls?: boolean;
	forcedMode?: CoursesReduxI['mode'];
}

function SectionScormItem(props: ISectionScormItem) {
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

	const ScormItem = (
		<OnyxLink
			disabled={!props.scid}
			href={
				props.hide && SystemRolesOptions[userData._systemRole].accessLevel < 2
					? '/'
					: router.asPath.split('?')[0].split('/').includes('additionals')
					? `/courses/${router.query.cid}/additionals/scorm?addType=${router.query.addType || 'files'}&scid=${
							props.scid
					  }${isInLectureContent(router) ? `&from=${parseCurrentUrlWithoutFromQuery(router)}` : ''}`
					: `/courses/${router.query.cid}/${router.query.csid}/scorm/${props.scid}` +
					  (isInLectureContent(router) ? `?from=${parseCurrentUrlWithoutFromQuery(router)}` : '')
			}
			title='Интерактивная презентация'
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
					<img alt='Scorm package icon' src={SCORM_MAP.scorm.href} style={{ width: SCORM_MAP.scorm.width }} />
					<OnyxTypography text={props.text} />
				</Stack>

				<CourseSectionItemFooter
					viewed={isViewed}
					onStatusClickCallback={isViewed ? () => handleViewStatusChange(undefined, false) : undefined}
					additional={{ fileSize: props.fileSize, fileType: SCORM_MAP.scorm.fileType }}
				/>
			</Button>
		</OnyxLink>
	);

	return !!props.skeleton ? (
		<SectionContentSkeleton {...props} iconType='scorm' />
	) : props.forcedMode === 'observe' || (props.forcedMode !== 'editor' && viewMode === 'observe') ? (
		ScormItem
	) : (
		<EditFieldsetScormWrapper {...props} title={`Scorm-пакет, тип: ${props.type}`}>
			{ScormItem}
		</EditFieldsetScormWrapper>
	);
}

export function EditFieldsetScormWrapper(
	props: ComponentProps<typeof SectionScormItem> & { title?: string; children: ReactNode },
) {
	const router = useRouter();
	const isAxiosFired = React.useRef<boolean>(false);

	const [configState, setConfigState] = React.useState<boolean>(false);
	const [editModalState, setEditModalState] = React.useState<boolean>(false);
	const [changePackagetModalState, setChangePackagetModalState] = React.useState<boolean>(false);

	const [editCourseScormSource] = rtkApi.useEditCourseScormSourceMutation();
	const [editLectureScormSource] = rtkApi.useEditLectureScormSourceMutation();

	function handleChangeScormSource(scid: string) {
		if (!scid || !props.csiid || isAxiosFired.current) return;
		isAxiosFired.current = true;
		const currentID = parseCurrentContentID(router);

		(currentID.isLecture
			? editLectureScormSource({
					cslid: currentID.id,
					csiid: props.csiid,
					scid,
			  })
			: editCourseScormSource({
					cid: router.query.cid as string,
					csid: currentID.id,
					csiid: props.csiid,
					scid,
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
						message: `Новый scorm-пакет успешно привязан!`,
						type: 'success',
					});
					setChangePackagetModalState(false);
				}
			})
			.catch(() =>
				notification({
					message:
						'Произошла ошибка в процессе изменения scorm-пакета! Попробуйте позже или обратитесь в поддержку.',
					type: 'error',
				}),
			)
			.finally(() => (isAxiosFired.current = false));
	}

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
				{props.title || `Элемент - ${SCORM_MAP.scorm.fileType}`}

				{props.disableControls !== true && (
					<>
						<SectionEditCofigButton configState={configState} setConfigState={setConfigState} />
						<SectionEditConfigSubDial
							orderNumber={1}
							configState={configState}
							ariaLabel='Container config'
							items={[
								{
									name: 'Перейти в хранилище',
									icon: <VideoSettingsIcon />,
									href: `/storage/scorms/${props.scid}`,
								},
								{
									name: 'Выбрать Scorm',
									icon: <ChangeCircleIcon />,
									onClick: () => setChangePackagetModalState(prev => !prev),
								},
								{
									name: 'Редактировать',
									icon: <EditIcon />,
									onClick: () => setEditModalState(prev => !prev),
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
						<ManageOptionsSubDial
							orderNumber={4}
							hide={props.hide}
							state={configState}
							csiid={props.csiid}
						/>
					</>
				)}
			</EditFieldsetLegend>

			{props.children}

			<ContentScormEditModal modalState={editModalState} setModalState={setEditModalState} {...props} />
			<ContentScormChangePackageModal
				{...props}
				modalState={changePackagetModalState}
				setModalState={setChangePackagetModalState}
				onSubmitCallback={handleChangeScormSource}
			/>
		</EditFieldset>
	);
}

export default SectionScormItem;
