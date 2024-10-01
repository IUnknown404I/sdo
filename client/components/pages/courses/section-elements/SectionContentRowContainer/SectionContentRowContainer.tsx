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

interface ISectionContentRowContainer
	extends Pick<CourseSectionContainerI, 'csiid' | 'status' | 'styles' | 'hide' | 'parentCsiid'>,
		SectionContentContainerOnlyType {
	children: ReactNode | ReactNode[];
}

export function SectionContentRowContainer(props: ISectionContentRowContainer) {
	const userData = useTypedSelector(selectUser);
	const viewMode = useTypedSelector(store => store.courses.mode);

	const RowContainer = (
		<>
			{/* <Stack
				direction={{ xs: 'column', md: 'row' }}
				alignItems='center'
				justifyContent='center'
				gap={2}
				sx={{
					display:
						SystemRolesOptions[userData._systemRole].accessLevel < 1 &&
						!!props.hide &&
						viewMode === 'observe'
							? 'none'
							: 'flex',
					width: '100%',
				filter: viewMode === 'observe' && !!props.hide ? 'grayscale(1)' : undefined,
					'> a': { flexBasis: '50%' },
					'> a > button': { flexDirection: 'column', padding: '.5rem' },
					'a, > button, img, p': { filter: !!props.hide ? 'grayscale(1)' : undefined },
				}}
			>
				{props.children}
			</Stack> */}
			<Paper
				elevation={props.styles?.elevation || 0}
				sx={{
					width: '100%',
					minHeight: '75px',
					filter: viewMode === 'observe' && !!props.hide ? 'grayscale(1)' : undefined,
					display:
						SystemRolesOptions[userData._systemRole].accessLevel < 1 &&
						!!props.hide &&
						viewMode === 'observe'
							? 'none'
							: 'flex',
					flexDirection: { xs: 'column', md: 'row' },
					alignItems: props.styles?.centered === false ? undefined : 'center',
					justifyContent: props.styles?.centered === false ? undefined : 'center',
					gap: '.5rem',
					padding: !!props.styles?.elevation ? '1rem' : !!props.styles?.borderWidth ? '.5rem' : undefined,
					borderWidth: props.styles?.borderWidth ? `${props.styles.borderWidth}px` : '0px',
					borderColor: !!props.hide || props.containerPickMode ? 'gray' : props.styles?.borderColor,
					borderStyle: props.styles?.borderStyle,
					borderRadius: !!props.styles?.elevation ? '8px' : '',
				}}
			>
				{props.children}
			</Paper>
		</>
	);

	return viewMode === 'observe' ? (
		RowContainer
	) : (
		<EditFieldsetRowContainerWrapper {...props} rowChildren={props.children}>
			{RowContainer}
		</EditFieldsetRowContainerWrapper>
	);
}

export default SectionContentRowContainer;

function EditFieldsetRowContainerWrapper(
	props: ComponentProps<typeof SectionContentRowContainer> & { rowChildren: ReactNode | ReactNode[] },
) {
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
	//for lectures
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

	function sectionElemsCreating({
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
				zIndex: 0,
				position: 'relative',
				transition: 'all .25s ease-out',
				cursor: !!props.containerPickMode
					? Array.isArray(props.rowChildren) && props.rowChildren.length > 1
						? 'not-allowed'
						: 'pointer'
					: undefined,
				paddingRight: !Array.isArray(props.rowChildren) || props.rowChildren.length <= 1 ? '50px' : undefined,
				borderStyle: 'dashed',
				borderWidth: !!props.containerPickMode ? '2px' : undefined,
				borderColor:
					!!props.containerPickMode && Array.isArray(props.rowChildren) && props.rowChildren.length > 1
						? 'darkred'
						: isActive
						? 'green'
						: isCurrent
						? '#006fba'
						: 'lightgray',
				'&:hover':
					!!props.containerPickMode && !(Array.isArray(props.rowChildren) && props.rowChildren.length > 1)
						? {
								borderColor: isActive || isCurrent ? '' : 'darkorange',
								'> legend': { color: isActive || isCurrent ? '' : 'darkorange' },
						  }
						: { zIndex: 1 },
			}}
			onClick={
				!!props.containerPickMode?.clickHandler &&
				!(Array.isArray(props.rowChildren) && props.rowChildren.length > 1)
					? () => props.containerPickMode!.clickHandler!(props.csiid)
					: undefined
			}
		>
			<EditFieldsetLegend styles={{ transition: 'all .25s ease-out' }}>
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
					text='Строчный контейнер'
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
					{(!Array.isArray(props.rowChildren) || props.rowChildren.length <= 1) && (
						<OnyxTypography
							component='div'
							sx={{
								position: 'absolute',
								top:
									!Array.isArray(props.rowChildren) || !props.rowChildren?.length
										? '50%'
										: 'calc(50% - 20px)',
								right: !Array.isArray(props.rowChildren) || !props.rowChildren?.length ? '50%' : '2px',
								transform:
									!Array.isArray(props.rowChildren) || !props.rowChildren?.length
										? 'translateY(-50%)'
										: undefined,
							}}
							ttFollow={false}
							ttPlacement='top'
							ttNode='Добавить элемент в строку'
						>
							<Button
								variant='text'
								size='small'
								color='success'
								sx={{
									minWidth: 'unset',
								}}
								onClick={() => setAddModalState(prev => !prev)}
							>
								<ControlPointIcon sx={{ fontSize: '2.25rem' }} />
							</Button>
						</OnyxTypography>
					)}

					<ContentContainerEditModal
						rowMode
						modalState={configModalState}
						setModalState={setConfigModalState}
						onSubmitCallback={sectionContainerElementEdit}
						{...props}
						styles={{
							...props.styles,
							centered: props.styles?.centered === undefined ? true : props.styles.centered,
						}}
					/>
					<ContentAddElemetModal
						state={addModalState}
						setState={setAddModalState}
						exclude={{ dividers: true, exams: isInLectureContent(router) }}
						onSelectCallback={sectionElemsCreating}
						loading={isAxiosFired.current}
					/>
				</>
			)}
		</EditFieldset>
	);
}
