// BASE DTO's:
export type CourseSectionItemsType = 'container' | 'divider' | 'item' | 'test';
export const isCourseSectionItemsType = (type: string): type is CourseSectionItemsType => {
	if (!type || typeof type !== 'string') return false;
	return type === 'container' || type === 'divider' || type === 'item' || type === 'test';
};
export type ContainersSubTypes = 'full' | 'row' | 'course';
export const isContainersSubTypes = (subType: string): subType is ContainersSubTypes => {
	if (!subType || typeof subType !== 'string') return false;
	return subType === 'full' || subType === 'row' || subType === 'course';
};

export type SectionItemsSubTypes =
	| 'document'
	| 'lecture'
	| 'scorm'
	| 'test'
	| 'link'
	| 'feedback'
	| 'text'
	| 'header'
	| 'image'
	| 'card';
export const isSectionItemsSubTypes = (subType: string): subType is SectionItemsSubTypes => {
	if (!subType || typeof subType !== 'string') return false;
	return (
		subType === 'document' ||
		subType === 'lecture' ||
		subType === 'scorm' ||
		subType === 'test' ||
		subType === 'link' ||
		subType === 'feedback' ||
		subType === 'text' ||
		subType === 'header' ||
		subType === 'image' ||
		subType === 'card'
	);
};
export type SectionAnyItemsSubTypes = SectionItemsSubTypes | ContainersSubTypes | DividersSubTypes;
export const isSectionAnyItemsSubTypes = (subType: string): subType is SectionAnyItemsSubTypes =>
	isSectionItemsSubTypes(subType) || isContainersSubTypes(subType) || isDividersSubTypes(subType);

export type DividersSubTypes = 'classic' | 'empty';
export const isDividersSubTypes = (subType: string): subType is DividersSubTypes => {
	if (!subType || typeof subType !== 'string') return false;
	return subType === 'classic' || subType === 'empty';
};

interface CourseSectionAnyItemBaseI {
	csiid: string;
	parentCsiid?: string;
	orderNumber: number;
	type: CourseSectionItemsType;
	subType: ContainersSubTypes | DividersSubTypes | SectionItemsSubTypes;
	hide?: boolean;
}

export interface CourseSectionBasicStylesI {
	color?: string;
	elevation?: number;
	borderWidth?: number;
	borderColor?: string;
	borderStyle?: string;
}

// CONTAINERS:
export type SectionContentContainerOnlyType = {
	containerPickMode?: {
		currentCsiid?: string;
		targetedCsiid?: string;
		clickHandler?: (csiid: string) => void;
	};
};
interface CourseSectionBaseI extends CourseSectionAnyItemBaseI {
	status?: boolean;
	type: 'container';
	subType: ContainersSubTypes;
	styles?: CourseSectionBasicStylesI;
}

export const isCourseSectionContainerI = (obj: Object): obj is CourseSectionContainerI =>
	typeof obj === 'object' &&
	'type' in obj &&
	obj['type'] === 'container' &&
	'subType' in obj &&
	obj['subType'] === 'full';
export interface CourseSectionContainerI extends Omit<CourseSectionBaseI, 'styles'> {
	subType: 'full';
	content: Array<CourseSectionAnyElementType>;
	styles?: CourseSectionBasicStylesI & { centered?: boolean };
}

export const isCourseSectionRowContainer = (obj: Object): obj is CourseSectionRowContainer =>
	typeof obj === 'object' &&
	'type' in obj &&
	obj['type'] === 'container' &&
	'subType' in obj &&
	obj['subType'] === 'row';
export interface CourseSectionRowContainer extends CourseSectionBaseI {
	subType: 'row';
	content: Array<CourseSectionAnyElementType>;
	styles?: CourseSectionBasicStylesI & { centered?: boolean };
}

// DIVIDERS:
interface CourseDividerBaseI extends CourseSectionAnyItemBaseI {
	type: 'divider';
	subType: DividersSubTypes;
}

export const isCourseSectionDivider = (obj: Object): obj is CourseSectionDividerI =>
	typeof obj === 'object' &&
	'type' in obj &&
	obj['type'] === 'divider' &&
	'subType' in obj &&
	obj['subType'] === 'classic';
export interface CourseSectionDividerI extends CourseDividerBaseI {
	subType: 'classic';
}

export const isCourseSectionEmptyDivider = (obj: Object): obj is CourseSectionEmptyDividerI =>
	typeof obj === 'object' &&
	'type' in obj &&
	obj['type'] === 'divider' &&
	'subType' in obj &&
	obj['subType'] === 'empty';
export interface CourseSectionEmptyDividerI extends CourseDividerBaseI {
	subType: 'empty';
}

// ITEMS:
export interface SectionItemBaseProps extends Pick<CourseSectionAnyItemBaseI, 'parentCsiid' | 'csiid'> {
	text: string;
	basis?: number;
	viewed?: boolean;
	fileSize?: number;
	skeleton?: boolean;
	styles?: CourseSectionItemLinkI['styles'];
}

interface CourseSectionItemBaseI extends CourseSectionAnyItemBaseI {
	type: 'item';
	subType: SectionItemsSubTypes;
	title?: string;
	basis?: number;
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
	typeof obj === 'object' && 'type' in obj && obj['type'] === 'item' && 'subType' in obj && obj['subType'] === 'link';
export interface CourseSectionItemLinkI extends CourseSectionItemBaseI {
	title: string;
	subType: 'link';
	href: string;
	linkType: ContentItemLinksType;
	target: 'unset' | string;
}

export const isCourseSectionItemDocument = (obj: Object): obj is CourseSectionItemDocumentI =>
	typeof obj === 'object' &&
	'type' in obj &&
	obj['type'] === 'item' &&
	'subType' in obj &&
	obj['subType'] === 'document';
export interface CourseSectionItemDocumentI extends CourseSectionItemBaseI {
	title: string;
	subType: 'document';
	docid: string;
}

export const isCourseSectionItemLecture = (obj: Object): obj is CourseSectionItemLectureI =>
	typeof obj === 'object' &&
	'type' in obj &&
	obj['type'] === 'item' &&
	'subType' in obj &&
	obj['subType'] === 'lecture';
export interface CourseSectionItemLectureI extends CourseSectionItemBaseI {
	title: string;
	subType: 'lecture';
	cslid: string;
}

export const isCourseSectionItemScorm = (obj: Object): obj is CourseSectionItemScormI =>
	typeof obj === 'object' &&
	'type' in obj &&
	obj['type'] === 'item' &&
	'subType' in obj &&
	obj['subType'] === 'scorm';
export interface CourseSectionItemScormI extends CourseSectionItemBaseI {
	title: string;
	subType: 'scorm';
	scid: string;
}

export const isCourseSectionTest = (obj: Object): obj is CourseSectionTestI =>
	typeof obj === 'object' && 'type' in obj && obj['type'] === 'item' && 'subType' in obj && obj['subType'] === 'test';
export interface CourseSectionTestI extends CourseSectionItemBaseI {
	title: string;
	subType: 'test';
	tid: string;
}

export const isCourseSectionItemHeader = (obj: Object): obj is CourseSectionItemHeaderI =>
	typeof obj === 'object' &&
	'type' in obj &&
	obj['type'] === 'item' &&
	'subType' in obj &&
	obj['subType'] === 'header';
export interface CourseSectionItemHeaderI extends CourseSectionItemBaseI {
	title: string;
	subType: 'header';
	styles?: Omit<CourseSectionBasicStylesI, 'elevation'> & { fullwidth?: boolean };
}

export const isCourseSectionItemFeedback = (obj: Object): obj is CourseSectionItemFeedbackI =>
	typeof obj === 'object' &&
	'type' in obj &&
	obj['type'] === 'item' &&
	'subType' in obj &&
	obj['subType'] === 'feedback';
export interface CourseSectionItemFeedbackI extends CourseSectionItemBaseI {
	title: string;
	subType: 'feedback';
	href: string;
	target: 'unset' | string;
}

export const isCourseSectionItemText = (obj: Object): obj is CourseSectionItemTextI =>
	typeof obj === 'object' && 'type' in obj && obj['type'] === 'item' && 'subType' in obj && obj['subType'] === 'text';
export interface CourseSectionItemTextI extends CourseSectionItemBaseI {
	subType: 'text';
	content: string;
}

export const isCourseSectionItemImage = (obj: Object): obj is CourseSectionItemImageI =>
	typeof obj === 'object' &&
	'type' in obj &&
	obj['type'] === 'item' &&
	'subType' in obj &&
	obj['subType'] === 'image';
export interface CourseSectionItemImageI extends Omit<CourseSectionItemBaseI, 'styles'> {
	subType: 'image';
	styles?: CourseSectionItemImageStylesI;
	preview?: boolean;
	mdid: string;
}
export interface CourseSectionItemImageStylesI extends Omit<CourseSectionBasicStylesI, 'color'> {
	width?: number;
	padding?: number;
	borderRadius?: number;
	backgroundColor?: string;
	aligment?: 'center' | 'flex-start' | 'flex-end';
}

export const isCourseSectionCard = (obj: Object): obj is CourseSectionCardI =>
	typeof obj === 'object' && 'type' in obj && obj['type'] === 'item' && 'subType' in obj && obj['subType'] === 'card';
export interface CourseSectionCardI extends Omit<CourseSectionItemBaseI, 'styles'> {
	subType: 'card';
	mdid: string;
	href?: string;
	target?: string;
	header: string;
	text: string;
	styles?: CourseSectionCardStylesI;
}
export interface CourseSectionCardStylesI extends Omit<CourseSectionBasicStylesI, 'color' | 'elevation'> {
	variant?: 'elevation' | 'outlined';
	imageHeight?: number;
	headerColor?: string;
	borderRadius?: number;
	buttonColor?: ButtonColorType; // header & button;
	objectFit?: string;
	buttonVariant?: 'text' | 'contained' | 'outlined';
}
export type ButtonColorType = 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';

// accumulators-types
export type CourseAnyContainerType = CourseSectionContainerI | CourseSectionRowContainer;
export const isCourseAnyContainerType = (obj: Object): obj is CourseAnyContainerType => {
	if (!obj || typeof obj !== 'object' || !('csiid' in obj)) return false;
	return isCourseSectionContainerI(obj) || isCourseSectionRowContainer(obj);
};

export type CourseAnyDividerType = CourseSectionDividerI | CourseSectionEmptyDividerI;
export const isCourseAnyDividerType = (obj: Object): obj is CourseAnyDividerType => {
	if (!obj || typeof obj !== 'object' || !('csiid' in obj)) return false;
	return isCourseSectionDivider(obj) || isCourseSectionEmptyDivider(obj);
};

export type CourseAnyItemType =
	| CourseSectionItemLinkI
	| CourseSectionItemDocumentI
	| CourseSectionItemLectureI
	| CourseSectionItemScormI
	| CourseSectionTestI
	| CourseSectionItemHeaderI
	| CourseSectionItemFeedbackI
	| CourseSectionItemTextI
	| CourseSectionItemImageI
	| CourseSectionCardI;
export const isCourseAnyItemType = (obj: Object): obj is CourseAnyItemType => {
	if (!obj || typeof obj !== 'object' || !('csiid' in obj)) return false;
	return (
		isCourseSectionItemLink(obj) ||
		isCourseSectionItemDocument(obj) ||
		isCourseSectionItemLecture(obj) ||
		isCourseSectionItemScorm(obj) ||
		isCourseSectionTest(obj) ||
		isCourseSectionItemHeader(obj) ||
		isCourseSectionItemFeedback(obj) ||
		isCourseSectionItemText(obj) ||
		isCourseSectionItemImage(obj) ||
		isCourseSectionCard(obj)
	);
};

export type CourseSectionAnyElementType = CourseAnyContainerType | CourseAnyDividerType | CourseAnyItemType;
export const isCourseSectionAnyElementType = (obj: Object): obj is CourseSectionAnyElementType => {
	if (!obj || typeof obj !== 'object' || !('csiid' in obj)) return false;
	return isCourseAnyContainerType(obj) || isCourseAnyDividerType(obj) || isCourseAnyItemType(obj);
};

export const SYSTEM_DOCUMENTS_MAP = {
	pdf: {
		iconHref: '/images/courses/sections/pdf.png',
		width: '50px',
		hrefTitle: 'Открыть документ',
		fileType: 'Pdf-документ',
		target: undefined,
	},
	word: {
		iconHref: '/images/courses/sections/doc.png',
		width: '50px',
		hrefTitle: 'Открыть файл',
		fileType: 'Word-документ',
		target: '_blank',
	},
	excel: {
		iconHref: '/images/courses/sections/xls.png',
		width: '50px',
		hrefTitle: 'Открыть таблицу',
		fileType: 'Excel-таблица',
		target: '_blank',
	},
	ppt: {
		iconHref: '/images/courses/sections/ppt.png',
		width: '50px',
		hrefTitle: 'Открыть презентацию',
		fileType: 'Ppt-презентация',
		target: '_blank',
	},
	zip: {
		iconHref: '/images/courses/sections/zip.png',
		width: '50px',
		hrefTitle: 'Открыть архив',
		fileType: 'Zip-архив',
		target: '_blank',
	},
	image: {
		iconHref: '/images/courses/sections/image.png',
		width: '50px',
		hrefTitle: 'Открыть изображение',
		fileType: 'Изображение',
		target: undefined,
	},
};

export const LINKS_MAP = {
	link: {
		href: '/images/courses/sections/link.png',
		width: '35px',
		hrefTitle: 'Перейти',
		fileType: 'Веб-ссылка',
		target: '_blank',
	},
	video: {
		href: '/images/courses/sections/video.png',
		width: '40px',
		hrefTitle: 'Перейти к видео',
		fileType: 'Видеофайл',
		target: '_blank',
	},
	feedback: {
		href: '/images/courses/sections/feedback.png',
		width: '50px',
		hrefTitle: 'Заполнить анкету',
		fileType: 'Опросный лист',
		target: '_blank',
	},
	webinar: {
		href: '/images/courses/sections/webinar.png',
		width: '50px',
		hrefTitle: 'Перейти к вебинару',
		fileType: 'Вебинар',
		target: '_blank',
	},
};
export type ContentItemLinksType = keyof typeof LINKS_MAP;
export const isContentItemLinksType = (type: string): type is ContentItemLinksType =>
	typeof type === 'string' && type in LINKS_MAP;
