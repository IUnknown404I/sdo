import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import {
	CourseSectionAnyElementType,
	isCourseSectionContainer,
	isCourseSectionDivider,
	isCourseSectionEmptyDivider,
	isCourseSectionItemLecture,
	isCourseSectionItemText,
	isCourseSectionRowContainer,
} from '../courseItemsTypes';
import { CourseSectionType } from '../coursesTypes';
import SectionContentTextBlock from './EditFieldsetTextBlock/EditFieldsetTextBlock';
import SectionContentContainer from './SectionContentContainer/SectionContentContainer';
import SectionContentDivider from './SectionContentDivider/SectionContentDivider';
import SectionContentEmptyElement from './SectionContentEmptyElement/SectionContentEmptyElement';
import SectionContentLinkItem from './SectionContentLinkItem/SectionContentLinkItem';
import SectionContentRowContainer from './SectionContentRowContainer/SectionContentRowContainer';

const SectionContentBlock = (props: { sectionContent: CourseSectionType['content'] }) => {
	const router = useRouter();

	const parseSectionContentBlockElement = (props: CourseSectionAnyElementType): ReactNode => {
		// CONTAINERS
		if (isCourseSectionContainer(props))
			return (
				<SectionContentContainer key={props.csiid} elevated={props.styles.elevated}>
					{props.content
						.toSorted((a, b) => a.orderNumber - b.orderNumber)
						.map(element => parseSectionContentBlockElement(element))}
				</SectionContentContainer>
			);
		if (isCourseSectionRowContainer(props))
			return (
				<SectionContentRowContainer key={props.csiid}>
					{props.content
						.toSorted((a, b) => a.orderNumber - b.orderNumber)
						.map(element => parseSectionContentBlockElement(element))}
				</SectionContentRowContainer>
			);

		// DIVIDERS
		if (isCourseSectionDivider(props)) return <SectionContentDivider key={props.csiid} />;
		if (isCourseSectionEmptyDivider(props)) return <SectionContentEmptyElement key={props.csiid} />;

		// ITEMS
		if (isCourseSectionItemLecture(props))
			return (
				<SectionContentLinkItem
					key={props.csiid}
					text={props.title}
					type='lecture'
					viewed={props.viewed}
					basis={props.styles.width}
					href={`/courses/${router.query.cid}/${router.query.csid}/lecture?cslid=${props.cslid}`}
				/>
			);
		if (isCourseSectionItemText(props))
			return <SectionContentTextBlock key={props.csiid} content={props.content} />;

		return <></>;
	};

	return (
		<Stack
			id='section-content'
			component='section'
			direction='column'
			gap={2}
			sx={{ marginTop: '1rem', isolation: 'isolate' }}
		>
			{props.sectionContent
				.toSorted((a, b) => a.orderNumber - b.orderNumber)
				.map(element => parseSectionContentBlockElement(element))}
		</Stack>
	);
};

export default SectionContentBlock;
