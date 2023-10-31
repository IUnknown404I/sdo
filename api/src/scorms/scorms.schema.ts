import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ScormsDocument = Document & Scorm;

@Schema()
export class Scorm {
	@Prop({ required: true, unique: true })
	scid: string;
	@Prop({ required: true })
	status: boolean;
	@Prop({ required: true })
	type: 'ispring' | 'storyline';
	@Prop({ required: true })
	title: string;
	@Prop({ required: true, unique: true })
	scname: string;
	@Prop({ required: true })
	category?: string;
	@Prop({ required: false })
	size: number;
}

export const scormsSchema = SchemaFactory.createForClass(Scorm);
