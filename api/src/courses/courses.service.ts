import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotValidDataError } from 'errors/NotValidDataError';
import { Model } from 'mongoose';
import { Course, CourseI, CoursePrivatePartI, CoursePublicPartI, CoursesDocument } from './courses.schema';

export const COURSE_FULL_PROJECTION: { [key: string]: 1 | 0 } = { _id: 0, access: 0 };
export const COURSE_PUBLIC_PROJECTION: { [key: string]: 1 | 0 } = { icon: 1, main: 1, cid: 1 };
export const COURSE_PRIVATE_PROJECTION: { [key: string]: 1 | 0 } = {
	status: 1,
	sections: 1,
	lectures: 1,
	documents: 1,
	scorms: 1,
};

@Injectable()
export class CoursesService {
	constructor(@InjectModel(Course.name, 'onyxDB') private coursesModel: Model<CoursesDocument>) {}

	async getAllCIDs(): Promise<string[]> {
		return (
			await this.coursesModel
				.aggregate([
					{
						$match: { $or: [{ status: true }, { status: undefined }] },
					},
					{
						$project: { _id: 0, cid: 1 },
					},
				])
				.exec()
		).map(obj => obj['cid']);
	}

	async getAllUnicCategories(): Promise<string[]> {
		const allCategories: string[] = (
			await this.coursesModel
				.aggregate([
					{
						$match: { $or: [{ status: true }, { status: undefined }] },
					},
					{
						$project: { _id: 0, 'main.category': 1 },
					},
				])
				.exec()
		).map(obj => obj['main']['category']);
		return Array.from(new Set(allCategories).values());
	}

	async getAllTitles(): Promise<string[]> {
		const allCategories: string[] = (
			await this.coursesModel
				.aggregate([
					{
						$match: { $or: [{ status: true }, { status: undefined }] },
					},
					{
						$project: { _id: 0, 'main.title': 1 },
					},
				])
				.exec()
		).map(obj => obj['main']['title']);
		return Array.from(new Set(allCategories).values());
	}

	async getCoursesList(): Promise<CoursePublicPartI[]> {
		return await this.coursesModel.find(
			{ $or: [{ status: true }, { status: undefined }] },
			COURSE_PUBLIC_PROJECTION,
		);
	}

	async getCourseData(cid: string): Promise<CourseI> {
		if (!cid) throw new NotValidDataError();
		return await this.coursesModel.findOne({ cid }, COURSE_FULL_PROJECTION);
	}

	async getCoursePublicData(cid: string): Promise<CoursePublicPartI> {
		if (!cid) throw new NotValidDataError();
		return await this.coursesModel.findOne({ cid }, COURSE_PUBLIC_PROJECTION);
	}

	async getCoursePrivateData(cid: string): Promise<CoursePrivatePartI> {
		if (!cid) throw new NotValidDataError();
		return await this.coursesModel.findOne({ cid }, COURSE_PRIVATE_PROJECTION);
	}
}
