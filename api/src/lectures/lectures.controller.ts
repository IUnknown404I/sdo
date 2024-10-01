import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotValidDataError } from 'errors/NotValidDataError';
import { StringValidationPipe } from 'globalPipes/StringValidationPipe';
import { AccessLevel } from 'metadata/metadata-decorators';
import { checkCategorySyntaxisViolation } from 'utils/parseCategoryLayers';
import { Lecture } from './lectures.schema';
import { LecturesService } from './lectures.service';

@Controller('lectures')
export class LecturesController {
	constructor(private lecturesService: LecturesService) {}

	@AccessLevel(2)
	@Get('all')
	@ApiTags('Lectures')
	async getAllLectures(): Promise<Lecture[]> {
		return await this.lecturesService.getAllLectures();
	}

	@AccessLevel(2)
	@Get('category/all')
	@ApiTags('Lectures')
	async getAllLectureCategories(): Promise<string[]> {
		return await this.lecturesService.getAllLectureCategories();
	}

	@AccessLevel(2)
	@Get('structure')
	@ApiTags('Lectures')
	async getLecturesStructure(@Query('category') category?: string): Promise<Lecture[]> {
		if (checkCategorySyntaxisViolation(category))
			throw new NotValidDataError('Обнаружены запрещённые синтаксические конструкции!');

		let parsedCategory = category ?? undefined;
		if (!!parsedCategory) {
			if (parsedCategory.startsWith('/')) parsedCategory = parsedCategory.slice(1);
			if (parsedCategory.endsWith('/')) parsedCategory = parsedCategory.slice(0, parsedCategory.length - 1);
		}
		return await this.lecturesService.getLecturesStructure(parsedCategory);
	}

	@Get(':cslid')
	@ApiTags('Lectures')
	async getExactLecture(@Param('cslid', StringValidationPipe) cslid: string): Promise<Lecture> {
		return await this.lecturesService.getLecture(cslid);
	}
}
