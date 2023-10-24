import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Box, Button, Slide, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { ReactElement, ReactNode } from 'react';
import { useTypedSelector } from '../../../../redux/hooks';
import OnyxLink from '../../../basics/OnyxLink';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import { CourseI, CourseSectionType } from '../coursesTypes';
import { EditFieldsetTitleWrapper, LINK_ITEM_MAP } from './SectionEditElements';

export function SectionContentPagination(props: { courseData: CourseI; sectionData: CourseSectionType }) {
	const router = useRouter();
	return (
		<Stack
			width='100%'
			direction='row'
			alignItems='center'
			justifyContent='space-between'
			sx={{ marginTop: '2rem', '@media print': { marginTop: '4rem !important' } }}
			gap={2}
		>
			<OnyxLink
				disabled={props.sectionData.orderNumber === 1}
				href={`/courses/${router.query.cid as string}/${
					props.sectionData.orderNumber === 1
						? ''
						: props.courseData.sections.find(
								section => section.orderNumber === props.sectionData.orderNumber - 1,
						  )?.csid
				}`}
			>
				<Button
					disabled={props.sectionData.orderNumber === 1}
					variant='contained'
					size='small'
					sx={{ paddingInline: '1rem' }}
				>
					<KeyboardBackspaceIcon sx={{ fontSize: '1.25rem', marginRight: '.25rem' }} />
					&nbsp;Предыдущий раздел
				</Button>
			</OnyxLink>
			<OnyxLink
				disabled={props.sectionData.orderNumber === props.courseData.sections.length}
				href={`/courses/${router.query.cid as string}/${
					props.sectionData.orderNumber === props.courseData.sections.length
						? ''
						: props.courseData.sections.find(
								section => section.orderNumber === props.sectionData.orderNumber + 1,
						  )?.csid
				}`}
			>
				<Button
					disabled={props.sectionData.orderNumber === props.courseData.sections.length}
					variant='contained'
					size='small'
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

export function SectionContentSlideTransition(props: {
	children: ReactElement<any, any> | ReactNode[];
	direction?: 'right' | 'left' | 'up' | 'down';
}) {
	return (
		<Slide in direction={props.direction || 'right'} timeout={400}>
			<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>{props.children}</Box>
		</Slide>
	);
}

export function SectionContentBlockTitle(props: { text: string; component?: React.ElementType<any> }) {
	const viewMode = useTypedSelector(store => store.courses.mode);
	const BlockTitle = (
		<OnyxTypography
			component={props.component || 'h2'}
			text={props.text}
			tpSize='1.5rem'
			tpColor='primary'
			sx={{ marginBottom: '.5rem' }}
		/>
	);

	return viewMode === 'observe' ? (
		BlockTitle
	) : (
		<EditFieldsetTitleWrapper text={props.text}>{BlockTitle}</EditFieldsetTitleWrapper>
	);
}

export function CourseSectionItemFooter(props: {
	viewed?: boolean;
	showFileType?: boolean;
	additional?: { fileSize?: number; fileType?: keyof typeof LINK_ITEM_MAP };
}) {
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
					{!!props.additional.fileType && `${LINK_ITEM_MAP[props.additional.fileType].fileType}`}
					{!!props.additional.fileSize && `: ${props.additional.fileSize} Кб`}
				</OnyxTypography>
			)}
			{props.viewed ? <ViewedLabel /> : <NotViewedLabel />}
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
			не просмотрено <HelpIcon color='secondary' sx={{ fontSize: '1.05rem' }} />
		</OnyxTypography>
	);
}
