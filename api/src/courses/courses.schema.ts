import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CourseSectionAnyElementType } from './courses.types';

export type CoursesDocument = Document & Course;

@Schema()
export class Course {
	@Prop({ required: true })
	cid: string;
	@Prop({ required: false })
	status: boolean;
	@Prop({ required: true })
	icon: string;
	@Prop({ type: Object, required: true })
	main: {
		title: string;
		category: string;
		type: string;
		description: string;
		previewScreenshot: string;
		duration: number;
		studyFormat: string;
		document: landingDocumentType;
	};

	// content
	@Prop({ required: true })
	sections: CourseSectionType[];
	@Prop({ type: 'object', required: true })
	lectures: CourseContentMapType;
	@Prop({ type: 'object', required: true })
	documents: CourseContentMapType;
	@Prop({ type: 'object', required: true })
	scorms: CourseContentMapType;

	// user access & user progress inside
	@Prop({ required: false })
	access: CourseAccessObjectType;
}

export interface CourseI extends CoursePublicPartI, CoursePrivatePartI {}

export interface CoursePublicPartI {
	cid: string;
	icon: string;
	main: {
		title: string;
		category: string;
		type: string;
		description: string;
		previewScreenshot: string;
		duration: number;
		studyFormat: string;
		document: landingDocumentType;
	};
}

export interface CoursePrivatePartI {
	status: boolean;
	// content
	sections: Array<CourseSectionType>;
	// materials access
	lectures: { [key: string]: string };
	documents: { [key: string]: string };
	scorms: { [key: string]: string };
	// user access & user progress inside
	// access: CourseAccessObjectType;
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

export type CourseAccessObjectType = Array<{
	username: string;
	role: AccessRoleTypes;
	timestamp: number;
	fromTime: number;
	toTime: number;
	// user progress
	progress: CourseProgressObjectType;
}>;

export type CourseProgressObjectType = {
	total: number;
	finalMark?: number;
	sections: Array<{
		csid: string;
		completed: Array<CourseProgressCompletedItemType>;
	}>;
};

export type CourseProgressCompletedItemType = {
	csiid: string;
	viewed?: {
		timestamp: number;
	};
	done?: {
		timestamp: number;
	};
	mark?: number;
};

export type AccessRoleTypes = 'student' | 'teacher' | 'tutor';
export type landingDocumentType =
	| 'Удостоверение установленного образца'
	| 'Диплом о профессиональной переподготовке с приложением'
	| 'Свидетельство о профессии рабочего, должности служащего';

export const coursesSchema = SchemaFactory.createForClass(Course);
