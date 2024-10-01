import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Paper, Stack, SxProps } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { OnyxApiErrorResponseType, rtkApi } from '../../../../redux/api';
import { CourseSectionElementCreatingQueries } from '../../../../redux/endpoints/courseContentEnd';
import { parseCurrentContentID } from '../../../../redux/endpoints/lecturesEnd';
import { useTypedSelector } from '../../../../redux/hooks';
import { CoursesReduxI } from '../../../../redux/slices/courses';
import { selectUser, SystemRolesOptions } from '../../../../redux/slices/user';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import { notification } from '../../../utils/notifications/Notification';
import ContentAddElemetModal from '../add-elements/ContentAddElemetModal';
import {
	CourseSectionAnyElementType,
	isCourseSectionCard,
	isCourseSectionContainerI,
	isCourseSectionDivider,
	isCourseSectionEmptyDivider,
	isCourseSectionItemDocument,
	isCourseSectionItemHeader,
	isCourseSectionItemImage,
	isCourseSectionItemLecture,
	isCourseSectionItemLink,
	isCourseSectionItemScorm,
	isCourseSectionItemText,
	isCourseSectionRowContainer,
	isCourseSectionTest,
	SectionContentContainerOnlyType,
} from '../courseItemsTypes';
import { CourseSectionType } from '../coursesTypes';
import SectionContentTextBlock from './EditFieldsetTextBlock/EditFieldsetTextBlock';
import SectionCardItem from './SectionCardItem/SectionCardItem';
import SectionContentContainer from './SectionContentContainer/SectionContentContainer';
import SectionContentDivider from './SectionContentDivider/SectionContentDivider';
import SectionContentDocumentItem from './SectionContentDocumentItem/SectionContentDocumentItem';
import SectionContentEmptyElement from './SectionContentEmptyElement/SectionContentEmptyElement';
import SectionContentHeader from './SectionContentHeader/SectionContentHeader';
import SectionContentImage from './SectionContentImage/SectionContentImage';
import SectionContentLectureItem from './SectionContentLectureItem/SectionContentLectureItem';
import SectionContentLinkItem from './SectionContentLinkItem/SectionContentLinkItem';
import SectionContentRowContainer from './SectionContentRowContainer/SectionContentRowContainer';
import SectionScormItem from './SectionScormItem/SectionScormItem';
import SectionTestItem from './SectionTestItem/SectionTestItem';

interface ISectionContentBlock extends SectionContentContainerOnlyType {
	sectionContent: CourseSectionType['content'];
	sx?: SxProps;
}

const SectionContentBlock = (props: ISectionContentBlock) => {
	const router = useRouter();
	const userData = useTypedSelector(selectUser);
	const isAxiosFired = React.useRef<boolean>(false);
	const viewMode = useTypedSelector(store => store.courses.mode);

	const [addModalState, setAddModalState] = React.useState<boolean>(false);
	const [createSectionRootElement] = rtkApi.useCourseCreateSectionElementMutation();
	const [createLectureRootElement] = rtkApi.useLectureCreateElementMutation();

	function sectionRootElemsCreating({
		type,
		subType,
		linkType,
	}: Omit<CourseSectionElementCreatingQueries, 'cid' | 'csid'>) {
		if (isAxiosFired.current || !type || !subType || !router.query.cid) return;
		isAxiosFired.current = true;
		const currentID = parseCurrentContentID(router);

		(currentID.isLecture
			? createLectureRootElement({ cslid: currentID.id, type, subType })
			: createSectionRootElement({ cid: router.query.cid as string, csid: currentID.id, type, subType })
		)
			.then(response => {
				if (typeof response === 'object' && 'error' in response)
					notification({
						message: (response.error as OnyxApiErrorResponseType).data?.message,
						type: 'error',
					});
				else if ('result' in response.data && !!response.data.result) {
					notification({
						message: `Добавление элемента в раздел успешно завершено!`,
						type: 'success',
					});
					setAddModalState(false);
				}
			})
			.catch(() =>
				notification({
					message:
						'Произошла ошибка в процессе добавления элемента! Попробуйте позже или обратитесь в поддержку.',
					type: 'error',
				}),
			)
			.finally(() => (isAxiosFired.current = false));
	}

	return (
		<Stack
			id='section-content'
			component='section'
			direction='column'
			gap={2}
			sx={{ marginTop: '1rem', isolation: 'isolate', ...props.sx }}
		>
			{!props.sectionContent?.length ||
			(SystemRolesOptions[userData._systemRole].accessLevel < 2 &&
				!props.sectionContent.find(element => element.hide === undefined || element.hide === false)) ? (
				<Stack
					width='100%'
					alignItems='center'
					justifyContent='center'
					margin='1rem 0'
					sx={{ opacity: viewMode === 'editor' ? '.5' : '1' }}
				>
					<Paper
						elevation={1}
						sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '2.5rem',
							width: 'min(600px, 99%)',
							padding: '1.5rem',
							borderRadius: '6px',
							marginInline: 'auto',
							border: '1px solid #006fba',
							'> img': { xs: { width: '75px' }, lg: { width: '150px' } },
						}}
					>
						<img alt='Empty files icon' src='/images/courses/sections/empty-box.png' />
						<Box sx={{ width: '100%' }}>
							<OnyxTypography
								tpWeight='bold'
								tpSize='1.25rem'
								tpColor='primary'
								sx={{ marginBottom: '1rem' }}
							>
								Раздел ещё формируется!
							</OnyxTypography>
							<OnyxTypography tpSize='1rem'>
								Запрашиваемая страница находится в процессе заполнения.
							</OnyxTypography>
							<OnyxTypography tpSize='1rem'>
								Вернитесь сюда позже или свяжитесь с нами любым удобным для вас способом.
							</OnyxTypography>
						</Box>
					</Paper>
				</Stack>
			) : (
				props.sectionContent
					.toSorted((a, b) => a.orderNumber - b.orderNumber)
					.map(element => (
						<AnyCourseElement
							key={element.csiid}
							{...element}
							containerPickMode={props.containerPickMode}
						/>
					))
			)}

			{!props.containerPickMode && viewMode === 'editor' && (
				<>
					<Button
						size='medium'
						color='success'
						variant='outlined'
						onClick={() => setAddModalState(prev => !prev)}
						sx={{ paddinInline: '2.5rem', margin: '1rem 0' }}
					>
						<AddIcon sx={{ fontSize: '1.5rem', marginRight: '.5rem' }} /> Добавить контейнер или разделитель
					</Button>
					<ContentAddElemetModal
						state={addModalState}
						setState={setAddModalState}
						onSelectCallback={sectionRootElemsCreating}
						loading={isAxiosFired.current}
						exclude={{
							cards: true,
							contentElements: true,
							medias: true,
							text: true,
							exams: true,
							links: true,
						}}
					/>
				</>
			)}
		</Stack>
	);
};

export function AnyCourseElement(
	elementProps: CourseSectionAnyElementType & {
		forcedMode?: CoursesReduxI['mode'];
		containerPickMode?: SectionContentContainerOnlyType['containerPickMode'];
	},
): JSX.Element {
	// CONTAINERS
	if (isCourseSectionContainerI(elementProps))
		return (
			<SectionContentContainer key={elementProps.csiid} {...elementProps}>
				{elementProps.content
					.toSorted((a, b) => a.orderNumber - b.orderNumber)
					.map(element => (
						<AnyCourseElement
							key={element.csiid}
							{...element}
							forcedMode={elementProps.forcedMode}
							containerPickMode={elementProps.containerPickMode}
						/>
					))}
			</SectionContentContainer>
		);
	if (isCourseSectionRowContainer(elementProps))
		return (
			<SectionContentRowContainer key={elementProps.csiid} {...elementProps}>
				{elementProps.content
					.toSorted((a, b) => a.orderNumber - b.orderNumber)
					.map(element => (
						<AnyCourseElement
							key={element.csiid}
							{...element}
							forcedMode={elementProps.forcedMode}
							containerPickMode={elementProps.containerPickMode}
						/>
					))}
			</SectionContentRowContainer>
		);

	// DIVIDERS
	if (isCourseSectionDivider(elementProps))
		return (
			<SectionContentDivider
				key={elementProps.csiid}
				{...elementProps}
				skeleton={!!elementProps.containerPickMode}
			/>
		);
	if (isCourseSectionEmptyDivider(elementProps))
		return (
			<SectionContentEmptyElement
				key={elementProps.csiid}
				{...elementProps}
				skeleton={!!elementProps.containerPickMode}
			/>
		);

	// TEXT
	if (isCourseSectionItemHeader(elementProps))
		return (
			<SectionContentHeader
				key={elementProps.csiid}
				{...elementProps}
				skeleton={!!elementProps.containerPickMode}
			/>
		);
	if (isCourseSectionItemText(elementProps))
		return (
			<SectionContentTextBlock
				key={elementProps.csiid}
				{...elementProps}
				skeleton={!!elementProps.containerPickMode}
			/>
		);

	// CARDS
	if (isCourseSectionCard(elementProps))
		return (
			<SectionCardItem key={elementProps.csiid} skeleton={!!elementProps.containerPickMode} {...elementProps} />
		);

	// MEDIAS
	if (isCourseSectionItemImage(elementProps))
		return (
			<SectionContentImage
				key={elementProps.csiid}
				{...elementProps}
				skeleton={!!elementProps.containerPickMode}
			/>
		);

	// LECTURE
	if (isCourseSectionItemLecture(elementProps))
		return (
			<SectionContentLectureItem
				{...elementProps}
				skeleton={!!elementProps.containerPickMode}
				key={elementProps.csiid}
				title={elementProps.title}
				basis={elementProps.styles?.width}
			/>
		);
	// DOCUMENT
	if (isCourseSectionItemDocument(elementProps))
		return (
			<SectionContentDocumentItem
				{...elementProps}
				skeleton={!!elementProps.containerPickMode}
				docid={elementProps.docid}
				key={elementProps.csiid}
				text={elementProps.title}
				viewed={elementProps.viewed}
				basis={elementProps.styles?.width}
			/>
		);
	// SCORM
	if (isCourseSectionItemScorm(elementProps))
		return (
			<SectionScormItem
				{...elementProps}
				skeleton={!!elementProps.containerPickMode}
				type='ispring'
				scid={elementProps.scid}
				key={elementProps.csiid}
				text={elementProps.title}
				viewed={elementProps.viewed}
				basis={elementProps.styles?.width}
				styles={elementProps.styles}
			/>
		);
	// TEST
	if (isCourseSectionTest(elementProps))
		return (
			<SectionTestItem
				{...elementProps}
				skeleton={!!elementProps.containerPickMode}
				tid={elementProps.tid}
				key={elementProps.csiid}
				title={elementProps.title}
				viewed={elementProps.viewed}
				basis={elementProps.styles?.width}
				styles={elementProps.styles}
			/>
		);
	// LINK
	if (isCourseSectionItemLink(elementProps))
		return (
			<SectionContentLinkItem
				{...elementProps}
				skeleton={!!elementProps.containerPickMode}
				href={elementProps.href}
				key={elementProps.csiid}
				text={elementProps.title}
				viewed={elementProps.viewed}
				styles={elementProps.styles}
				basis={elementProps.styles?.width}
			/>
		);

	return <></>;
}

export default SectionContentBlock;
