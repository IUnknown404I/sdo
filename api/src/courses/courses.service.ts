import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotValidDataError } from 'errors/NotValidDataError';
import { existsSync, lstatSync, mkdir, mkdirSync, unlink } from 'fs';
import { Model } from 'mongoose';
import { isProductionMode } from 'utils/utilityFunctions';
import { Course, CoursesDocument } from './courses.schema';
import StreamZip = require('node-stream-zip');

const SCROM_MIME = {
	txt: 'text/plain',
	gif: 'image/gif',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	png: 'image/png',
	svg: 'image/svg+xml',
	css: 'text/css',
	csv: 'text/csv',
	html: 'text/html',
	woff: 'font/woff',
	woff2: 'font/woff2',
	xml: 'text/xml',
	mp4: 'video/mp4',
	mpeg: 'video/mpeg',
	webm: 'video/webm',
	js: 'application/javascript',
	stream: 'application/octet-stream',
	pdf: 'application/pdf',
	wav: 'audio/x-wav',
	json: 'application/json',
	zip: 'application/zip',
} as const;
const SCROM_DIR_PATH = 'public/scorm/packages/' as const;

@Injectable()
export class CoursesService {
	constructor(@InjectModel(Course.name, 'onyxDB') private coursesModel: Model<CoursesDocument>) {}

	/**
	 * @IUnknown404I Represents all logic for the finding, extracting, parsing and send valid response with scorm-course data.
	 * @param props: as Object
	 * - scname: name of the package,
	 * - filename: requested filename with the extension,
	 * - isSpringMode: flag for the spring courses requests,
	 * - additionalPath: query for the addition layers (nested directories),
	 * @returns the Error Object or the Object with the results.
	 */
	async scormSearchFile(props: {
		scname: string;
		filename: string;
		additionalPath?: string;
	}): Promise<{ error: true; message?: string } | { pathToFile: string; resOptions: { [key: string]: string } }> {
		// check for the extension requested
		if (!props.filename.includes('.')) return { error: true, message: 'Не указано расширение!' };

		const requestedExtension = props.filename.slice(props.filename.lastIndexOf('.') + 1).toLowerCase();

		const responseFilePath =
			SCROM_DIR_PATH + // base_path
			props.scname + // package_name
			(!!props.additionalPath // insert extra-layers if passed
				? `${props.additionalPath.startsWith('/') ? '' : '/'}${props.additionalPath}${
						props.additionalPath.endsWith('/') ? '' : '/'
				  }`
				: '/') +
			props.filename; // requested filename with extension
		const responseISpringFilePath =
			SCROM_DIR_PATH + // base_path
			props.scname + // package_name
			'/res' + // ISpring check --> additional level add
			(!!props.additionalPath // insert extra-layers if passed
				? `${props.additionalPath.startsWith('/') ? '' : '/'}${props.additionalPath}${
						props.additionalPath.endsWith('/') ? '' : '/'
				  }`
				: '/') +
			props.filename; // requested filename with extension

		// check for extracted directory existance
		if (
			existsSync(SCROM_DIR_PATH + props.scname + '/') &&
			lstatSync(SCROM_DIR_PATH + props.scname + '/').isDirectory()
		) {
			// check for requested file existance
			if (existsSync(responseFilePath))
				return { pathToFile: responseFilePath, resOptions: getResponseContentTypeOptions() };
			// check for ISpring folders structure
			else if (existsSync(responseISpringFilePath))
				return { pathToFile: responseISpringFilePath, resOptions: getResponseContentTypeOptions() };

			// if there is no requested file in the package throw error
			return { error: true, message: 'Запрошенный файл пакета не найден!' };
		}

		// check for the package existance
		else if (existsSync(SCROM_DIR_PATH + props.scname + '.zip')) {
			// extract the package
			await this.extractAllFilesFromArchive(SCROM_DIR_PATH + props.scname + '.zip');

			// check for the requested file has been extracted
			if (existsSync(responseFilePath))
				return { pathToFile: responseFilePath, resOptions: getResponseContentTypeOptions() };
			// check for ISpring folders structure
			else if (existsSync(responseISpringFilePath))
				return { pathToFile: responseISpringFilePath, resOptions: getResponseContentTypeOptions() };
			else return { error: true, message: 'Запрошенный файл пакета не найден!' };
		}

		// if there is no direction and no package
		else return { error: true, message: 'Запрошенного пакета не существует!' };

		function getResponseContentTypeOptions() {
			return {
				'Content-Type': SCROM_MIME[requestedExtension],
				'Cache-Control': 'private, no-cache, must-revalidate',
			};
		}
	}

	/**
	 * @IUnknown404I Extract all files and directories to the new directory on the same level as passed file.
	 * @param pathToArchive string path to the archive;
	 * @param createExtractionFolder boolean flag: should be created extraction folder for the inner content or not;
	 * @default createExtractionFolder = undefined --> algorithm will check for existance of the root directory inside.
	 */
	async extractAllFilesFromArchive(pathToArchive: string, createExtractionFolder?: boolean): Promise<void> {
		if (!pathToArchive || !existsSync(pathToArchive)) throw new NotValidDataError('Путь к архиву указан неверно!');
		const archiveName = pathToArchive.slice(pathToArchive.lastIndexOf('/') + 1); // with extension
		let createdExtractionFolderFlag = false;

		try {
			const zip = new StreamZip.async({ file: pathToArchive, storeEntries: true });

			// new extraction directory creation (if requested)
			if (createExtractionFolder === true) {
				await this.createDir(
					pathToArchive.slice(0, pathToArchive.lastIndexOf('/') + 1) +
						archiveName.slice(0, archiveName.indexOf('.')),
				);
				createdExtractionFolderFlag = true;
			} else if (createExtractionFolder === undefined) {
				// check for the root directory existance inside passed archive
				let foundFlag = false;
				for (const entry of Object.values(await zip.entries())) {
					// check only first layer
					if (!!entry.name.split('/')[1]) break;
					
					// check for the right (equal) naming rules
					if (
						entry.name.replace('/', '') === archiveName.slice(0, archiveName.indexOf('.')) &&
						entry.isDirectory
					)
						foundFlag = true;
				}

				// create the directory for the archived files if nested root directory doesnt exist
				if (!foundFlag) {
					await this.createDir(
						pathToArchive.slice(0, pathToArchive.lastIndexOf('/') + 1) +
							archiveName.slice(0, archiveName.indexOf('.')),
					);
					createdExtractionFolderFlag = true;
				}
			}

			// extracting files
			const extractedFilesCount = await zip.extract(
				null,
				createdExtractionFolderFlag
					? pathToArchive.slice(0, pathToArchive.lastIndexOf('/') + 1) +
							archiveName.slice(0, archiveName.indexOf('.'))
					: pathToArchive.slice(0, pathToArchive.lastIndexOf('/')),
			);
			await zip.close();

			// delete the extracted archive
			unlink(pathToArchive, err => {
				if (err) throw err;
			});
		} catch (e) {
			throw new NotValidDataError('Не удалось обработать запрошенный ресурс!');
		}
	}

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

	async getCoursesList() {
		return await this.coursesModel.find(
			{ $or: [{ status: true }, { status: undefined }] },
			{ _id: 0, cid: 1, icon: 1, main: 1 },
		);
	}

	async getCourseData(cid: string): Promise<Course> {
		if (!cid) throw new NotValidDataError();
		return await this.coursesModel.findOne({ cid }, { _id: 0 });
	}

	async createDir(dirPath: string, async?: boolean, wait?: boolean): Promise<void> {
		if (
			!dirPath ||
			!(
				existsSync(dirPath.slice(0, dirPath.lastIndexOf('/'))) &&
				lstatSync(dirPath.slice(0, dirPath.lastIndexOf('/'))).isDirectory()
			)
		)
			throw new NotValidDataError('Не указан путь создания!');

		if (!!async) {
			if (!!wait) await mkdir(dirPath, {}, err => err);
			else mkdir(dirPath, {}, err => err);
		} else mkdirSync(dirPath);
	}
}
