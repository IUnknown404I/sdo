import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StringValidationPipe } from 'globalPipes/StringValidationPipe';
import { AccessTokenGuard } from 'guards/AccessTokenGuard';
import { CoursePrivatePartI, CoursePublicPartI } from './courses.schema';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
	constructor(private coursesService: CoursesService) {}

	@Get('')
	@ApiTags('Courses')
	async getAllCoursesList() {
		return await this.coursesService.getCoursesList();
	}

	@Get('cids')
	@ApiTags('Courses')
	async getAllCIDs(): Promise<string[]> {
		return await this.coursesService.getAllCIDs();
	}

	@Get('categories')
	@ApiTags('Courses')
	async getAllCategories(): Promise<string[]> {
		return await this.coursesService.getAllUnicCategories();
	}

	@Get('titles')
	@ApiTags('Courses')
	async getAllTitles(): Promise<string[]> {
		return await this.coursesService.getAllTitles();
	}

	@UseGuards(AccessTokenGuard)
	@Get(':cid')
	@ApiTags('Courses')
	async getCourseData(@Param('cid', StringValidationPipe) cid): Promise<CoursePublicPartI> {
		return await this.coursesService.getCourseData(cid);
	}

	@Get(':cid/public')
	@ApiTags('Courses')
	async getCoursePublicData(@Param('cid', StringValidationPipe) cid): Promise<CoursePublicPartI> {
		return await this.coursesService.getCoursePublicData(cid);
	}

	@UseGuards(AccessTokenGuard)
	@Get(':cid/private')
	@ApiTags('Courses')
	async getCoursePrivateData(@Param('cid', StringValidationPipe) cid): Promise<CoursePrivatePartI> {
		return await this.coursesService.getCoursePrivateData(cid);
	}
}
