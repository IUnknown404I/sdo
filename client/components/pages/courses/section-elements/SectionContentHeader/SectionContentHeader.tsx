import EditIcon from '@mui/icons-material/Edit';
import { useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import React, { ComponentProps, ReactNode } from 'react';
import { OnyxApiErrorResponseType, rtkApi } from '../../../../../redux/api';
import { parseCurrentContentID } from '../../../../../redux/endpoints/lecturesEnd';
import { useTypedSelector } from '../../../../../redux/hooks';
import { CoursesReduxI } from '../../../../../redux/slices/courses';
import { selectUser, SystemRolesOptions } from '../../../../../redux/slices/user';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import { notification } from '../../../../utils/notifications/Notification';
import ContentHeaderEditModal from '../../config-elements/ContentHeaderEditModal';
import { CourseSectionItemHeaderI } from '../../courseItemsTypes';
import SectionContentSkeleton from '../SectionContentSkeleton';
import {
	EditFieldset,
	EditFieldsetLegend,
	SectionEditCofigButton,
	SectionEditConfigSubDial,
} from '../SectionEditElements';
import { EditMovementSubDial, EditWidthSubDial, ManageOptionsSubDial } from '../edit-sub-dials/edit-sub-dials';

interface ISectionContentHeader extends Omit<CourseSectionItemHeaderI, 'type' | 'subType'> {
	skeleton?: boolean;
	forcedMode?: CoursesReduxI['mode'];
}

function SectionContentHeader(props: ISectionContentHeader) {
	const theme = useTheme();
	const userData = useTypedSelector(selectUser);
	const viewMode = useTypedSelector(store => store.courses.mode);
	const mobileMode = useMediaQuery(theme.breakpoints.down('lg'));

	const ContentHeader = (
		<OnyxTypography
			component='h2'
			tpSize='1.5rem'
			text={props.title}
			tpColor={props.styles?.color || 'primary'}
			sx={{
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
				filter: !!props.hide ? 'grayscale(1)' : 'unset',
				width:
					mobileMode || !!props.styles?.fullwidth
						? '100%'
						: props.basis
						? `${props.basis}%`
						: props.styles?.fullwidth === false
						? 'fit-content'
						: '100%',
				flexBasis:
					mobileMode || !!props.styles?.fullwidth
						? '100%'
						: props.basis
						? `${props.basis}%`
						: props.styles?.fullwidth === false
						? 'fit-content'
						: '100%',
				marginBottom: '.5rem',
				paddingLeft: '.5rem',
				borderLeftColor: props.styles?.borderColor || 'currentColor',
				borderLeftStyle: props.styles?.borderStyle || 'solid',
				borderLeftWidth:
					typeof props.styles?.borderWidth === 'number' ? `${props.styles.borderWidth}px` : '3px',
			}}
		/>
	);

	return !!props.skeleton ? (
		<SectionContentSkeleton forcedSkeletonType='header' {...props} />
	) : props.forcedMode === 'observe' || (props.forcedMode !== 'editor' && viewMode === 'observe') ? (
		ContentHeader
	) : (
		<EditFieldsetHeaderWrapper {...props}>{ContentHeader}</EditFieldsetHeaderWrapper>
	);
}

export default SectionContentHeader;

function EditFieldsetHeaderWrapper(props: ComponentProps<typeof SectionContentHeader> & { children: ReactNode }) {
	const theme = useTheme();
	const router = useRouter();
	const isAxiosFired = React.useRef<boolean>(false);
	const mobileMode = useMediaQuery(theme.breakpoints.down('lg'));

	const [configState, setConfigState] = React.useState<boolean>(false);
	const [configModalState, setConfigModalState] = React.useState<boolean>(false);

	const [modifyHeader] = rtkApi.useEditCourseHeaderItemMutation();
	const [modifyLectureHeader] = rtkApi.useEditLectureHeaderItemMutation();

	function onHeaderParamsChange(payload: { title: string; styles: NonNullable<CourseSectionItemHeaderI['styles']> }) {
		if (!payload || !payload.title || !payload.styles) return;
		isAxiosFired.current = true;
		const currentID = parseCurrentContentID(router);

		(currentID.isLecture
			? modifyLectureHeader({
					cslid: currentID.id,
					csiid: props.csiid,
					title: payload.title,
					styles: payload.styles,
			  })
			: modifyHeader({
					cid: router.query.cid as string,
					csid: currentID.id,
					csiid: props.csiid,
					title: payload.title,
					styles: payload.styles,
			  })
		)
			.then(response => {
				if (typeof response === 'object' && 'error' in response)
					notification({
						message: (response.error as OnyxApiErrorResponseType).data?.message,
						type: 'error',
					});
				else if ('result' in response.data && !!response.data.result)
					notification({
						message: `Параметры заголовока успешно изменены!`,
						type: 'success',
					});
			})
			.catch(() =>
				notification({
					message:
						'Произошла ошибка в процессе изменения заголовка! Попробуйте позже или обратитесь в поддержку.',
					type: 'error',
				}),
			)
			.finally(() => (isAxiosFired.current = false));
	}

	return (
		<EditFieldset
			styles={{
				borderStyle: 'solid',
				width:
					mobileMode || !!props.styles?.fullwidth
						? '100%'
						: props.basis
						? `${props.basis}%`
						: props.styles?.fullwidth === false
						? 'fit-content'
						: '100%',
				flexBasis:
					mobileMode || !!props.styles?.fullwidth
						? '100%'
						: props.basis
						? `${props.basis}%`
						: props.styles?.fullwidth === false
						? 'fit-content'
						: '100%',
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
				Заголовок
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
				<ContentHeaderEditModal
					modalState={configModalState}
					setModalState={setConfigModalState}
					{...props}
					onSubmitCallback={onHeaderParamsChange}
				/>
			</EditFieldsetLegend>

			{props.children}
		</EditFieldset>
	);
}
