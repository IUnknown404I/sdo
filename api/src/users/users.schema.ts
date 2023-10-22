import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsersDocument = Document & User;

export interface UserI {
	username: string;
	password: string;
	email: string;
	personal?: UserPersonalT;
	metaInfo?: UserMetaInformationI;
	createdAt: string;
	lastLoginIn: string;
	lastModified: string;
	lastAuthRequest: string;
	lastEmailRequest: string;
	lastEmailUpdateRequest: string;
	lastPasswordRequest: string;
	emailToken: string;
	_requestedEmail: string;
	_requestedEmailToken: string;
	recoveryToken: string;
	isActive: boolean;
	isBlocked: boolean;
	blockReason: string;
	failedAttempts: number;
	activeRefreshToken: string;
	lastFingerprints?: string;
	lastPages?: {
		length: number;
		logs: {
			[key: string]: string[];
		};
	};
	lastRequests?: {
		length: number;
		logs: {
			[key: string]: string[];
		};
	};
	chats: {
		public: string[];
		group: string[];
		private: string[];
	};
	friends: UserFriendsI;
}

export interface AccessTokenPayload {
	username: string;
	email: string;
	lastLoginIn: string;
	isActive: boolean;
	isBlocked: boolean;
	blockReason: string;
	failedAttempts: number;
	createdAt: string;
	lastFingerprints?: string;
}

export type UserPersonalT = {
	name?: string;
	surname?: string;
	city?: string;
	company?: string;
	position?: string;
	tel?: string;
	avatar?: string;
};

export type UserMetaInformationI = {
	theme: 'light' | 'dark';
	contactVisibility: boolean;
	pushStatus: boolean;
	prefferedCommunication: 'email' | 'tel' | 'service';
};

export type UserFriendsI = {
	accepted: string[];
	pending: string[];
	requested: string[];
};

@Schema()
export class User {
	@Prop({ required: true })
	username: string;
	@Prop({ required: true })
	password: string;
	@Prop({ required: true })
	email: string;
	@Prop({ type: 'object', required: false })
	personal: UserPersonalT;
	@Prop({ type: 'object', required: false })
	metaInfo: UserMetaInformationI;
	@Prop({ required: false })
	createdAt: string;
	@Prop({ required: false })
	lastModified: string;
	@Prop({ required: false })
	lastLoginIn: string;
	@Prop({ required: false })
	lastAuthRequest: string;
	@Prop({ required: false })
	lastEmailRequest: string;
	@Prop({ required: false })
	lastEmailUpdateRequest: string;
	@Prop({ required: false })
	_requestedEmail: string;
	@Prop({ required: false })
	_requestedEmailToken: string;
	@Prop({ required: false })
	lastPasswordRequest: string;
	@Prop({ required: true })
	emailToken: string;
	@Prop({ required: true })
	recoveryToken: string;
	@Prop({ required: true })
	isActive: boolean;
	@Prop({ required: true })
	isBlocked: boolean;
	@Prop({ required: false })
	blockReason: string;
	@Prop({ required: false })
	failedAttempts: number;
	@Prop({ required: false })
	activeRefreshToken: string;
	@Prop({ required: false })
	lastFingerprints: string;
	@Prop({ type: 'object', required: false })
	lastPages: {
		length: number;
		logs: {
			[key: string]: string[];
		};
	};
	@Prop({ type: 'object', required: false })
	lastRequests: {
		length: number;
		logs: {
			[key: string]: string[];
		};
	};
	@Prop({ type: 'object', required: true })
	chats: {
		public: string[];
		group: string[];
		private: string[];
	};
	@Prop({ type: 'object', required: true })
	friends: UserFriendsI;
}

export const userSchema = SchemaFactory.createForClass(User);
