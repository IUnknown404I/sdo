import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotValidDataError } from 'errors/NotValidDataError';
import { existsSync, lstatSync, mkdir, mkdirSync, readdirSync, unlink } from 'fs';
import { Model } from 'mongoose';
import { FilesReadType, getResponseContentTypeOptions } from 'utils/mimeTypes';
import { Scorm, ScormsDocument } from './scorms.schema';
import StreamZip = require('node-stream-zip');

const SCORMS_DIRECTORY = 'public/scorms/' as const;

@Injectable()
export class ScormsService {
	constructor(@InjectModel(Scorm.name, 'onyxDB') private scormsModel: Model<ScormsDocument>) {}

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
		category?: string;
		additionalPath?: string;
	}): Promise<{ error: true; message?: string } | { pathToFile: string; resOptions: { [key: string]: string } }> {
		// check for the extension requested
		if (!props.filename.includes('.')) return { error: true, message: 'Не указано расширение!' };
		const packageCategory = props.category || (await this.findPackageBySCName(props.scname)).category;

		const requestedExtension = props.filename
			.slice(props.filename.lastIndexOf('.') + 1)
			.toLowerCase() as Parameters<typeof getResponseContentTypeOptions>[0];

		const pathToPackage =
			SCORMS_DIRECTORY + (packageCategory ? `${packageCategory}/packages/` : 'packages/') + props.scname;
		const responseFilePath = this.getResponseFilepath({ ...props, category: packageCategory });
		const responseISpringFilePath = this.getResponseFilepath({
			...props,
			category: packageCategory,
			iSpringPath: true,
		});

		// check for extracted directory existance
		if (existsSync(pathToPackage + '/') && lstatSync(pathToPackage + '/').isDirectory()) {
			// check for requested file existance
			if (existsSync(responseFilePath))
				return { pathToFile: responseFilePath, resOptions: getResponseContentTypeOptions(requestedExtension) };
			// check for ISpring folders structure
			else if (existsSync(responseISpringFilePath))
				return {
					pathToFile: responseISpringFilePath,
					resOptions: getResponseContentTypeOptions(requestedExtension),
				};

			// if there is no requested file in the package throw error
			return { error: true, message: 'Запрошенный файл пакета не найден!' };
		}

		// check for the package existance
		else if (existsSync(pathToPackage + '.zip')) {
			// extract the package
			await this.extractAllFilesFromArchive(pathToPackage + '.zip');

			// check for the requested file has been extracted
			if (existsSync(responseFilePath))
				return { pathToFile: responseFilePath, resOptions: getResponseContentTypeOptions(requestedExtension) };
			// check for ISpring folders structure
			else if (existsSync(responseISpringFilePath))
				return {
					pathToFile: responseISpringFilePath,
					resOptions: getResponseContentTypeOptions(requestedExtension),
				};
			else return { error: true, message: 'Запрошенный файл пакета не найден!' };
		}

		// if there is no direction and no package
		else return { error: true, message: 'Запрошенного пакета не существует!' };
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

	async getScormStructure(category?: string): Promise<Array<FilesReadType | (FilesReadType & Scorm)>> {
		const initialPath = !category || category === '/' ? SCORMS_DIRECTORY : SCORMS_DIRECTORY + `${category}/`;
		if (!existsSync(initialPath)) throw new NotValidDataError('Запрашиваемого пути не существует!');

		const filesFromPath: FilesReadType[] = readdirSync(initialPath, { withFileTypes: true }).map(file => ({
			filename: file.name,
			filepath: file.path,
			filetype: file.isDirectory ? 'dir' : 'file',
		}));

		const allFilesData = filesFromPath.reduce((accum, current) => {
			if (current.filename === 'packages')
				return accum.concat(
					readdirSync(current.filepath + current.filename, { withFileTypes: true }).map(file => ({
						filename: file.name,
						filepath: file.path,
						filetype: 'scorm',
					})),
				);
			else return accum.concat([current]);
		}, [] as FilesReadType[]);
		return await this.accumulateScormDataAndFileReadData(allFilesData);
	}

	async accumulateScormDataAndFileReadData(
		filesReadData: FilesReadType[],
	): Promise<Array<FilesReadType | (FilesReadType & Scorm)>> {
		let data: Array<FilesReadType | (FilesReadType & Scorm)> = [];
		for (const file of filesReadData) {
			if (file.filetype === 'dir') {
				data.push(file);
			} else {
				const scormData = await this.scormsModel.findOne({ scname: file.filename }, { _id: 0 });
				data.push({ ...file, ...scormData['_doc'] });
			}
		}
		return data;
	}

	async findPackageBySCName(scname: string): Promise<Scorm> {
		if (!scname) throw new NotValidDataError('Не указано имя запрашиваемого пакета!');
		return await this.scormsModel.findOne({ scname }, { _id: 0 });
	}

	async findPackageBySCID(scid: string): Promise<Scorm> {
		if (!scid) throw new NotValidDataError('Не указан ключ запрашиваемого пакета!');
		return await this.scormsModel.findOne({ scid }, { _id: 0 });
	}

	async getPackagePathBySCID(scid: string): Promise<string> {
		const path = '';
		if (!scid) throw new NotValidDataError('Не указан ключ запрашиваемого пакета!');

		const packageData = await this.scormsModel.findOne({ scid: scid }, { _id: 0 });
		if (packageData.category && packageData.category !== '/') path.concat(packageData.category);

		path.concat(`/${packageData.scname}/${packageData.type === 'ispring' ? 'res/index.html' : 'story.html'}`);
		return path;
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

	getResponseFilepath = (props: Parameters<typeof this.scormSearchFile>[0] & { iSpringPath?: boolean }) =>
		SCORMS_DIRECTORY + // base_path
		(!!props.category ? `${props.category}` : '') + // category_path
		'/packages/' + // default directory in each category
		props.scname + // package_name
		(props.iSpringPath ? '/res' : '') + // ISpring check --> additional level add
		(!!props.additionalPath // insert extra-layers if passed
			? `${props.additionalPath.startsWith('/') ? '' : '/'}${props.additionalPath}${
					props.additionalPath.endsWith('/') ? '' : '/'
			  }`
			: '/') +
		props.filename; // requested filename with extension

	async getAllScorms(): Promise<Scorm[]> {
		return await this.scormsModel.find({}, { _id: 0 });
	}
}

