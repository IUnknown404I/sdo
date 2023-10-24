import { Controller, Get, Param, Query, Res, Response, StreamableFile, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotValidDataError } from 'errors/NotValidDataError';
import { createReadStream } from 'fs';
import { StringValidationPipe } from 'globalPipes/StringValidationPipe';
import { AccessTokenGuard } from 'guards/AccessTokenGuard';
import { getCurrentDomain } from 'utils/utilityFunctions';
import { CoursePrivatePartI, CoursePublicPartI } from './courses.schema';
import { CoursesService } from './courses.service';
import StreamZip = require('node-stream-zip');

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

	@Get('scorm/:scname/:filename')
	@ApiTags('Courses')
	async zipFilesTest(
		@Response({ passthrough: true }) res,
		@Param('scname', StringValidationPipe) scname: string,
		@Param('filename', StringValidationPipe) filename: string,
		@Query('add-path') additionalPath?: string,
	): Promise<StreamableFile | NotValidDataError> {
		const searchResult = await this.coursesService.scormSearchFile({
			scname,
			filename,
			additionalPath,
		});
		if ('error' in searchResult) return new NotValidDataError(searchResult.message);

		res.set(searchResult.resOptions);
		return new StreamableFile(createReadStream(searchResult.pathToFile));
	}

	@Get('scorm/:scname/:filename/echo')
	@ApiTags('Courses')
	async echoScormFile(
		@Response({ passthrough: true }) res,
		@Param('scname', StringValidationPipe) scname: string,
		@Param('filename', StringValidationPipe) filename: string,
		@Query('add-path') additionalPath?: string,
	): Promise<boolean> {
		const searchResult = await this.coursesService.scormSearchFile({
			scname,
			filename,
			additionalPath,
		});
		if ('error' in searchResult) throw new NotValidDataError(searchResult.message);
		return true;
	}

	/*	SCORM REDIRECTING LAYER CONTROLLERS NEXT	*/
	@Get('scorm/:scname/:layer1/:filename')
	async zipFilesTestRedirect_Layer1(
		@Res({ passthrough: true }) res, // not @Response as streaming files --> headers error appears using @Response at edge cases
		@Param('scname', StringValidationPipe) scname: string,
		@Param('layer1', StringValidationPipe) layer1: string,
		@Param('filename', StringValidationPipe) filename: string,
	) {
		return res.redirect(`${getCurrentDomain()}/courses/scorm/${scname}/${filename}?add-path=${layer1}`);
	}

	@Get('scorm/:scname/:layer1/:layer2/:filename')
	async zipFilesTestRedirect_Layer2(
		@Response({ passthrough: true }) res,
		@Param('scname', StringValidationPipe) scname: string,
		@Param('layer1', StringValidationPipe) layer1: string,
		@Param('layer2', StringValidationPipe) layer2: string,
		@Param('filename', StringValidationPipe) filename: string,
	) {
		return res.redirect(`${getCurrentDomain()}/courses/scorm/${scname}/${filename}?add-path=${layer1}/${layer2}`);
	}

	@Get('scorm/:scname/:layer1/:layer2/:layer3/:filename')
	async zipFilesTestRedirect_Layer3(
		@Response({ passthrough: true }) res,
		@Param('scname', StringValidationPipe) scname: string,
		@Param('layer1', StringValidationPipe) layer1: string,
		@Param('layer2', StringValidationPipe) layer2: string,
		@Param('layer3', StringValidationPipe) layer3: string,
		@Param('filename', StringValidationPipe) filename: string,
	) {
		return res.redirect(
			`${getCurrentDomain()}/courses/scorm/${scname}/${filename}?add-path=${layer1}/${layer2}/${layer3}`,
		);
	}

	@Get('scorm/:scname/:layer1/:layer2/:layer3/:layer4/:filename')
	async zipFilesTestRedirect_Layer4(
		@Response({ passthrough: true }) res,
		@Param('scname', StringValidationPipe) scname: string,
		@Param('layer1', StringValidationPipe) layer1: string,
		@Param('layer2', StringValidationPipe) layer2: string,
		@Param('layer3', StringValidationPipe) layer3: string,
		@Param('layer4', StringValidationPipe) layer4: string,
		@Param('filename', StringValidationPipe) filename: string,
	) {
		return res.redirect(
			`${getCurrentDomain()}/courses/scorm/${scname}/${filename}?add-path=${layer1}/${layer2}/${layer3}/${layer4}`,
		);
	}

	@Get('scorm/:scname/:layer1/:layer2/:layer3/:layer4/:layer5/:filename')
	async zipFilesTestRedirect_Layer5(
		@Response({ passthrough: true }) res,
		@Param('scname', StringValidationPipe) scname: string,
		@Param('layer1', StringValidationPipe) layer1: string,
		@Param('layer2', StringValidationPipe) layer2: string,
		@Param('layer3', StringValidationPipe) layer3: string,
		@Param('layer4', StringValidationPipe) layer4: string,
		@Param('layer5', StringValidationPipe) layer5: string,
		@Param('filename', StringValidationPipe) filename: string,
	) {
		return res.redirect(
			`${getCurrentDomain()}/courses/scorm/${scname}/${filename}?add-path=${layer1}/${layer2}/${layer3}/${layer4}/${layer5}`,
		);
	}
	/*	END OF SCORM REDIRECTING LAYER CONTROLLERS	*/
}
