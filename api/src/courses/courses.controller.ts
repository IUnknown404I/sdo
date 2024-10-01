import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseBoolPipe,
	ParseIntPipe,
	Post,
	Put,
	Query,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotValidDataError } from 'errors/NotValidDataError';
import { CourseAdditionalSectionTypesPipe } from 'globalPipes/course-content';
import { StringValidationPipe } from 'globalPipes/StringValidationPipe';
import { CourseAccessViaUrlGuard } from 'guards/CourseAccessGuard';
import { AccessLevel, SystemRoles, UserData } from 'metadata/metadata-decorators';
import { User } from 'src/users/users.schema';
import { CourseAdditionalSectionType } from './courses-content.service';
import {
	CourseI,
	CoursePrivatePartI,
	CourseSectionType,
	CourseSectionTypeWithoutContent,
	CoursesSearchPropsType,
	CourseStudyFormatType,
	CoursesTypesType,
	LandingDocumentType,
} from './courses.schema';
import { CoursesService } from './courses.service';
import { CourseSectionAnyElementType } from './courses.types';

@Controller('courses')
export class CoursesController {
	constructor(private coursesService: CoursesService) {}

	@AccessLevel(2)
	@Post('advansed-search')
	@ApiTags('Courses')
	async advansedSearch(
		@Body('title') title?: string,
		@Body('cid') cid?: string,
		@Body('category') category?: string,
		@Body('type') type?: 'all' | CoursesSearchPropsType['type'],
		@Body('status') status?: boolean | 'all',
		@Body('limit') limit?: number,
		@Body('from') from?: number,
	): Promise<{ courses: CourseI[]; total: number }> {
		return this.coursesService.advansedSearch({
			title,
			cid,
			category,
			type,
			status,
			limit,
			from,
		});
	}

	@SystemRoles(['developer', 'admin'])
	@Post()
	@ApiTags('Courses')
	async createCourse(
		@UserData() userData,
		@Body('cid', StringValidationPipe) cid: string,
		@Body('title', StringValidationPipe) title: string,
		@Body('category', StringValidationPipe) category: string,
		@Body('description', StringValidationPipe) description: string,
		@Body('document', StringValidationPipe) document: LandingDocumentType,
		@Body('duration') duration: number,
		@Body('type', StringValidationPipe) type: CoursesTypesType,
		@Body('studyFormat', StringValidationPipe) studyFormat: CourseStudyFormatType,
		@Body('previewScreenshot', StringValidationPipe) previewScreenshot: string,
		@Body('icon', StringValidationPipe) icon: string,
		@Body('status', ParseBoolPipe) status: boolean,
	): Promise<{ result: true }> {
		await this.coursesService.createCourse(
			{
				cid,
				title,
				category,
				description,
				document,
				duration,
				type,
				studyFormat,
				previewScreenshot,
				icon,
				status,
			},
			userData as User,
		);
		return { result: true };
	}

	@SystemRoles(['developer'])
	@Post('delete')
	@ApiTags('Courses')
	async deleteCourses(@UserData() userData, @Body('cids') cids: string[]): Promise<{ result: true }> {
		if (!userData) throw new UnauthorizedException();
		if (!cids || !cids.length) throw new NotValidDataError();

		for (const cid of cids) {
			const requestedCourseData = await this.coursesService.getCourseFullData(cid);
			if (!requestedCourseData)
				throw new NotValidDataError('Предоставлены невалидные идентификаторы одной или более программ!');
		}

		for (const cid of cids) {
			await this.coursesService.deleteCourse(cid, userData as User);
		}
		return { result: true };
	}

	@SystemRoles(['developer', 'admin'])
	@Put('activate')
	@ApiTags('Users')
	async activateCourses(
		@UserData() userData,
		@Body('cids') cids: string[],
		@Body('isActive', ParseBoolPipe) isActive: boolean,
	): Promise<{ result: true }> {
		if (!userData) throw new UnauthorizedException();
		if (!cids || !cids.length) throw new NotValidDataError();

		for (const cid of cids) {
			const requestedCourseData = await this.coursesService.getCourseFullData(cid);
			if (!requestedCourseData)
				throw new NotValidDataError('Предоставлены невалидные идентификаторы одной или более программ!');
		}

		for (const cid of cids) {
			if (isActive) await this.coursesService.activateCourse(cid, userData as User);
			else await this.coursesService.disactivateCourse(cid, userData as User);
		}
		return { result: true };
	}

	@UseGuards(CourseAccessViaUrlGuard)
	@Get(':cid')
	@ApiTags('Courses')
	async getCourseData(@Param('cid', StringValidationPipe) cid): Promise<CourseI> {
		return this.coursesService.getCourseData(cid);
	}

	@UseGuards(CourseAccessViaUrlGuard)
	@AccessLevel(3)
	@Put(':cid')
	@ApiTags('Courses')
	async modifyCourseData(
		@Param('cid', StringValidationPipe) cid,
		@UserData() userData,
		@Body('title', StringValidationPipe) title: string,
		@Body('category', StringValidationPipe) category: string,
		@Body('description', StringValidationPipe) description: string,
		@Body('document', StringValidationPipe) document: LandingDocumentType,
		@Body('duration') duration: number,
		@Body('type', StringValidationPipe) type: CoursesTypesType,
		@Body('studyFormat', StringValidationPipe) studyFormat: CourseStudyFormatType,
		@Body('previewScreenshot', StringValidationPipe) previewScreenshot: string,
		@Body('icon', StringValidationPipe) icon: string,
		@Body('status', ParseBoolPipe) status: boolean,
	): Promise<{ result: true }> {
		await this.coursesService.modifyCourse(
			{
				cid,
				title,
				category,
				description,
				document,
				duration,
				type,
				studyFormat,
				previewScreenshot,
				icon,
				status,
			},
			userData as User,
		);
		return { result: true };
	}

	@UseGuards(CourseAccessViaUrlGuard)
	@Get(':cid/additional-section/:addType')
	@ApiTags('Courses')
	async getCourseAdditionalSection(
		@Param('cid', StringValidationPipe) cid: string,
		@Param('addType', CourseAdditionalSectionTypesPipe) addType: CourseAdditionalSectionType,
	): Promise<CourseSectionAnyElementType[]> {
		return this.coursesService.getCourseAdditionalSection(cid, addType);
	}

	@UseGuards(CourseAccessViaUrlGuard)
	@Get(':cid/sections')
	@ApiTags('Courses')
	async getCourseSections(
		@Param('cid', StringValidationPipe) cid: string,
	): Promise<CourseSectionTypeWithoutContent[]> {
		return this.coursesService.getCourseSections(cid);
	}

	@UseGuards(CourseAccessViaUrlGuard)
	@Get(':cid/sections/:csid')
	@ApiTags('Courses')
	async getCourseExactSection(
		@Param('cid', StringValidationPipe) cid: string,
		@Param('csid', StringValidationPipe) csid: string,
	): Promise<CourseSectionType> {
		return this.coursesService.getCourseExactSection(cid, csid);
	}

	@UseGuards(CourseAccessViaUrlGuard)
	@AccessLevel(2)
	@Delete(':cid/sections/:csid')
	@ApiTags('Courses')
	async deleteCourseSection(
		@Param('cid', StringValidationPipe) cid: string,
		@Param('csid', StringValidationPipe) csid: string,
	): Promise<{ result: true }> {
		return await this.coursesService.deleteCourseSection(cid, csid);
	}

	@UseGuards(CourseAccessViaUrlGuard)
	@AccessLevel(2)
	@Post(':cid/sections')
	@ApiTags('Courses')
	async createCourseSection(
		@Param('cid', StringValidationPipe) cid: string,
		@Body('title', StringValidationPipe) title: string,
		@Body('duration', ParseIntPipe) duration: number,
		@Body('background') background?: CourseSectionTypeWithoutContent['background'],
		@Body('contentTypes') contentTypes?: CourseSectionTypeWithoutContent['contentTypes'],
	): Promise<{ result: true }> {
		return this.coursesService.createCourseSection({ cid, title, duration, background, contentTypes });
	}

	@UseGuards(CourseAccessViaUrlGuard)
	@AccessLevel(2)
	@Put(':cid/sections/:csid')
	@ApiTags('Courses')
	async changeCourseSection(
		@Param('cid', StringValidationPipe) cid: string,
		@Param('csid', StringValidationPipe) csid: string,
		@Body('title', StringValidationPipe) title: string,
		@Body('duration', ParseIntPipe) duration: number,
		@Body('background') background: CourseSectionTypeWithoutContent['background'],
		@Body('contentTypes') contentTypes: CourseSectionTypeWithoutContent['contentTypes'],
	): Promise<{ result: true }> {
		return this.coursesService.changeCourseSection({ cid, csid, title, duration, background, contentTypes });
	}

	@UseGuards(CourseAccessViaUrlGuard)
	@AccessLevel(2)
	@Put(':cid/sections/:csid/order')
	@ApiTags('Courses')
	async changeCourseSectionOrder(
		@Param('cid', StringValidationPipe) cid: string,
		@Param('csid', StringValidationPipe) csid: string,
		@Body('newOrderIndex', ParseIntPipe) newOrderIndex: number,
	): Promise<{ result: true }> {
		return this.coursesService.changeCourseSectionOrder({ cid, csid, newOrderIndex });
	}

	@UseGuards(CourseAccessViaUrlGuard)
	@AccessLevel(3)
	@Get(':cid/full')
	@ApiTags('Courses')
	async getCourseFullData(@Param('cid', StringValidationPipe) cid): Promise<CourseI> {
		return this.coursesService.getCourseFullData(cid);
	}

	@UseGuards(CourseAccessViaUrlGuard)
	@AccessLevel(1)
	@Get(':cid/private')
	@ApiTags('Courses')
	async getCoursePrivateData(
		@Param('cid', StringValidationPipe) cid,
		@UserData() userData,
	): Promise<CoursePrivatePartI> {
		return this.coursesService.getCoursePrivateData(cid);
	}

	@UseGuards(CourseAccessViaUrlGuard)
	@AccessLevel(3)
	@Get(':cid/search/tutors')
	@ApiTags('CoursesGroups')
	async getAvailableTutorsForCourse(
		@Param('cid', StringValidationPipe) cid: string,
		@Query('searchedLogin') searchedLogin?: string,
		@Query('limit') limit?: number,
		@Query('page') page?: number,
	): Promise<{ usernames: string[]; total: number }> {
		return this.coursesService.getAvailableTutorsForCourse({ cid, searchedLogin, limit, page });
	}

	@UseGuards(CourseAccessViaUrlGuard)
	@AccessLevel(3)
	@Get(':cid/search/content-makers')
	@ApiTags('CoursesGroups')
	async getAvailableContentMakersForCourse(
		@Param('cid', StringValidationPipe) cid: string,
		@Query('searchedLogin') searchedLogin?: string,
		@Query('limit') limit?: number,
		@Query('page') page?: number,
	): Promise<{ usernames: string[]; total: number }> {
		return this.coursesService.getAvailableContentMakersForCourse({ cid, searchedLogin, limit, page });
	}

	@UseGuards(CourseAccessViaUrlGuard)
	@AccessLevel(3)
	@Get(':cid/search/teachers')
	@ApiTags('CoursesGroups')
	async getAvailableTeachersForCourse(
		@Param('cid', StringValidationPipe) cid: string,
		@Query('searchedLogin') searchedLogin?: string,
		@Query('limit') limit?: number,
		@Query('page') page?: number,
	): Promise<{ usernames: string[]; total: number }> {
		return this.coursesService.getAvailableTeachersForCourse({ cid, searchedLogin, limit, page });
	}
}
