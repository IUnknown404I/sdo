import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Box, Button, Slide, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import React, { ReactElement, ReactNode } from 'react';
import { checkSectionAvailability } from '../../../../layout/CoursesLayout';
import { rtkApi } from '../../../../redux/api';
import { useTypedSelector } from '../../../../redux/hooks';
import { selectUser, SystemRolesOptions } from '../../../../redux/slices/user';
import OnyxLink from '../../../basics/OnyxLink';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import { CourseI, CourseSectionType } from '../coursesTypes';
import { LINK_ITEM_MAP } from './SectionEditElements';

interface ISectionContentPagination {
	courseData: CourseI;
	sectionData: CourseSectionType;
}

export function SectionContentPagination(props: ISectionContentPagination) {
	const router = useRouter();
	const userData = useTypedSelector(selectUser);

	const { data: currentProgressData } = rtkApi.useCurrentCourseProgressQuery((router.query.cid as string) || '');

	const [isPreviousSectionAvailable, isNextSectionAvailable] = React.useMemo<[boolean, boolean]>(
		() => [
			props.sectionData.orderNumber <= 1
				? false
				: SystemRolesOptions[userData._systemRole].accessLevel >= 1
				? true
				: checkSectionAvailability(
						props.courseData.sections?.find(
							section => section.orderNumber === props.sectionData.orderNumber - 1,
						)?.csid,
						currentProgressData?.restrictments,
				  ),
			props.sectionData.orderNumber >= props.courseData.sections?.length
				? false
				: SystemRolesOptions[userData._systemRole].accessLevel >= 1
				? true
				: checkSectionAvailability(
						props.courseData.sections?.find(
							section => section.orderNumber === props.sectionData.orderNumber + 1,
						)?.csid,
						currentProgressData?.restrictments,
				  ),
		],
		[props.sectionData, currentProgressData],
	);

	return (
		<Stack
			aria-label='sections-pagination'
			width='100%'
			direction='row'
			alignItems='center'
			justifyContent='space-between'
			sx={{ marginTop: '2rem', '@media print': { marginTop: '4rem !important' } }}
			gap={2}
		>
			<OnyxLink
				disabled={!isPreviousSectionAvailable}
				href={`/courses/${router.query.cid as string}/${
					!isPreviousSectionAvailable
						? ''
						: props.courseData.sections.find(
								section => section.orderNumber === props.sectionData.orderNumber - 1,
						  )?.csid
				}`}
			>
				<Button
					size='small'
					variant='contained'
					disabled={!isPreviousSectionAvailable}
					sx={{ paddingInline: '1rem' }}
				>
					<KeyboardBackspaceIcon sx={{ fontSize: '1.25rem', marginRight: '.25rem' }} />
					&nbsp;Предыдущий раздел
				</Button>
			</OnyxLink>

			<OnyxLink
				disabled={!isNextSectionAvailable}
				href={`/courses/${router.query.cid as string}/${
					!isNextSectionAvailable
						? ''
						: props.courseData.sections.find(
								section => section.orderNumber === props.sectionData.orderNumber + 1,
						  )?.csid
				}`}
			>
				<Button
					size='small'
					variant='contained'
					disabled={!isNextSectionAvailable}
					sx={{ paddingInline: '1rem' }}
				>
					Следующий раздел&nbsp;
					<KeyboardBackspaceIcon
						sx={{
							fontSize: '1.25rem',
							marginRight: '.25rem',
							transform: 'rotate(180deg)',
						}}
					/>
				</Button>
			</OnyxLink>
		</Stack>
	);
}

interface ISectionContentSlideTransition {
	children: ReactElement<any, any> | ReactNode[];
	direction?: 'right' | 'left' | 'up' | 'down';
}

export function SectionContentSlideTransition(props: ISectionContentSlideTransition) {
	return (
		<Slide in direction={props.direction || 'right'} timeout={400}>
			<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>{props.children}</Box>
		</Slide>
	);
}

interface ICourseSectionItemFooter {
	viewed?: boolean;
	showFileType?: boolean;
	additional?: { fileSize?: number; fileType?: keyof typeof LINK_ITEM_MAP | string };
	onStatusHoverText?: string;
	onStatusClickCallback?: Function;
	hideViewdLabel?: boolean;
}

export function CourseSectionItemFooter(props: ICourseSectionItemFooter) {
	const router = useRouter();
	const isViewedLabelHided =
		props.hideViewdLabel ||
		// !router.asPath.includes('/courses/') ||
		!router.query.cid ||
		!router.query.csid ||
		router.asPath.split('/courses/')[1].split('/').length > 2;

	return (
		<OnyxTypography
			tpSize='.75rem'
			sx={{
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: !!props.additional?.fileSize ? 'space-between' : 'flex-end',
				marginTop: '.25rem',
				gap: '1rem',
				textTransform: 'none',
			}}
		>
			{(props.additional?.fileSize || props.additional?.fileType) && (
				<OnyxTypography component='span' tpSize='inherit' tpColor='secondary' sx={{ width: '100%' }}>
					{!!props.additional.fileType &&
						`${
							LINK_ITEM_MAP[props.additional.fileType as keyof typeof LINK_ITEM_MAP]?.fileType ||
							props.additional.fileType
						}`}
					{!!props.additional.fileSize && `: ${props.additional.fileSize} Кб`}
				</OnyxTypography>
			)}

			{isViewedLabelHided ? null : !!props.onStatusClickCallback ? (
				<OnyxTypography
					component='div'
					ttArrow
					ttFollow={false}
					ttPlacement='top'
					ttNode={props.onStatusHoverText || 'Изменить статус на непросмотренный'}
					sx={{ fontSize: 'inherit' }}
				>
					<Button
						variant='text'
						color='success'
						size='small'
						sx={{
							textTransform: 'unset',
							margin: 'unset',
							width: 'fit-content',
							minWidth: 'unset',
							padding: 'unset',
							fontSize: 'inherit',
						}}
						onClick={e => {
							e.preventDefault();
							e.stopPropagation();
							props.onStatusClickCallback!();
						}}
					>
						{props.viewed ? <ViewedLabel /> : <NotViewedLabel />}
					</Button>
				</OnyxTypography>
			) : props.viewed ? (
				<ViewedLabel />
			) : (
				<NotViewedLabel />
			)}
		</OnyxTypography>
	);
}

export function ViewedLabel() {
	return (
		<OnyxTypography
			component='span'
			tpSize='inherit'
			sx={{
				width: '100%',
				display: 'flex',
				justifyContent: 'flex-end',
				alignItems: 'center',
				gap: '.25rem',
				color: 'green',
			}}
		>
			просмотрено <CheckCircleIcon color='success' sx={{ fontSize: '1.05rem' }} />
		</OnyxTypography>
	);
}

export function NotViewedLabel() {
	return (
		<OnyxTypography
			component='span'
			tpSize='inherit'
			sx={{
				width: '100%',
				display: 'flex',
				justifyContent: 'flex-end',
				alignItems: 'center',
				gap: '.25rem',
				color: 'grey',
			}}
		>
			не просмотрено <ErrorOutlinedIcon color='secondary' sx={{ fontSize: '1.05rem' }} />
		</OnyxTypography>
	);
}
