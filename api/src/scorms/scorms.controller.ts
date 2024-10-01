import { Controller, Get, Param, Query, Res, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotValidDataError } from 'errors/NotValidDataError';
import { createReadStream } from 'fs';
import { StringValidationPipe } from 'globalPipes/StringValidationPipe';
import { AccessLevel } from 'metadata/metadata-decorators';
import { FilesReadType } from 'utils/mimeTypes';
import { checkCategorySyntaxisViolation } from 'utils/parseCategoryLayers';
import { getCurrentDomain } from 'utils/utilityFunctions';
import { Scorm } from './scorms.schema';
import { ScormsService } from './scorms.service';

@Controller('scorms')
export class ScormsController {
	constructor(private scormsService: ScormsService) {}

	@AccessLevel(2)
	@Get('all')
	@ApiTags('Scorms')
	async getAllScorms() {
		return await this.scormsService.getAllScorms();
	}

	@AccessLevel(2)
	@Get('structure')
	@ApiTags('Scorms')
	async getScormsStructure(
		@Query('category') category?: string,
	): Promise<Array<FilesReadType | (FilesReadType & Scorm)>> {
		if (checkCategorySyntaxisViolation(category))
			throw new NotValidDataError('Обнаружены запрещённые синтаксические конструкции!');

		let parsedCategory = category;
		if (!!parsedCategory) {
			if (parsedCategory.startsWith('/')) parsedCategory = parsedCategory.slice(1);
			if (parsedCategory.endsWith('/')) parsedCategory = parsedCategory.slice(0, parsedCategory.length - 1);
		}
		return await this.scormsService.getScormStructure(parsedCategory);
	}

	@AccessLevel(2)
	@Get(':scid/info')
	@ApiTags('Scorms')
	async getScormData(@Param('scid', StringValidationPipe) scid: string) {
		return await this.scormsService.findPackageBySCID(scid);
	}

	// Scorms packages get \ unpack and ping logic
	@Get(':scid')
	@ApiTags('Scorms')
	async getScorm(@Res() res, @Param('scid', StringValidationPipe) scid: string) {
		const packageData = await this.scormsService.findPackageBySCID(scid);
		res.redirect(
			`${getCurrentDomain()}/scorms/package/${packageData.scname}/${
				packageData.type === 'ispring' ? 'res/index.html' : 'story.html'
			}${packageData.category && packageData.category !== '/' ? `?category=${packageData.category}` : ''}`,
		);
	}

	@Get(':scid/echo')
	@ApiTags('Courses')
	async echoScormFile(
		@Res({ passthrough: true }) res,
		@Param('scid', StringValidationPipe) scid: string,
	): Promise<boolean> {
		const packageData = await this.scormsService.findPackageBySCID(scid);
		if (!packageData) throw new NotValidDataError('Запрашиваемый пакет не существует!');
		const searchResult = await this.scormsService.scormSearchFile({
			scname: packageData.scname,
			filename: packageData.type === 'ispring' ? 'res/index.html' : 'story.html',
			category: packageData.category,
		});
		if ('error' in searchResult) throw new NotValidDataError(searchResult.message);
		return true;
	}

	@Get('package/:scname/:filename')
	@ApiTags('Courses')
	async zipFilesTest(
		@Res({ passthrough: true }) res,
		@Param('scname', StringValidationPipe) scname: string,
		@Param('filename', StringValidationPipe) filename: string,
		@Query('add-path') additionalPath?: string,
		@Query('category') category?: string,
	): Promise<StreamableFile | NotValidDataError> {
		const searchResult = await this.scormsService.scormSearchFile({
			scname,
			filename,
			additionalPath,
			category,
		});
		if ('error' in searchResult) return new NotValidDataError(searchResult.message);
		res.set(searchResult.resOptions);
		return new StreamableFile(createReadStream(searchResult.pathToFile));
	}

	/*	SCORM REDIRECTING LAYER CONTROLLERS NEXT	*/
	@ApiTags('Scorms')
	@Get('package/:scname/:layer1/:filename')
	async zipFilesTestRedirect_Layer1(
		@Res({ passthrough: true }) res, // not @Response as streaming files --> headers error appears using @Response at edge cases
		@Param('scname', StringValidationPipe) scname: string,
		@Param('layer1', StringValidationPipe) layer1: string,
		@Param('filename', StringValidationPipe) filename: string,
		@Query('category') category?: string,
	) {
		return res.redirect(
			`${getCurrentDomain()}/scorms/package/${scname}/${filename}?add-path=${layer1}${
				category ? `&category=${category}` : ''
			}`,
		);
	}

	@ApiTags('Scorms')
	@Get('package/:scname/:layer1/:layer2/:filename')
	async zipFilesTestRedirect_Layer2(
		@Res({ passthrough: true }) res,
		@Param('scname', StringValidationPipe) scname: string,
		@Param('layer1', StringValidationPipe) layer1: string,
		@Param('layer2', StringValidationPipe) layer2: string,
		@Param('filename', StringValidationPipe) filename: string,
		@Query('category') category?: string,
	) {
		return res.redirect(
			`${getCurrentDomain()}/scorms/package/${scname}/${filename}?add-path=${layer1}/${layer2}${
				category ? `&category=${category}` : ''
			}`,
		);
	}

	@ApiTags('Scorms')
	@Get('package/:scname/:layer1/:layer2/:layer3/:filename')
	async zipFilesTestRedirect_Layer3(
		@Res({ passthrough: true }) res,
		@Param('scname', StringValidationPipe) scname: string,
		@Param('layer1', StringValidationPipe) layer1: string,
		@Param('layer2', StringValidationPipe) layer2: string,
		@Param('layer3', StringValidationPipe) layer3: string,
		@Param('filename', StringValidationPipe) filename: string,
		@Query('category') category?: string,
	) {
		return res.redirect(
			`${getCurrentDomain()}/scorms/package/${scname}/${filename}?add-path=${layer1}/${layer2}/${layer3}${
				category ? `&category=${category}` : ''
			}`,
		);
	}

	@ApiTags('Scorms')
	@Get('package/:scname/:layer1/:layer2/:layer3/:layer4/:filename')
	async zipFilesTestRedirect_Layer4(
		@Res({ passthrough: true }) res,
		@Param('scname', StringValidationPipe) scname: string,
		@Param('layer1', StringValidationPipe) layer1: string,
		@Param('layer2', StringValidationPipe) layer2: string,
		@Param('layer3', StringValidationPipe) layer3: string,
		@Param('layer4', StringValidationPipe) layer4: string,
		@Param('filename', StringValidationPipe) filename: string,
		@Query('category') category?: string,
	) {
		return res.redirect(
			`${getCurrentDomain()}/scorms/package/${scname}/${filename}?add-path=${layer1}/${layer2}/${layer3}/${layer4}${
				category ? `&category=${category}` : ''
			}`,
		);
	}

	@ApiTags('Scorms')
	@Get('package/:scname/:layer1/:layer2/:layer3/:layer4/:layer5/:filename')
	async zipFilesTestRedirect_Layer5(
		@Res({ passthrough: true }) res,
		@Param('scname', StringValidationPipe) scname: string,
		@Param('layer1', StringValidationPipe) layer1: string,
		@Param('layer2', StringValidationPipe) layer2: string,
		@Param('layer3', StringValidationPipe) layer3: string,
		@Param('layer4', StringValidationPipe) layer4: string,
		@Param('layer5', StringValidationPipe) layer5: string,
		@Param('filename', StringValidationPipe) filename: string,
		@Query('category') category?: string,
	) {
		return res.redirect(
			`${getCurrentDomain()}/scorms/package/${scname}/${filename}?add-path=${layer1}/${layer2}/${layer3}/${layer4}/${layer5}${
				category ? `&category=${category}` : ''
			}`,
		);
	}
	/*	END OF SCORM REDIRECTING LAYER CONTROLLERS	*/
}
