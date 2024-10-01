import { Controller, Get, Param, Query, Res, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotValidDataError } from 'errors/NotValidDataError';
import { createReadStream } from 'fs';
import { StringValidationPipe } from 'globalPipes/StringValidationPipe';
import { AccessLevel } from 'metadata/metadata-decorators';
import { checkCategorySyntaxisViolation } from 'utils/parseCategoryLayers';
import { getCurrentDomain } from 'utils/utilityFunctions';
import { DocumentTypes } from './documents.schema';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
	constructor(private documentsService: DocumentsService) {}

	@AccessLevel(2)
	@Get('all')
	@ApiTags('Documents')
	async getAllDocs() {
		return this.documentsService.getAllDocs();
	}

	@AccessLevel(2)
	@Get('structure')
	@ApiTags('Documents')
	async getDocsStructure(@Query('category') category?: string) {
		if (checkCategorySyntaxisViolation(category))
			throw new NotValidDataError('Обнаружены запрещённые синтаксические конструкции!');

		let parsedCategory = category;
		if (!!parsedCategory) {
			if (parsedCategory.startsWith('/')) parsedCategory = parsedCategory.slice(1);
			if (parsedCategory.endsWith('/')) parsedCategory = parsedCategory.slice(0, parsedCategory.length - 1);
		}
		return this.documentsService.getDocsStructure(category);
	}

	@Get('file/:docname')
	@ApiTags('Documents')
	async getDocFile(
		@Res({ passthrough: true }) res,
		@Param('docname', StringValidationPipe) docname: string,
		@Query('category') category?: string,
	) {
		return this.documentsService
			.getDocFileByDocname(docname, category)
			.then(searchResult => {
				if ('error' in searchResult) return new NotValidDataError(searchResult.message);
				res.set(searchResult.resOptions);
				return new StreamableFile(createReadStream(searchResult.pathToFile));
			})
			.catch(() => new NotValidDataError('Не удалось получить запрашиваемый ресурс!'));
	}

	@Get(':docid')
	@ApiTags('Documents')
	async getDocFileByID(@Res() res, @Param('docid', StringValidationPipe) docid: string) {
		const docData = await this.documentsService.getDocByDocID(docid);
		res.redirect(
			`${getCurrentDomain()}/documents/file/${docData.docname}${
				docData.category && docData.category !== '/' ? `?category=${docData.category}` : ''
			}`,
		);
	}

	@Get(':docid/info')
	@ApiTags('Documents')
	async getExactDocInfo(@Param('docid', StringValidationPipe) docid: string) {
		return this.documentsService.getDocByDocID(docid);
	}

	@Get(':docid/echo')
	@ApiTags('Documents')
	async echoDocumentFile(
		@Res({ passthrough: true }) res,
		@Param('docid', StringValidationPipe) docid: string,
	): Promise<DocumentTypes> {
		const docData = await this.documentsService.getDocByDocID(docid);
		if (!docData) throw new NotValidDataError('Запрашиваемый файл не существует!');

		const searchResult = await this.documentsService.getDocFileByDocname(docData.docname, docData.category);
		if ('error' in searchResult) throw new NotValidDataError(searchResult.message);
		return docData.type;
	}
}
