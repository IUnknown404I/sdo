import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import EditIcon from '@mui/icons-material/Edit';
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
import ClassicLoader from '../../../../utils/loaders/ClassicLoader';
import { notification } from '../../../../utils/notifications/Notification';
import { SectionItemBaseProps, SYSTEM_DOCUMENTS_MAP } from '../../courseItemsTypes';
import { EditMovementSubDial, EditWidthSubDial, ManageOptionsSubDial } from '../edit-sub-dials/edit-sub-dials';
import SectionContentSkeleton from '../SectionContentSkeleton';
import {
	EditFieldset,
	EditFieldsetLegend,
	SectionEditCofigButton,
	SectionEditConfigSubDial,
} from '../SectionEditElements';
import { CourseSectionItemFooter } from '../SectionItems';
import DocumentChangeModal from './DocumentChangeModal';
import DocumentEditModal from './DocumentEditModal';

interface ISectionContentDocumentItem
	extends Omit<SectionItemBaseProps, 'csiid'>,
		Partial<Pick<SectionItemBaseProps, 'csiid'>> {
	docid: string;
	disableControls?: boolean;
	forcedMode?: CoursesReduxI['mode'];
}

function SectionContentDocumentItem(props: ISectionContentDocumentItem) {
	const theme = useTheme();
	const router = useRouter();
	const userData = useTypedSelector(selectUser);
	const mobileMode = useMediaQuery(theme.breakpoints.down('lg'));
	const viewMode = useTypedSelector(store => store.courses.mode);

	const { data: docData, isFetching: isDocDataFetching } = rtkApi.useDocumentDataQuery(props.docid);

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

	const DocumentItem = (
		<OnyxLink
			disabled={!docData?.docid}
			title={!!docData ? SYSTEM_DOCUMENTS_MAP[docData.type].hrefTitle : ''}
			download={!!docData ? SYSTEM_DOCUMENTS_MAP[docData.type].target === '_blank' : false}
			rel={!!docData && SYSTEM_DOCUMENTS_MAP[docData.type].target === '_blank' ? 'noreferrer' : undefined}
			target={!!docData ? SYSTEM_DOCUMENTS_MAP[docData.type].target : undefined}
			href={
				props.hide && SystemRolesOptions[userData._systemRole].accessLevel < 2
					? '/'
					: !!docData
					? SYSTEM_DOCUMENTS_MAP[docData.type].target !== '_blank'
						? (router.asPath.split('?')[0].split('/').includes('additionals') // parse additionals/ pages or course-sections pages
								? `${process.env.NEXT_PUBLIC_SELF}/courses/${
										router.query.cid
								  }/additionals/document?addType=${router.query.addType || 'files'}&docid=${
										props.docid
								  }`
								: `${process.env.NEXT_PUBLIC_SELF}/courses/${router.query.cid}/${router.query.csid}/document?docid=${props.docid}`) +
						  (isInLectureContent(router) ? `&from=${parseCurrentUrlWithoutFromQuery(router)}` : '')
						: `${process.env.NEXT_PUBLIC_SERVER}/documents/${props.docid}` +
						  (isInLectureContent(router) ? `?from=${parseCurrentUrlWithoutFromQuery(router)}` : '')
					: '/'
			}
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
					flexBasis: mobileMode ? '100%' : props.basis ? `${props.basis}% !important` : '100%',
					borderWidth:
						props.styles?.borderWidth !== undefined ? `${props.styles.borderWidth}px !important` : '1px',
					borderColor: `${props.styles?.borderColor} !important`,
					borderStyle: `${props.styles?.borderStyle} !important`,
					color: props.styles?.color,
				}}
			>
				<Stack width='100%' height='100%' direction='row' alignItems='center' gap={2}>
					{!isDocDataFetching ? (
						<img
							alt='File icon'
							src={
								!!docData && docData.docid
									? SYSTEM_DOCUMENTS_MAP[docData.type].iconHref
									: '/images/courses/no-document.png'
							}
							style={{
								width:
									!!docData && docData.docid
										? SYSTEM_DOCUMENTS_MAP[docData.type].width
										: SYSTEM_DOCUMENTS_MAP.pdf.width,
							}}
						/>
					) : (
						<ClassicLoader size={50} />
					)}
					<OnyxTypography text={props.text} />
				</Stack>

				<CourseSectionItemFooter
					viewed={isViewed}
					onStatusClickCallback={isViewed ? () => handleViewStatusChange(undefined, false) : undefined}
					additional={{
						fileSize: props.fileSize,
						fileType: docData && SYSTEM_DOCUMENTS_MAP[docData.type].fileType,
					}}
				/>
			</Button>
		</OnyxLink>
	);

	return !!props.skeleton ? (
		<SectionContentSkeleton {...props} iconType='document' />
	) : props.forcedMode === 'observe' || (props.forcedMode !== 'editor' && viewMode === 'observe') ? (
		DocumentItem
	) : (
		<EditFieldsetDocumentWrapper {...props}>{DocumentItem}</EditFieldsetDocumentWrapper>
	);
}

export default SectionContentDocumentItem;

export function EditFieldsetDocumentWrapper(
	props: ComponentProps<typeof SectionContentDocumentItem> & { title?: string; children: ReactNode },
) {
	const router = useRouter();
	const isAxiosFired = React.useRef<boolean>(false);

	const [configState, setConfigState] = React.useState<boolean>(false);
	const [editModalState, setEditModalState] = React.useState<boolean>(false);
	const [changeDocumentModalState, setChangeDocumentModalState] = React.useState<boolean>(false);

	const { data: docData } = rtkApi.useDocumentDataQuery(props.docid);
	const [editCourseDocumentSource] = rtkApi.useEditCourseDocumentSourceMutation();
	const [editLectureDocumentSource] = rtkApi.useEditLectureDocumentSourceMutation();

	function handleChangeTestSource(docid: string) {
		if (!docid || !props.csiid || isAxiosFired.current) return;
		isAxiosFired.current = true;
		const currentID = parseCurrentContentID(router);

		(currentID.isLecture
			? editLectureDocumentSource({
					cslid: currentID.id,
					csiid: props.csiid,
					docid,
			  })
			: editCourseDocumentSource({
					cid: router.query.cid as string,
					csid: currentID.id,
					csiid: props.csiid,
					docid,
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
						message: `Новый документ успешно привязан!`,
						type: 'success',
					});
					setChangeDocumentModalState(false);
				}
			})
			.catch(() =>
				notification({
					message:
						'Произошла ошибка в процессе изменения документа! Попробуйте позже или обратитесь в поддержку.',
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
				Элемент - {!!docData ? SYSTEM_DOCUMENTS_MAP[docData.type]['fileType'] : 'не определить тип'}
				<SectionEditCofigButton configState={configState} setConfigState={setConfigState} />
				<SectionEditConfigSubDial
					orderNumber={1}
					configState={configState}
					ariaLabel='Container config'
					items={[
						{
							name: 'Перейти в хранилище',
							icon: <DocumentScannerOutlinedIcon />,
							href: `/storage/documents/${props.docid}`,
						},
						{
							name: 'Выбрать документ',
							icon: <ChangeCircleIcon />,
							onClick: () => setChangeDocumentModalState(prev => !prev),
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
				<ManageOptionsSubDial orderNumber={4} state={configState} hide={props.hide} csiid={props.csiid} />
			</EditFieldsetLegend>

			{props.children}

			<DocumentEditModal {...props} modalState={editModalState} setModalState={setEditModalState} />
			<DocumentChangeModal
				{...props}
				modalState={changeDocumentModalState}
				setModalState={setChangeDocumentModalState}
				onSubmitCallback={handleChangeTestSource}
			/>
		</EditFieldset>
	);
}
