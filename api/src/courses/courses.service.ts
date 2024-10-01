import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotValidDataError } from 'errors/NotValidDataError';
import { Model } from 'mongoose';
import { ProgressTestStatsItemType } from 'src/course-progress/course-progress.schema';
import { SystemRolesOptions, User, UsersDocument } from 'src/users/users.schema';
import { uid } from 'uid';
import {
	COURSE_ADDITIONAL_SECTURES_MAP,
	CourseAdditionalSectionType,
	isCourseAdditionalSectionType,
} from './courses-content.service';
import {
	COURSES_TYPES,
	Course,
	CourseChangeDataType,
	CourseGroupsI,
	CourseI,
	CoursePrivatePartI,
	CoursePublicPartI,
	CourseSectionType,
	CourseSectionTypeWithoutContent,
	CoursesDocument,
	CoursesSearchPropsType,
	LocalCourseGroupType,
	isCourseDocumentType,
	isCourseStudyFormatType,
	isCoursesTypesType,
} from './courses.schema';
import {
	CourseSectionAnyElementType,
	isCourseSectionContainerI,
	isCourseSectionRowContainer,
	isCourseSectionTest
} from './courses.types';

export const COURSE_FULL_PROJECTION: { [key: string]: 1 | 0 } = { _id: 0, access: 0 };
export const COURSE_PUBLIC_PROJECTION: { [key: string]: 1 | 0 } = { _id: 0, icon: 1, main: 1, cid: 1 };
export const COURSE_PRIVATE_PROJECTION: { [key: string]: 1 | 0 } = {
	_id: 0,
	status: 1,
	sections: 1,
	lectures: 1,
	documents: 1,
	scorms: 1,
	filesContent: 1,
	materialsContent: 1,
	recordsContent: 1,
	meta: 1,
};
export const COURSE_FULL_CONTENT_PROJECTION: { [key: string]: 1 | 0 } = {
	...COURSE_PUBLIC_PROJECTION,
	...COURSE_PRIVATE_PROJECTION,
};
export const COURSE_GROUPS_PROJECTION: { [key: string]: 1 | 0 } = {
	_id: 0,
	tutors: 1,
	content_makers: 1,
	teachers: 1,
	study_groups: 1,
};

@Injectable()
export class CoursesService {
	constructor(
		@InjectModel(Course.name, 'onyxDB') private coursesModel: Model<CoursesDocument>,
		@InjectModel(User.name, 'onyxDB') private usersModel: Model<UsersDocument>,
	) {}

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

	async advansedSearch(payload: CoursesSearchPropsType): Promise<{ courses: CourseI[]; total: number }> {
		const parsedLimit = !!payload.limit ? (payload.limit > 75 ? 75 : payload.limit) : 25;
		if (!payload.title && !payload.category && !payload.type && payload.status === undefined) {
			const firstCourses = await this.coursesModel.find(undefined, COURSE_FULL_PROJECTION);
			const parsedCourses = !!payload.from
				? firstCourses.slice(payload.from, payload.from + parsedLimit)
				: firstCourses.slice(-parsedLimit);
			return { courses: parsedCourses, total: firstCourses.length };
		}

		const filterObject = {
			cid: { $regex: payload.cid, $options: 'i' },
			status: payload.status,
			'main.title': { $regex: payload.title, $options: 'i' },
			'main.category': payload.category,
			'main.type': COURSES_TYPES[payload.type],
		};
		if (!payload.cid || payload.cid === 'all') delete filterObject.cid;
		if (!payload.title || payload.title === 'all') delete filterObject['main.title'];
		if (!payload.category || payload.category === 'all') delete filterObject['main.category'];
		if (!payload.type || payload.type === 'all') delete filterObject['main.type'];
		if (payload.status === undefined || payload.status === 'all') delete filterObject.status;

		const foundCourses = await this.coursesModel.find(filterObject, COURSE_FULL_PROJECTION);
		const parsedCourses = !!payload.from
			? foundCourses.slice(payload.from, payload.from + parsedLimit)
			: foundCourses.slice(0, parsedLimit);
		return { courses: parsedCourses, total: foundCourses.length };
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
		return this.coursesModel.find({ $or: [{ status: true }, { status: undefined }] }, COURSE_PUBLIC_PROJECTION);
	}

	async getCourseAdditionalSection(
		cid: string,
		addType: CourseAdditionalSectionType,
	): Promise<CourseSectionAnyElementType[]> {
		if (!cid || !addType || !isCourseAdditionalSectionType(addType))
			throw new NotValidDataError('Не предоставлены необходимые идентификаторы!');
		const courseData = await this.coursesModel.findOne({ cid }, COURSE_FULL_PROJECTION);
		if (!courseData) throw new NotValidDataError('Предоставлен невалидный идентификатор программы обучения!');
		return courseData[COURSE_ADDITIONAL_SECTURES_MAP[addType]] || [];
	}

	async getCourseExactSection(cid: string, csid: string): Promise<CourseSectionType> {
		if (!cid || !csid) throw new NotValidDataError();
		const courseData = await this.coursesModel.findOne({ cid }, COURSE_FULL_PROJECTION);
		if (!courseData) throw new NotValidDataError('Предоставлен невалидный идентификатор программы обучения!');
		const exactSection = courseData.sections?.find(section => section.csid === csid);
		if (!exactSection)
			throw new NotValidDataError('Предоставлен невалидный идентификатор раздела образовательной программы!');
		return exactSection;
	}

	async getCourseSections(cid: string): Promise<CourseSectionTypeWithoutContent[]>;
	async getCourseSections(cid: string, returnFullData: true): Promise<CourseSectionType[]>;
	async getCourseSections(
		cid: string,
		returnFullData?: boolean,
	): Promise<CourseSectionType[] | CourseSectionTypeWithoutContent[]> {
		if (!cid) throw new NotValidDataError();
		const courseData = await this.coursesModel.findOne({ cid }, COURSE_FULL_PROJECTION);
		if (!courseData) throw new NotValidDataError('Предоставлен невалидный идентификатор программы обучения!');
		const courseSections = courseData.sections?.slice() || [];
		if (!returnFullData) for (const section of courseSections) delete section.content;
		return courseSections;
	}

	async createCourseSection(payload: {
		cid: string;
		title: string;
		duration: number;
		background?: CourseSectionTypeWithoutContent['background'];
		contentTypes?: CourseSectionTypeWithoutContent['contentTypes'];
	}): Promise<{ result: true }> {
		const { cid, title, duration, background, contentTypes } = payload;
		if (
			!cid ||
			!title ||
			!duration ||
			(duration !== undefined && typeof duration !== 'number') ||
			(background !== undefined && typeof background !== 'object') ||
			(contentTypes !== undefined && typeof contentTypes !== 'object')
		)
			throw new NotValidDataError('Переданы невалидные значения раздела курса!');
		const courseData = await this.coursesModel.findOne({ cid }, COURSE_FULL_PROJECTION);
		if (!courseData) throw new NotValidDataError('Предоставлены невалидные ключи!');
		if (courseData.sections.find(section => section.title === title.trim()))
			throw new NotValidDataError('В данной программе уже существует раздел с таким же названием!');

		const newSectionObject: CourseSectionType = {
			csid: uid(32),
			content: [],
			orderNumber: courseData.sections?.length + 1 || 1,
			title,
			duration,
			contentTypes,
			background,
		};
		const parsedCourseSections = [...(courseData.sections || []), newSectionObject];
		await this.coursesModel.updateOne({ cid }, { sections: parsedCourseSections });
		return { result: true };
	}

	async changeCourseSection(payload: {
		cid: string;
		csid: string;
		title: string;
		duration: number;
		background?: CourseSectionTypeWithoutContent['background'];
		contentTypes?: CourseSectionTypeWithoutContent['contentTypes'];
	}): Promise<{ result: true }> {
		const { cid, csid, title, duration, background, contentTypes } = payload;
		if (
			!cid ||
			!csid ||
			!title ||
			!duration ||
			(duration !== undefined && typeof duration !== 'number') ||
			(background !== undefined && typeof background !== 'object') ||
			(contentTypes !== undefined && typeof contentTypes !== 'object')
		)
			throw new NotValidDataError('Переданы невалидные значения раздела курса!');
		const courseData = await this.coursesModel.findOne({ cid }, COURSE_FULL_PROJECTION);
		if (!courseData) throw new NotValidDataError('Предоставлены невалидные ключи!');
		const exactCourseSection = courseData.sections.find(section => section.csid === csid);
		if (!exactCourseSection)
			throw new NotValidDataError('Предоставлены невалидные идентификаторы раздела программы!');
		if (exactCourseSection.title !== title && courseData.sections.find(section => section.title === title.trim()))
			throw new NotValidDataError('В данной программе уже существует раздел с таким же названием!');

		await this.coursesModel.updateOne(
			{ cid },
			{
				sections: courseData.sections.map(section =>
					section.csid !== csid
						? section
						: {
								...section,
								title,
								duration,
								contentTypes: !!contentTypes ? contentTypes : {},
								background: !!background ? background : {},
						  },
				),
			},
		);
		return { result: true };
	}

	async deleteCourseSection(cid: string, csid: string): Promise<{ result: true }> {
		if (!cid || !csid) throw new NotValidDataError();
		const courseData = await this.coursesModel.findOne({ cid }, COURSE_FULL_PROJECTION);
		if (!courseData) throw new NotValidDataError('Предоставлены невалидные ключи!');
		const deletingSection = courseData.sections?.find(section => section.csid === csid);
		if (!deletingSection || !courseData.sections) throw new NotValidDataError('Запрошенная секция не найдена!');
		const parsedCourseSections = courseData.sections.filter(section => section.csid !== deletingSection.csid);

		// sync with all local groups of the course
		let isSync = !!courseData.study_groups ? true : false;
		const parsedStudyGroups: LocalCourseGroupType[] = [];
		for (const localGroup of courseData.study_groups || []) {
			if (Object.keys(localGroup.restrictments.sections).includes(csid)) {
				isSync = false;
				const parsedSectionRestrictions: typeof localGroup.restrictments.sections = JSON.parse(
					JSON.stringify(localGroup.restrictments.sections),
				);
				parsedStudyGroups.push({
					...localGroup,
					restrictments: { ...localGroup.restrictments, sections: parsedSectionRestrictions },
				});
			} else parsedStudyGroups.push(localGroup);
		}

		if (!isSync)
			await this.coursesModel.updateOne(
				{ cid },
				{ sections: parsedCourseSections, study_groups: parsedStudyGroups },
			);
		else await this.coursesModel.updateOne({ cid }, { sections: parsedCourseSections });
		return { result: true };
	}

	async changeCourseSectionOrder(payload: {
		cid: string;
		csid: string;
		newOrderIndex: number;
	}): Promise<{ result: true }> {
		const { cid, csid, newOrderIndex } = payload;
		if (!cid || !csid || typeof newOrderIndex !== 'number') throw new NotValidDataError();
		const courseData = await this.coursesModel.findOne({ cid }, COURSE_FULL_PROJECTION);
		if (!courseData) throw new NotValidDataError('Предоставлены невалидные ключи!');
		const movingSection = courseData.sections?.find(section => section.csid === csid);
		if (!movingSection || !courseData.sections) throw new NotValidDataError('Запрошенная секция не найдена!');
		if (newOrderIndex > courseData.sections.length)
			throw new NotValidDataError('Невозможно выполнить перемещение на указанную позицию!');
		if (newOrderIndex === movingSection.orderNumber) return { result: true };

		const parsedCourseSections = courseData.sections.slice().map(section =>
			section.csid === movingSection.csid
				? { ...section, orderNumber: newOrderIndex } // moving the section to new position
				: section.orderNumber <= newOrderIndex && section.orderNumber > movingSection.orderNumber
				? { ...section, orderNumber: section.orderNumber - 1 } // moving the section higher then start to lower positions
				: section.orderNumber >= newOrderIndex && section.orderNumber < movingSection.orderNumber
				? { ...section, orderNumber: section.orderNumber + 1 } // moving the section lower then start to higher positions
				: section,
		);
		parsedCourseSections.sort((a, b) => a.orderNumber - b.orderNumber);

		await this.coursesModel.updateOne({ cid }, { sections: parsedCourseSections });
		return { result: true };
	}

	async getCourseFullData(cid: string): Promise<CourseI & CourseGroupsI> {
		if (!cid) throw new NotValidDataError();
		return this.coursesModel.findOne({ cid }, COURSE_FULL_PROJECTION);
	}

	async getCourseData(cid: string): Promise<CourseI> {
		if (!cid) throw new NotValidDataError();
		return this.coursesModel.findOne({ cid }, COURSE_FULL_CONTENT_PROJECTION);
	}

	async getCoursePublicData(cid: string): Promise<CoursePublicPartI> {
		if (!cid) throw new NotValidDataError();
		return this.coursesModel.findOne({ cid }, COURSE_PUBLIC_PROJECTION);
	}

	async getCoursePrivateData(cid: string): Promise<CoursePrivatePartI> {
		if (!cid) throw new NotValidDataError();
		return this.coursesModel.findOne({ cid }, COURSE_PRIVATE_PROJECTION);
	}

	async activateCourse(cid: string, requestedUser: User) {
		if (SystemRolesOptions[requestedUser._systemRole].accessLevel < 4)
			throw new UnauthorizedException('У вас недостаточно прав для данного действия!');
		return this.coursesModel.updateOne(
			{ cid },
			{ status: true, 'meta.changedBy': requestedUser.username, 'meta.changedAt': +new Date() },
		);
	}

	async disactivateCourse(cid: string, requestedUser: User) {
		if (SystemRolesOptions[requestedUser._systemRole].accessLevel < 4)
			throw new UnauthorizedException('У вас недостаточно прав для данного действия!');
		return this.coursesModel.updateOne(
			{ cid },
			{ status: false, 'meta.changedBy': requestedUser.username, 'meta.changedAt': +new Date() },
		);
	}

	async deleteCourse(cid: string, requestedUser: User) {
		if (SystemRolesOptions[requestedUser._systemRole].accessLevel < 5)
			throw new UnauthorizedException('У вас недостаточно прав для данного действия!');
		return this.coursesModel.deleteOne({ cid });
	}

	async createCourse(data: CourseChangeDataType, requestedUser: User) {
		if (!requestedUser || SystemRolesOptions[requestedUser._systemRole].accessLevel < 4)
			throw new UnauthorizedException('У вас недостаточно прав для выполнения этой операции!');
		this.checkCourseChangeData(data);

		const duplicate = await this.getCourseData(data.cid);
		if (!!duplicate)
			throw new NotValidDataError(
				'Найдено совпадение! Указанный ID уже используется в системе, создание отменено!',
			);

		await this.coursesModel.create({
			cid: data.cid,
			status: data.status,
			icon: data.icon,
			main: {
				title: data.title,
				category: data.category,
				type: data.type,
				description: data.description.replace(/\n$/i, '. '),
				previewScreenshot: data.cid,
				duration: data.cid,
				studyFormat: data.cid,
				document: data.cid,
			},
			// content
			sections: [],
			filesContent: [],
			materialsContent: [],
			recordsContent: [],
			// groups
			tutors: [],
			content_makers: [],
			teachers: [],
			study_groups: [],
			// meta
			meta: {
				createdBy: requestedUser.username,
				createdAt: +new Date(),
				changedBy: requestedUser.username,
				changedAt: +new Date(),
			},
		});
	}

	async modifyCourse(data: CourseChangeDataType, requestedUser: User) {
		if (!requestedUser || SystemRolesOptions[requestedUser._systemRole].accessLevel < 4)
			throw new UnauthorizedException('У вас недостаточно прав для выполнения этой операции!');
		this.checkCourseChangeData(data, true);

		const exactCourse = await this.getCourseData(data.cid);
		if (!exactCourse) throw new NotValidDataError('Передан невалидный идентификатор программы обучения!');

		await this.coursesModel.updateOne(
			{ cid: exactCourse.cid },
			{
				status: data.status,
				icon: data.icon,
				main: {
					title: data.title,
					category: data.category,
					type: data.type,
					description: data.description.replace(/\n$/i, '. '),
					previewScreenshot: data.cid,
					duration: data.cid,
					studyFormat: data.cid,
					document: data.cid,
				},
				meta: {
					...exactCourse.meta,
					changedBy: requestedUser.username,
					changedAt: +new Date(),
				},
			},
		);
	}

	private checkCourseChangeData(
		data: CourseChangeDataType,
		ignoreCID: boolean = false,
		ignoreErrors: boolean = false,
	): boolean {
		try {
			if (!ignoreCID && !data.cid) throw new NotValidDataError('Не передан индентификатор программы!');
			if (
				!data.cid ||
				!data.title ||
				!data.category ||
				!data.description ||
				!data.icon ||
				!data.previewScreenshot
			)
				throw new NotValidDataError('Передана неполная информация!');
			if (!isCourseDocumentType(data.document))
				throw new NotValidDataError('Невалидный получаемый документ по завершении обучения!');
			if (!isCoursesTypesType(data.type)) throw new NotValidDataError('Невалидный тип программы обучения!');
			if (!isCourseStudyFormatType(data.studyFormat))
				throw new NotValidDataError('Невалидный формат обучения по программе!');
			if (!data.duration || data.duration > 9999 || data.duration < 1)
				throw new NotValidDataError('Некорректное значение длительности обучения по программе!');
			if (data.status === undefined || !(typeof data.status === 'boolean'))
				throw new NotValidDataError('Некорректное значение статуса программы!');
		} catch (e) {
			if (ignoreErrors) return false;
			else throw e;
		}
		return true;
	}

	/**
	 * @description Doesnt return the items without TID (patterns of early created items without synced tests with them)
	 */
	async getAllTestsFromCourse(
		cid: string | (CourseI & CourseGroupsI),
	): Promise<Array<Omit<ProgressTestStatsItemType, 'status' | 'attempts' | 'finalMark'>>> {
		if (!cid) throw new NotValidDataError('Не предоставлены идентификаторы программы обучения для поиска тестов!');
		const courseData = typeof cid === 'string' ? await this.coursesModel.findOne({ cid }) : cid;
		if (!courseData)
			throw new NotValidDataError(
				'Предоставлены невалидные идентификаторы программы обучения для поиска тестов!',
			);

		function parseContentForTests(
			content: CourseSectionAnyElementType[],
		): Array<Pick<ProgressTestStatsItemType, 'tid' | 'testTitle' | 'testType'>> {
			let foundTests: Array<Pick<ProgressTestStatsItemType, 'tid' | 'testTitle' | 'testType'>> = [];
			for (const element of content) {
				if (isCourseSectionContainerI(element) || isCourseSectionRowContainer(element)) {
					foundTests = foundTests.concat(parseContentForTests(element.content));
				} else if (isCourseSectionTest(element) && !!element.tid)
					foundTests.push({ tid: element.tid, testTitle: element.title, testType: 'test' });
			}
			return foundTests;
		}

		return courseData.sections.reduce(
			(acc, section) =>
				acc.concat(
					parseContentForTests(section.content).map(testData => ({
						csid: section.csid,
						sectionTitle: section.title,
						sectionOrderNumber: section.orderNumber,
						...testData,
					})),
				),
			[],
		);
	}

	async getAvailableTutorsForCourse(payload: {
		cid: string;
		searchedLogin?: string;
		limit?: number;
		page?: number;
	}): Promise<{ usernames: string[]; total: number }> {
		const courseData = await this.getCourseFullData(payload.cid);
		if (!courseData)
			throw new NotValidDataError('Предоставлен невалидный идентификатор образовательной программы!');
		const filteredUsers = await this.usersModel.find(
			!!payload.searchedLogin?.trim()
				? {
						$and: [
							{ _permittedSystemRoles: { $in: ['tutor'] } },
							{ username: { $regex: payload.searchedLogin.trim(), $options: 'i' } },
							{ username: { $nin: courseData.tutors || [] } },
						],
				  }
				: {
						_permittedSystemRoles: { $in: ['tutor'] },
						username: { $nin: courseData.tutors || [] },
				  },
			{ _id: 0, __v: 0 },
		);

		if (!filteredUsers?.length) return { usernames: [], total: 0 };
		if (!payload.page && !payload.limit)
			return { usernames: filteredUsers.slice(0, 100).map(user => user.username), total: filteredUsers.length };
		// if there are less users then requested => return last page of available users
		if (filteredUsers.length < (payload.limit || 100) * Math.abs(payload.page || 1)) {
			const toValue = filteredUsers.length / (payload.limit || 100);
			return {
				usernames: filteredUsers
					.slice((payload.limit || 100) * Math.trunc(toValue % 2 === 0 ? toValue - 1 : toValue))
					.map(user => user.username),
				total: filteredUsers.length,
			};
		}
	}

	async getAvailableContentMakersForCourse(payload: {
		cid: string;
		searchedLogin?: string;
		limit?: number;
		page?: number;
	}): Promise<{ usernames: string[]; total: number }> {
		const courseData = await this.getCourseFullData(payload.cid);
		if (!courseData)
			throw new NotValidDataError('Предоставлен невалидный идентификатор образовательной программы!');
		const filteredUsers = await this.usersModel.find(
			!!payload.searchedLogin?.trim()
				? {
						$and: [
							{ _permittedSystemRoles: { $in: ['content'] } },
							{ username: { $regex: payload.searchedLogin.trim(), $options: 'i' } },
							{ username: { $nin: courseData.content_makers || [] } },
						],
				  }
				: {
						_permittedSystemRoles: { $in: ['content'] },
						username: { $nin: courseData.content_makers || [] },
				  },
			{ _id: 0, __v: 0 },
		);

		if (!filteredUsers?.length) return { usernames: [], total: 0 };
		if (!payload.page && !payload.limit)
			return { usernames: filteredUsers.slice(0, 100).map(user => user.username), total: filteredUsers.length };
		// if there are less users then requested => return last page of available users
		if (filteredUsers.length < (payload.limit || 100) * Math.abs(payload.page || 1)) {
			const toValue = filteredUsers.length / (payload.limit || 100);
			return {
				usernames: filteredUsers
					.slice((payload.limit || 100) * Math.trunc(toValue % 2 === 0 ? toValue - 1 : toValue))
					.map(user => user.username),
				total: filteredUsers.length,
			};
		}
	}

	async getAvailableTeachersForCourse(payload: {
		cid: string;
		searchedLogin?: string;
		limit?: number;
		page?: number;
	}): Promise<{ usernames: string[]; total: number }> {
		const courseData = await this.getCourseFullData(payload.cid);
		if (!courseData)
			throw new NotValidDataError('Предоставлен невалидный идентификатор образовательной программы!');
		const filteredUsers = await this.usersModel.find(
			!!payload.searchedLogin?.trim()
				? {
						$and: [
							{ _permittedSystemRoles: { $in: ['teacher'] } },
							{ username: { $regex: payload.searchedLogin.trim(), $options: 'i' } },
							{ username: { $nin: courseData.teachers || [] } },
						],
				  }
				: {
						_permittedSystemRoles: { $in: ['teacher'] },
						username: { $nin: courseData.teachers || [] },
				  },
			{ _id: 0, __v: 0 },
		);

		if (!filteredUsers?.length) return { usernames: [], total: 0 };
		if (!payload.page && !payload.limit)
			return { usernames: filteredUsers.slice(0, 100).map(user => user.username), total: filteredUsers.length };
		// if there are less users then requested => return last page of available users
		if (filteredUsers.length < (payload.limit || 100) * Math.abs(payload.page || 1)) {
			const toValue = filteredUsers.length / (payload.limit || 100);
			return {
				usernames: filteredUsers
					.slice((payload.limit || 100) * Math.trunc(toValue % 2 === 0 ? toValue - 1 : toValue))
					.map(user => user.username),
				total: filteredUsers.length,
			};
		}
	}
}
