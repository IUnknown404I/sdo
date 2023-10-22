import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CoursesDocument = Document & Course;

@Schema()
export class Course {
	@Prop({ required: true })
	cid: string;
	@Prop({ required: false })
	status: boolean;
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
	@Prop({ required: true })
	icon: string;
	// @Prop({ type: Object, required: false })
	// documents: {
	// 	text?: Array<string>;
	// 	iconUrl?: string;
	// 	documentType?: 'recval' | 'upcval' | 'profession';
	// 	certificateUrl?: string;
	// };
}

export type landingDocumentType =
	| 'Удостоверение установленного образца'
	| 'Диплом о профессиональной переподготовке с приложением'
	| 'Свидетельство о профессии рабочего, должности служащего';

export const coursesSchema = SchemaFactory.createForClass(Course);
