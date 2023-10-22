import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


export interface ChatMetaI {
	createdAt: number;
	createdBy: 'system' | string;
}

export interface ChatI {
	rid: string;
	name: string;
	status: 'public' | 'group' | 'private';
	participators: ChatParticipatorI[];
	messages: ChatMessageI[];
	meta: ChatMetaI;
	online: number;
}

export type ChatsDocument = Document & Chat;

@Schema()
export class Chat {
	@Prop({ required: true })
	rid: string;
	@Prop({ required: true })
	name: string;
	@Prop({ required: true })
	status: 'public' | 'group' | 'private';
	@Prop({ required: true })
	participators: ChatParticipatorI[];
	@Prop({ required: true })
	messages: ChatMessageI[];
	@Prop({ type: 'object', required: true })
	meta: ChatMetaI;
	@Prop({ required: true })
	online: number;
}

export const chatSchema = SchemaFactory.createForClass(Chat);

export type ModifiedChatMessageOption = {
	timestamp: number;
	by: string; //username
};

export interface ChatMessageI {
	rid?: string;
	username: string;
	fio: string;
	message: string;
	timeSent: number;
	role?: string;
	// viewed?: number;
	modified?: ModifiedChatMessageOption;
}

export interface ChatContactsI {
	username: string;
	email: string;
	name: string;
	surname: string;
	position?: string;
	avatar?: string;
}

export interface UserChatDataI {
	username: string;
	email: string;
	name: string;
	surname: string;
	position?: string;
	avatar?: string;
}

export interface ChatParticipatorI {
	username: string;
	inTimestamp: number;
}