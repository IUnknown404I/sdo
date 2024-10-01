import { CourseSectionAnyElementType } from './courseItemsTypes';

export interface CourseI extends CoursePublicPartI, CoursePrivatePartI {}
export interface FullCourseWithGroupsI extends CourseI, CourseGroupsI {}

export interface CoursePublicPartI {
	cid: string;
	icon: string;
	main: {
		title: string;
		category: string;
		type: CoursesTypesType;
		description: string;
		previewScreenshot: string;
		duration: number;
		studyFormat: CourseStudyFormatType;
		document: LandingDocumentType;
	};
}

export interface CoursePrivatePartI {
	status: boolean;
	// content
	sections: Array<CourseSectionType>;
	// sub-content pages
	filesContent: CourseSectionAnyElementType[];
	materialsContent: CourseSectionAnyElementType[];
	recordsContent: CourseSectionAnyElementType[];
	meta: {
		createdBy: string;
		createdAt: number;
		changedBy: string;
		changedAt: number;
	};
}

export interface CourseGroupsI {
	// admin groups
	tutors: CourseAdminGroupItemType[];
	content_makers: CourseAdminGroupItemType[];
	teachers: CourseAdminGroupItemType[];
	// user groups
	study_groups: LocalCourseGroupType[];
}

export type CourseContentMapType = { [key: string]: string };
export type CourseSectionType = {
	csid: string;
	title: string;
	duration: number;
	orderNumber: number;
	contentTypes: {
		lectures?: boolean;
		videoLectures?: boolean;
		interactivity?: boolean;
		tests?: boolean;
	};
	background?: {
		backgroundPattern?: string;
		backgroundIcon?: string;
	};
	content: Array<CourseSectionAnyElementType>;
};
export type CourseSectionTypeWithoutContent = Omit<CourseSectionType, 'content'>;

export type CourseAdminGroupItemType = {
	username: string;
	addedAt: string;
	addedBy: string;
};
export type LocalCourseGroupType = {
	lgid: string;
	isActive: boolean;
	chat: string;
	name: string;
	syncTo?: string; // cid
	teachers: string[]; // usernames
	students: string[]; // usernames
	restrictments: LocalGroupRestrictmentsType;
	meta: {
		createdAt: number;
		createdBy: string;
		editedAt?: number;
		editedBy?: string;
	};
};
export type LocalGroupRestrictmentsType = {
	startDate: number;
	endDate: number;
	sections: { [key: string]: LocalGroupSectionsRestrictmentsType }; // where key is csid (section's ID)
	meta: {
		editedAt: number;
		editedBy: string;
	};
};
export type LocalGroupSectionsRestrictmentsType =
	| undefined
	| {
			availableFrom?: number;
			availableTo?: number;
			finishedElement?: string; // course item-id
	  };

export type CourseUserAccessRoleType = 'student' | 'teacher' | 'content_maker' | 'tutor';
export const CourseRolesTranslation = {
	tutor: 'Куратор',
	content_maker: 'Контент-мейкер',
	teacher: 'Преподаватель',
	student: 'Слушатель',
};

export type CoursesTypesType =
	| 'Дополнительная профессиональная программа повышения квалификации'
	| 'Дополнительная профессиональная программа профессиональной переподготовки'
	| 'Основная программа профессионального обучения - программа профессиональной подготовки по профессии';
export const COURSES_TYPES: { [key: string]: CoursesTypesType } = {
	pk: 'Дополнительная профессиональная программа повышения квалификации',
	recval: 'Дополнительная профессиональная программа профессиональной переподготовки',
	prof: 'Основная программа профессионального обучения - программа профессиональной подготовки по профессии',
} as const;
export const isCoursesTypesType = (type: string): type is CoursesTypesType =>
	!type ? false : Object.values(COURSES_TYPES).includes(type as CoursesTypesType);

export const CourseStudyFormats: CourseStudyFormatType[] = ['Очно-заочный', 'Очный', 'Заочный'];
export type CourseStudyFormatType = 'Очно-заочный' | 'Очный' | 'Заочный';
export const isCourseStudyFormatType = (format: string): format is CourseStudyFormatType =>
	!format ? false : CourseStudyFormats.includes(format as CourseStudyFormatType);

export const CourseDocuments: LandingDocumentType[] = [
	'Удостоверение установленного образца',
	'Диплом о профессиональной переподготовке с приложением',
	'Свидетельство о профессии рабочего, должности служащего',
];
export type LandingDocumentType =
	| 'Удостоверение установленного образца'
	| 'Диплом о профессиональной переподготовке с приложением'
	| 'Свидетельство о профессии рабочего, должности служащего';
export const isCourseDocumentType = (document: string): document is LandingDocumentType =>
	!document ? false : CourseDocuments.includes(document as LandingDocumentType);

export const CourseSectionContentTypesMap = {
	lectures: 'Лекции',
	videoLectures: 'Видеолекции',
	interactivity: 'Интерактивность ',
	tests: 'Тестирование',
};

export type CourseAdditionalSectionType = 'files' | 'materials' | 'records';
export const COURSE_ADDITIONAL_SECTURES_MAP = {
	files: 'filesContent',
	materials: 'materialsContent',
	records: 'recordsContent',
};
export const isCourseAdditionalSectionType = (type: string): type is keyof typeof COURSE_ADDITIONAL_SECTURES_MAP => {
	return type in COURSE_ADDITIONAL_SECTURES_MAP;
};
