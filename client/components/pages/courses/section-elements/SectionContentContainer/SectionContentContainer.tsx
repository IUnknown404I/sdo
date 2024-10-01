import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import { Button, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import React, { ComponentProps, ReactNode } from 'react';
import { OnyxApiErrorResponseType, rtkApi } from '../../../../../redux/api';
import { CourseSectionElementCreatingQueries } from '../../../../../redux/endpoints/courseContentEnd';
import { isInLectureContent, parseCurrentContentID } from '../../../../../redux/endpoints/lecturesEnd';
import { useTypedSelector } from '../../../../../redux/hooks';
import { CoursesReduxI } from '../../../../../redux/slices/courses';
import { selectUser, SystemRolesOptions } from '../../../../../redux/slices/user';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import { notification } from '../../../../utils/notifications/Notification';
import ContentAddElemetModal from '../../add-elements/ContentAddElemetModal';
import ContentContainerEditModal, { ContentContainerEditParams } from '../../config-elements/ContentContainerEditModal';
import { CourseSectionContainerI, SectionContentContainerOnlyType } from '../../courseItemsTypes';
import {
	EditFieldset,
	EditFieldsetLegend,
	SectionEditCofigButton,
	SectionEditConfigSubDial,
} from '../SectionEditElements';
import { EditMovementSubDial, ManageOptionsSubDial } from '../edit-sub-dials/edit-sub-dials';

interface ISectionContentContainer
	extends Omit<CourseSectionContainerI, 'type' | 'subType' | 'content' | 'orderNumber'>,
		SectionContentContainerOnlyType {
	children: ReactNode | ReactNode[];
	forcedMode?: CoursesReduxI['mode'];
}

function SectionContentContainer(props: ISectionContentContainer) {
	const userData = useTypedSelector(selectUser);
	const viewMode = useTypedSelector(store => store.courses.mode);

	const Container = (
		<Paper
			elevation={props.styles?.elevation || 0}
			sx={{
				width: '100%',
				filter: viewMode === 'observe' && !!props.hide ? 'grayscale(1)' : undefined,
				display:
					SystemRolesOptions[userData._systemRole].accessLevel < 1 && !!props.hide && viewMode === 'observe'
						? 'none'
						: 'flex',
				flexDirection: 'column',
				alignItems: props.styles?.centered ? 'center' : undefined,
				justifyContent: props.styles?.centered ? 'center' : undefined,
				gap: '.5rem',
				padding: !!props.styles?.elevation ? '1rem' : !!props.styles?.borderWidth ? '.5rem' : undefined,
				borderWidth: props.styles?.borderWidth ? `${props.styles.borderWidth}px` : '0px',
				borderColor: !!props.hide || !!props.containerPickMode ? 'gray' : props.styles?.borderColor,
				borderStyle: props.styles?.borderStyle,
				borderRadius: !!props.styles?.elevation ? '13px' : '',
			}}
		>
			{props.children}
		</Paper>
	);

	return props.forcedMode === 'observe' || (props.forcedMode !== 'editor' && viewMode === 'observe') ? (
		Container
	) : (
		<EditFieldsetContainerWrapper {...props}>{Container}</EditFieldsetContainerWrapper>
	);
}

export default SectionContentContainer;

function EditFieldsetContainerWrapper(props: ComponentProps<typeof SectionContentContainer>) {
	const router = useRouter();
	const isAxiosFired = React.useRef<boolean>(false);
	const currentID = React.useMemo(() => parseCurrentContentID(router), [router]);

	const [configState, setConfigState] = React.useState<boolean>(false);
	const [addModalState, setAddModalState] = React.useState<boolean>(false);
	const [configModalState, setConfigModalState] = React.useState<boolean>(false);

	const isActive = !!props.containerPickMode?.targetedCsiid && props.containerPickMode.targetedCsiid === props.csiid;
	const isCurrent = !!props.containerPickMode?.currentCsiid && props.containerPickMode.currentCsiid === props.csiid;

	// for courses
	const [createSectionContainerElement] = rtkApi.useCourseCreateSectionElementMutation();
	const [modifySectionContainerElement] = rtkApi.useEditCourseContainerMutation();
	// for lectures
	const [createLectureContainerElement] = rtkApi.useLectureCreateElementMutation();
	const [modifyLectureContainerElement] = rtkApi.useEditLectureContainerMutation();

	function sectionContainerElementEdit(payload: ContentContainerEditParams) {
		if (isAxiosFired.current || payload.hide === undefined || !payload.styles) return;
		isAxiosFired.current = true;

		(currentID.isLecture
			? modifyLectureContainerElement({
					cslid: currentID.id,
					csiid: props.csiid,
					hide: payload.hide,
					...payload.styles,
			  })
			: modifySectionContainerElement({
					cid: router.query.cid as string,
					csid: currentID.id,
					csiid: props.csiid,
					hide: payload.hide,
					...payload.styles,
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
						message: `Параметры контейнера успешно изменены!`,
						type: 'success',
					});
					setAddModalState(false);
				}
			})
			.catch(() =>
				notification({
					message:
						'Произошла ошибка в процессе изменения параметров контейнера! Попробуйте позже или обратитесь в поддержку.',
					type: 'error',
				}),
			)
			.finally(() => (isAxiosFired.current = false));
	}

	function sectionRootElemsCreating({
		type,
		subType,
		linkType,
	}: Omit<CourseSectionElementCreatingQueries, 'cid' | 'csid'>) {
		if (isAxiosFired.current || !type || !subType || (!currentID.isLecture && !router.query.cid)) return;
		isAxiosFired.current = true;

		(currentID.isLecture
			? createLectureContainerElement({
					cslid: currentID.id,
					type,
					subType,
					linkType,
					containerID: props.csiid,
			  })
			: createSectionContainerElement({
					cid: router.query.cid as string,
					csid: currentID.id,
					type,
					subType,
					linkType,
					containerID: props.csiid,
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
						message: `Добавление элемента в контейнер успешно завершено!`,
						type: 'success',
					});
					setAddModalState(false);
				}
			})
			.catch(() =>
				notification({
					message:
						'Произошла ошибка в процессе добавления элемента в контейнер! Попробуйте позже или обратитиесь в поддержку.',
					type: 'error',
				}),
			)
			.finally(() => (isAxiosFired.current = false));
	}

	return (
		<EditFieldset
			styles={{
				border: '3px solid lightgray',
				transition: 'all .25s ease-out',
				cursor: !!props.containerPickMode ? 'pointer' : undefined,
				borderColor: isActive ? 'green' : isCurrent ? '#006fba' : 'lightgray',
				'&:hover': !!props.containerPickMode
					? {
							borderColor: isActive || isCurrent ? '' : 'rgba(255,140,0,.25)',
							'> legend': { color: isActive || isCurrent ? '' : 'darkorange' },
					  }
					: undefined,
			}}
			onClick={
				!!props.containerPickMode?.clickHandler
					? () => props.containerPickMode!.clickHandler!(props.csiid)
					: undefined
			}
		>
			<EditFieldsetLegend
				styles={{
					transition: 'all .25s ease-out',
				}}
			>
				{!!props.hide && (
					<OnyxTypography
						tpSize='.7rem'
						component='span'
						tpColor='error'
						sx={{
							padding: '1px .25rem',
							marginRight: '.25rem',
							borderRadius: '6px',
							border: theme => `1px solid ${theme.palette.error.dark}`,
						}}
					>
						Контейнер скрыт
					</OnyxTypography>
				)}
				<OnyxTypography
					text='Контейнер'
					tpSize='.7rem'
					component='span'
					tpColor={!!props.hide ? 'error' : 'secondary'}
				/>

				{!props.containerPickMode && (
					<>
						<SectionEditCofigButton configState={configState} setConfigState={setConfigState} />
						<SectionEditConfigSubDial
							orderNumber={1}
							icon={<FormatPaintIcon />}
							configState={configState}
							ariaLabel='Container config'
							items={[
								{
									name: 'Редактировать стили',
									icon: <DesignServicesIcon />,
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
						<ManageOptionsSubDial
							orderNumber={3}
							hide={props.hide}
							state={configState}
							csiid={props.csiid}
						/>
					</>
				)}
			</EditFieldsetLegend>

			{props.children}

			{!props.containerPickMode && (
				<>
					<OnyxTypography
						component='div'
						ttFollow={false}
						ttPlacement='top'
						ttNode='Добавить элемент в контейнер'
						sx={{ marginTop: '.5rem', marginInline: 'auto', width: 'fit-content' }}
					>
						<Button
							variant='text'
							size='small'
							color='success'
							onClick={() => setAddModalState(prev => !prev)}
						>
							<ControlPointIcon sx={{ fontSize: '2.25rem' }} />
						</Button>
					</OnyxTypography>

					<ContentContainerEditModal
						modalState={configModalState}
						setModalState={setConfigModalState}
						onSubmitCallback={sectionContainerElementEdit}
						{...props}
					/>
					<ContentAddElemetModal
						state={addModalState}
						setState={setAddModalState}
						loading={isAxiosFired.current}
						onSelectCallback={sectionRootElemsCreating}
						exclude={{ exams: isInLectureContent(router) }}
					/>
				</>
			)}
		</EditFieldset>
	);
}
