// BASE DTO's:
type ContainersSubTypes = 'full' | 'row' | 'course';
type SectionItemsSubTypes = 'document' | 'lecture' | 'scorm' | 'link' | 'feedback' | 'text' | 'header';
type DividersSubTypes = 'classic' | 'empty';

interface CourseSectionAnyItemBaseI {
	csiid: string;
	orderNumber: number;
	type: 'container' | 'divider' | 'item' | 'test';
	subType: ContainersSubTypes | DividersSubTypes | SectionItemsSubTypes;
}

interface CourseSectionBasicStylesI {
	color?: string;
	elevation?: number;
	borderWidth?: number;
	borderColor?: string;
	borderStyle?: string;
}

// CONTAINERS:
interface CourseSectionBaseI extends CourseSectionAnyItemBaseI {
	status: boolean;
	type: 'container';
	subType: ContainersSubTypes;
	styles: CourseSectionBasicStylesI;
}

export const isCourseSectionContainer = (obj: Object): obj is CourseSectionContainer =>
	'type' in obj && obj['type'] === 'container' && 'subType' in obj && obj['subType'] === 'full';
export interface CourseSectionContainer extends CourseSectionBaseI {
	subType: 'full';
	content: Array<CourseSectionAnyElementType>;
}

export const isCourseSectionRowContainer = (obj: Object): obj is CourseSectionRowContainer =>
	'type' in obj && obj['type'] === 'container' && 'subType' in obj && obj['subType'] === 'row';
export interface CourseSectionRowContainer extends CourseSectionBaseI {
	subType: 'row';
	content: [] | [CourseSectionAnyElementType] | [CourseSectionAnyElementType, CourseSectionAnyElementType];
}

// DIVIDERS:
interface CourseDividerBaseI extends CourseSectionAnyItemBaseI {
	type: 'divider';
	subType: DividersSubTypes;
}

export const isCourseSectionDivider = (obj: Object): obj is CourseSectionDividerI =>
	'type' in obj && obj['type'] === 'divider' && 'subType' in obj && obj['subType'] === 'classic';
export interface CourseSectionDividerI extends CourseDividerBaseI {
	subType: 'classic';
}

export const isCourseSectionEmptyDivider = (obj: Object): obj is CourseSectionEmptyDividerI =>
	'type' in obj && obj['type'] === 'divider' && 'subType' in obj && obj['subType'] === 'empty';
export interface CourseSectionEmptyDividerI extends CourseDividerBaseI {
	subType: 'empty';
}

// ITEMS:
interface CourseSectionItemBaseI extends CourseSectionAnyItemBaseI {
	type: 'item';
	subType: SectionItemsSubTypes;
	title?: string;
	styles?: Omit<CourseSectionBasicStylesI, 'elevation'> & {
		width?: 25 | 50 | 75 | 100;
	};
	security?: {
		fromDate?: number;
		toDate?: number;
	};
	viewed?: boolean;
}

export const isCourseSectionItemLink = (obj: Object): obj is CourseSectionItemLinkI =>
	'type' in obj && obj['type'] === 'item' && 'subType' in obj && obj['subType'] === 'link';
export interface CourseSectionItemLinkI extends CourseSectionItemBaseI {
	title: string;
	subType: 'link';
	href: string;
	target: 'unset' | string;
}

export const isCourseSectionItemDocument = (obj: Object): obj is CourseSectionItemDocumentI =>
	'type' in obj && obj['type'] === 'item' && 'subType' in obj && obj['subType'] === 'document';
export interface CourseSectionItemDocumentI extends CourseSectionItemBaseI {
	title: string;
	subType: 'document';
	href: string;
	target: 'unset' | string;
	size?: number;
}

export const isCourseSectionItemLecture = (obj: Object): obj is CourseSectionItemLectureI =>
	'type' in obj && obj['type'] === 'item' && 'subType' in obj && obj['subType'] === 'lecture';
export interface CourseSectionItemLectureI extends CourseSectionItemBaseI {
	title: string;
	subType: 'lecture';
	cslid: string;
}

export const isCourseSectionItemScorm = (obj: Object): obj is CourseSectionItemScormI =>
	'type' in obj && obj['type'] === 'item' && 'subType' in obj && obj['subType'] === 'scorm';
export interface CourseSectionItemScormI extends CourseSectionItemBaseI {
	title: string;
	subType: 'scorm';
	scid: string;
}

export const isCourseSectionItemHeader = (obj: Object): obj is CourseSectionItemHeaderI =>
	'type' in obj && obj['type'] === 'item' && 'subType' in obj && obj['subType'] === 'header';
export interface CourseSectionItemHeaderI extends CourseSectionItemBaseI {
	title: string;
	subType: 'header';
	styles: Omit<CourseSectionBasicStylesI, 'elevation'>;
}

export const isCourseSectionItemFeedback = (obj: Object): obj is CourseSectionItemFeedbackI =>
	'type' in obj && obj['type'] === 'item' && 'subType' in obj && obj['subType'] === 'feedback';
export interface CourseSectionItemFeedbackI extends CourseSectionItemBaseI {
	title: string;
	subType: 'feedback';
	href: string;
	target: 'unset' | string;
}

export const isCourseSectionItemText = (obj: Object): obj is CourseSectionItemTextI =>
	'type' in obj && obj['type'] === 'item' && 'subType' in obj && obj['subType'] === 'text';
export interface CourseSectionItemTextI extends CourseSectionItemBaseI {
	subType: 'text';
	content: string;
}

// accumulators-types
export type CourseAnyContainerType = CourseSectionContainer | CourseSectionRowContainer;
export type CourseAnyDividerType = CourseSectionDividerI | CourseSectionEmptyDividerI;
export type CourseAnyitemType =
	| CourseSectionItemLinkI
	| CourseSectionItemDocumentI
	| CourseSectionItemLectureI
	| CourseSectionItemScormI
	| CourseSectionItemHeaderI
	| CourseSectionItemFeedbackI
	| CourseSectionItemTextI;
export type CourseSectionAnyElementType = CourseAnyContainerType | CourseAnyDividerType | CourseAnyitemType;
