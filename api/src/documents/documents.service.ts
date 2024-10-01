import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotValidDataError } from 'errors/NotValidDataError';
import { existsSync, lstatSync, readdirSync } from 'fs';
import { Model } from 'mongoose';
import { FilesReadType, getResponseContentTypeOptions } from 'utils/mimeTypes';
import { Document, DocumentsDocument } from './documents.schema';

const DOCUMENTS_DIRECTORY = 'public/documents/' as const;

@Injectable()
export class DocumentsService {
	constructor(@InjectModel(Document.name, 'onyxDB') private docsModel: Model<DocumentsDocument>) {}

	async getAllDocs(forcePrivate?: boolean) {
		return this.docsModel.find(!!forcePrivate ? {} : { $or: [{ status: undefined }, { status: true }] }, {
			_id: 0,
		});
	}

	async getDocByDocID(docid: string, forcePrivate?: boolean) {
		return this.docsModel.findOne(
			!!forcePrivate
				? {}
				: {
						$or: [
							{ status: undefined, docid },
							{ status: true, docid },
						],
				  },
			{
				_id: 0,
			},
		);
	}

	async getDocByDocname(docname: string, forcePrivate?: boolean) {
		return this.docsModel.findOne(
			!!forcePrivate
				? {}
				: {
						$or: [
							{ status: undefined, docname },
							{ status: true, docname },
						],
				  },
			{
				_id: 0,
			},
		);
	}

	async getDocsStructure(category?: string) {
		const initialPath = !category || category === '/' ? DOCUMENTS_DIRECTORY : DOCUMENTS_DIRECTORY + `${category}/`;
		if (!existsSync(initialPath)) throw new NotValidDataError('Запрашиваемого пути не существует!');

		const filesFromPath: FilesReadType[] = readdirSync(initialPath, { withFileTypes: true }).map(file => ({
			filename: file.name,
			filepath: file.path,
			filetype: lstatSync(file.path.concat('/' + file.name)).isDirectory() ? 'dir' : 'file',
		}));
		return this.accumulateDocumentDataAndFileReadData(filesFromPath);
	}

	async accumulateDocumentDataAndFileReadData(
		filesReadData: FilesReadType[],
	): Promise<Array<FilesReadType | (FilesReadType & Document)>> {
		let data: Array<FilesReadType | (FilesReadType & Document)> = [];
		for (const file of filesReadData) {
			if (file.filetype === 'dir') {
				data.push(file);
			} else {
				const docData = await this.docsModel.findOne({ docname: file.filename }, { _id: 0 });
				if (!docData) throw new NotValidDataError('Произошла ошибка в процессе получения информации!');
				data.push({ ...file, ...docData['_doc'] });
			}
		}
		return data;
	}

	async getDocFileByDocname(
		docname: string,
		category?: string,
	): Promise<{ error: true; message?: string } | { pathToFile: string; resOptions: { [key: string]: string } }> {
		// check for the extension requested
		if (!docname.includes('.')) return { error: true, message: 'Не указано расширение!' };
		const docData = await this.getDocByDocname(docname);
		if (!docData) return { error: true, message: 'Невозможно получить запрошенный документ!' };
		const docCategory = category || docData.category;

		const requestedExtension = docname.slice(docname.lastIndexOf('.') + 1).toLowerCase() as Parameters<
			typeof getResponseContentTypeOptions
		>[0];
		const responseFilePath =
			!docCategory || docCategory === '/'
				? DOCUMENTS_DIRECTORY
				: DOCUMENTS_DIRECTORY +
				  `${docCategory.startsWith('/') ? docCategory.slice(1) : docCategory}` +
				  `${docCategory.endsWith('/') ? '' : '/'}` +
				  docname;

		// check for existance
		if (!existsSync(responseFilePath)) return { error: true, message: 'Не удалось найти документ!' };
		// return path and header options
		return {
			pathToFile: responseFilePath,
			resOptions: getResponseContentTypeOptions(requestedExtension),
		};
	}
}
