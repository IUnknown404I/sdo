import EditIcon from '@mui/icons-material/Edit';
import RttIcon from '@mui/icons-material/Rtt';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { OnyxApiErrorResponseType, rtkApi } from '../../../../../redux/api';
import { parseCurrentContentID } from '../../../../../redux/endpoints/lecturesEnd';
import { useTypedSelector } from '../../../../../redux/hooks';
import { CoursesReduxI } from '../../../../../redux/slices/courses';
import { selectUser, SystemRolesOptions } from '../../../../../redux/slices/user';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import { notification } from '../../../../utils/notifications/Notification';
import { SectionItemBaseProps } from '../../courseItemsTypes';
import { EditMovementSubDial, EditWidthSubDial, ManageOptionsSubDial } from '../edit-sub-dials/edit-sub-dials';
import SectionContentSkeleton from '../SectionContentSkeleton';
import {
	EditFieldset,
	EditFieldsetLegend,
	SectionEditCofigButton,
	SectionEditConfigSubDial,
} from '../SectionEditElements';
import TextBlockTextEditorModal from './TextBlockTextEditorModal';
import TextEditModal from './TextEditModal';

// @ts-ignore
const CustomTextEditor = dynamic(() => import('../../../../editors/TextEditor'), {
	ssr: false,
});

interface ISectionContentTextBlockBase {
	skeleton?: boolean;
	// disableControls?: boolean;
	forcedMode?: CoursesReduxI['mode'];
}
export interface ISectionContentTextBlock
	extends Omit<SectionItemBaseProps, 'text' | 'color'>,
		ISectionContentTextBlockBase {
	content: string;
}

export function SectionContentTextBlock(props: ISectionContentTextBlock) {
	const theme = useTheme();
	const userData = useTypedSelector(selectUser);
	const viewMode = useTypedSelector(store => store.courses.mode);
	const mobileMode = useMediaQuery(theme.breakpoints.down('lg'));

	const TextBlock = (
		<Box
			className='ck-content'
			sx={{
				display:
					SystemRolesOptions[userData._systemRole].accessLevel < 1 && !!props.hide && viewMode === 'observe'
						? 'none'
						: 'flex',
				opacity:
					SystemRolesOptions[userData._systemRole].accessLevel < 1 && !!props.hide && viewMode === 'observe'
						? '0'
						: !!props.hide
						? '.75'
						: '1',
				filter: !!props.hide ? 'grayscale(1)' : undefined,
				gap: '1rem',
				height: '100%',
				fontSize: '1.1rem',
				borderRadius: '6px',
				flexDirection: 'column',
				padding: props.styles?.borderWidth && '.5rem !important',
				borderColor: props.styles?.borderColor && `${props.styles?.borderColor} !important`,
				borderStyle: props.styles?.borderStyle && `${props.styles?.borderStyle} !important`,
				width: mobileMode
					? '100%'
					: viewMode !== 'editor' && props.basis
					? `${props.basis}% !important`
					: '100%',
				flexBasis: mobileMode
					? '100%'
					: viewMode !== 'editor' && props.basis
					? `${props.basis}% !important`
					: '100%',
				borderWidth: props.styles?.borderWidth ? `${props.styles.borderWidth}px !important` : '0px',
			}}
		>
			{'content' in props && <div dangerouslySetInnerHTML={{ __html: props.content }} />}
		</Box>
	);

	return !!props.skeleton ? (
		<SectionContentSkeleton forcedSkeletonType='textBlock' />
	) : props.forcedMode === 'observe' || (props.forcedMode !== 'editor' && viewMode === 'observe') ? (
		TextBlock
	) : (
		// <EditFieldsetTextBlock content={'content' in props ? props.content : ''} {...props}>
		<EditFieldsetTextBlock {...props}>{TextBlock}</EditFieldsetTextBlock>
	);
}

export default SectionContentTextBlock;

interface IEditFieldsetTextBlock extends ISectionContentTextBlock {
	children: ReactNode | ReactNode[];
}

function EditFieldsetTextBlock(props: IEditFieldsetTextBlock) {
	const router = useRouter();
	const isAxiosFired = React.useRef<boolean>(false);
	const currentID = React.useMemo(() => parseCurrentContentID(router), [router]);

	const [editState, setEditState] = React.useState<boolean>(false);
	const [modalState, setModalState] = React.useState<boolean>(false);
	const [configState, setConfigState] = React.useState<boolean>(false);

	// for courses
	const [editTestBlockStyles] = rtkApi.useEditCourseTextBlockStylesMutation();
	const [editTestBlockContent] = rtkApi.useEditCourseTextBlockContentMutation();
	// for lectures
	const [editLectureTestBlockStyles] = rtkApi.useEditLectureTextBlockStylesMutation();
	const [editLectureTestBlockContent] = rtkApi.useEditLectureTextBlockContentMutation();

	function modifyTextBlockContent(content: string) {
		if (!content) return;
		isAxiosFired.current = true;

		(currentID.isLecture
			? editLectureTestBlockContent({
					cslid: currentID.id,
					csiid: props.csiid,
					content,
			  })
			: editTestBlockContent({
					cid: router.query.cid as string,
					csid: currentID.id,
					csiid: props.csiid,
					content,
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
						message: `Контент текстового блока успешно изменён!`,
						type: 'success',
					});
			})
			.catch(() =>
				notification({
					message:
						'Произошла ошибка в процессе изменения контента текстового блока! Попробуйте позже или обратитесь в поддержку.',
					type: 'error',
				}),
			)
			.finally(() => (isAxiosFired.current = false));
	}

	function modifyTextBlockStyles(payload: {
		flexBasis: number;
		borderWidth: number;
		borderColor: string;
		borderStyle: string;
	}) {
		if (!payload || !payload.flexBasis || !payload.borderWidth || !payload.borderColor || !payload.borderStyle)
			return;
		isAxiosFired.current = true;

		(currentID.isLecture
			? editLectureTestBlockStyles({
					cslid: currentID.id,
					csiid: props.csiid,
					styles: {
						width: payload.flexBasis as 25 | 50 | 75 | 100,
						borderWidth: payload.borderWidth,
						borderColor: payload.borderColor,
						borderStyle: payload.borderStyle,
					},
			  })
			: editTestBlockStyles({
					cid: router.query.cid as string,
					csid: currentID.id,
					csiid: props.csiid,
					styles: {
						width: payload.flexBasis as 25 | 50 | 75 | 100,
						borderWidth: payload.borderWidth,
						borderColor: payload.borderColor,
						borderStyle: payload.borderStyle,
					},
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
						message: `Стили текстового блока успешно изменены!`,
						type: 'success',
					});
			})
			.catch(() =>
				notification({
					message:
						'Произошла ошибка в процессе изменения стилей текстового блока! Попробуйте позже или обратитесь в поддержку.',
					type: 'error',
				}),
			)
			.finally(() => (isAxiosFired.current = false));
	}

	return (
		<EditFieldset styles={{ borderStyle: 'solid', width: !!props.basis ? `${props.basis}%` : '100%' }}>
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
				Текстовый блок
				<SectionEditCofigButton configState={configState} setConfigState={setConfigState} />
				<SectionEditConfigSubDial
					orderNumber={1}
					configState={configState}
					ariaLabel='Container config'
					items={[
						{
							name: 'Изменить содержимое',
							icon: <RttIcon />,
							onClick: () => setModalState(prev => !prev),
						},
						{
							name: 'Редактировать',
							icon: <EditIcon />,
							onClick: () => setEditState(prev => !prev),
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

			<TextBlockTextEditorModal
				state={modalState}
				setState={setModalState}
				content={props.content}
				onSubmitCallback={modifyTextBlockContent}
			/>
			<TextEditModal
				{...props}
				modalState={editState}
				setModalState={setEditState}
				onSubmitCallback={modifyTextBlockStyles}
			/>
		</EditFieldset>
	);
}
