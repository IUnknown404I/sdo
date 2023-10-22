import {
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	Request,
	Response,
	StreamableFile,
	UnauthorizedException,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { NotValidDataError } from 'errors/NotValidDataError';
import * as fs from 'fs';
import { createReadStream, existsSync } from 'fs';
import { AccessTokenGuard } from 'guards/AccessTokenGuard';
import { Error } from 'mongoose';
import { diskStorage } from 'multer';
import { AccessTokenPayload } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { getCurrentDomain } from 'utils/utilityFunctions';
import { FilesService } from './files.service';

const PATHS_ALLOWED: string[] = ['defaults'];

const MIME = {
	html: 'text/html',
	txt: 'text/plain',
	gif: 'image/gif',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	webp: 'image/webp',
	png: 'image/png',
	svg: 'image/svg+xml',
	webm: 'video/webm',
	mp4: 'video/mp4',
	m4v: 'video/x-m4v',
};

function fileValidation(file: Express.Multer.File): boolean {
	const ALLOWED_TYPES: string[] = [
		'image/svg+xml',
		'image/webp',
		'image/jpeg',
		'image/png',
		'video/webm',
		'application/pdf',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	];
	return ALLOWED_TYPES.includes(file.mimetype);
}

@Controller('files')
export class FilesController {
	constructor(
		private readonly fileService: FilesService,
		private readonly usersService: UsersService,
	) {}

	// @Privileges('superuser admin study')
	@UseGuards(AccessTokenGuard)
	@Post('')
	@ApiTags('Files')
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: { type: 'string', format: 'binary' },
			},
		},
	})
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter(req: any, file: any, cb: any) {
				cb(null, fileValidation(file));
			},
			storage: diskStorage({
				destination: (req, file, cb: any) => {
					const uploadPath = 'public/' + req.url.split('?path=')[1];
					if (!existsSync(uploadPath)) throw new NotValidDataError();
					cb(null, uploadPath);
				},
				filename(req, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
					const filename = file.originalname.slice(0, file.originalname.lastIndexOf('.'));
					const fileExt = file.originalname.slice(file.originalname.lastIndexOf('.') + 1);
					const fileRandomName = Array(32)
						.fill(null)
						.map(() => Math.round(Math.random() * 32).toString(32))
						.join('');
					callback(null, `${filename}-${fileRandomName}.${fileExt}`);
				},
			}),
			limits: { fileSize: 10 * 1024 * 1024 },
		}),
	)
	async uploadFile(@UploadedFile() file: Express.Multer.File, @Query('path') path: string) {
		if (!file || !path || path === '') throw new NotValidDataError('Переданы пустые параметры!');
		//path attribute in file-object is a final path to the uploaded file with it's hashed filename (to save in bd)
		// return await this.fileService.saveFile(file, path);
		return file.filename;
	}

	@UseGuards(AccessTokenGuard)
	@Get('')
	@ApiTags('Files')
	async getFile(@Query('path') pathString: string, @Response({ passthrough: true }) res) {
		if (!pathString) throw new NotValidDataError('Переданы пустые параметры!');
		if (
			!PATHS_ALLOWED.includes(
				pathString.startsWith('/') ? pathString.slice(1).split('/')[0] : pathString.split('/')[0],
			) ||
			pathString.indexOf('..') !== -1
		)
			throw new NotValidDataError('Недостаточно прав доступа для получения контента!');

		if (
			existsSync('public/' + (pathString.startsWith('/') ? pathString.slice(1) : pathString)) &&
			!fs.lstatSync('public/' + (pathString.startsWith('/') ? pathString.slice(1) : pathString)).isDirectory()
		) {
			res.set({
				'Content-Type': MIME[pathString.slice(pathString.lastIndexOf('.') + 1)],
			});

			return new StreamableFile(
				createReadStream('public/' + (pathString.startsWith('/') ? pathString.slice(1) : pathString)),
			);
		} else {
			throw new NotValidDataError('Такого файла не существует!');
		}
	}

	// @Privileges('superuser admin study')
	@UseGuards(AccessTokenGuard)
	@Get('all')
	@ApiTags('Files')
	async getAllFilesInDirectory(@Query('path') path: string, @Query('extended') extended?: boolean) {
		if (!path) throw new NotValidDataError('Переданы пустые параметры!');
		const inputPath = path.startsWith('/') ? path.slice(1) : path;
		if (
			!PATHS_ALLOWED.includes(inputPath.includes('/') ? inputPath.split('/')[0] : inputPath) ||
			path.indexOf('..') !== -1
		)
			throw new NotValidDataError('Недостаточно прав доступа для получения контента!');

		const validPath: string = 'public/' + (path.startsWith('/') ? path.slice(1) : path);
		if (existsSync(validPath) && fs.lstatSync(validPath).isDirectory()) {
			const paths = fs.readdirSync(validPath).map(el => validPath.split('public/')[1] + '/' + el);
			const filteredPaths: string[] & Array<{ url: string; size: number }> = [];
			paths.forEach(path => {
				if (!fs.lstatSync(`public/${path}`).isDirectory())
					extended
						? filteredPaths.push({ url: path, size: fs.lstatSync(`public/${path}`).size })
						: filteredPaths.push(path);
			});
			return extended ? (filteredPaths as { url: string; size: number }[]) : (filteredPaths as string[]);
		} else {
			throw new NotValidDataError('Указан неверный путь!');
		}
	}

	// @Privileges('superuser admin')
	@UseGuards(AccessTokenGuard)
	@Delete('')
	@ApiTags('Files')
	async deleteFile(@Query('path') path: string) {
		if (!path) throw new NotValidDataError();
		const inputPath = path.startsWith('/') ? path.slice(1) : path;
		if (
			!PATHS_ALLOWED.includes(inputPath.includes('/') ? inputPath.split('/')[0] : inputPath) ||
			path.indexOf('..') !== -1
		)
			throw new UnauthorizedException('Недостаточно прав доступа для выполнения команды!');

		const validPath: string = 'public/' + (path.startsWith('/') ? path.slice(1) : path);
		if (!existsSync(validPath)) throw new NotValidDataError();

		let flag: boolean = true;
		fs.unlink(validPath, err => {
			flag = false;
			console.log(err);
			return err;
		});

		if (!flag) throw new NotValidDataError('Недоступно к удалению или не существует!');
		else return 'deleted';
	}

	// AVATARS// @Privileges('superuser admin study')
	@UseGuards(AccessTokenGuard)
	@Post('/users/avatars')
	@ApiTags('Files')
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: { type: 'string', format: 'binary' },
			},
		},
	})
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter(req: any, file: any, cb: any) {
				cb(null, fileValidation(file));
			},
			storage: diskStorage({
				destination: (req, file, cb: any) => {
					const uploadPath = 'public/users/avatars';
					if (!existsSync(uploadPath)) throw new NotValidDataError();
					cb(null, uploadPath);
				},
				filename(req, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
					const filename = file.originalname.slice(0, file.originalname.lastIndexOf('.'));
					const fileExt = file.originalname.slice(file.originalname.lastIndexOf('.') + 1);
					const fileRandomName = Array(32)
						.fill(null)
						.map(() => Math.round(Math.random() * 32).toString(32))
						.join('');
					callback(null, `${filename}-${fileRandomName}.${fileExt}`);
				},
			}),
			limits: { fileSize: 0.5 * 1024 * 1024 },
		}),
	)
	async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
		if (!file) throw new NotValidDataError('Не был передан файл!');
		return file.filename;
	}

	/**
	 * @IUnknown404I returns file as user's avatar according to passed username as params.
	 * @description if file extension found will parse params [:username] as filename,
	 * either will pass [:username] as username and search for the file throught db.
	 * @returns image file or Error.
	 */
	@Get('users/avatars/:username')
	@ApiTags('Files')
	async getAvatar(@Response({ passthrough: true }) res, @Request() req, @Param('username') username: string) {
		// if passed filename --> returns requested file
		if (!!username.split('.')[1]?.length) {
			const filename = username.startsWith('/') ? username.slice(1) : username;
			if (
				existsSync('public/users/avatars/' + filename) &&
				!fs.lstatSync('public/users/avatars/' + filename).isDirectory()
			) {
				res.set({
					'Content-Type': MIME[filename.slice(filename.lastIndexOf('.') + 1)],
					'Cache-Control': 'private, no-cache, must-revalidate',
				});
				return new StreamableFile(createReadStream('public/users/avatars/' + filename));
			} else {
				throw new NotValidDataError('Запрашиваемого файла не существует!');
			}
		}

		// if passed username --> search for him and return the image from db
		if (!req.headers.authorization && !username) throw new NotValidDataError('Не найдены атрибуты идентификации!');
		const requestedUsername = req.headers.authorization
			? ((await this.usersService.decodeJWT(req.headers.authorization?.split(' ')[1])) as AccessTokenPayload)
					.username
			: username;

		// path detecting
		const avatarUrl = (await this.usersService.getUserAvatar({ username: requestedUsername }))?.trim();
		if (avatarUrl == null) throw new NotValidDataError('У пользователя не установлен аватар!');
		const relativePathToAvatar =
			'public/users/avatars/' + (avatarUrl.startsWith('/') ? avatarUrl.slice(1) : avatarUrl);

		if (existsSync(relativePathToAvatar) && !fs.lstatSync(relativePathToAvatar).isDirectory()) {
			res.set({
				'Content-Type': MIME[relativePathToAvatar.slice(relativePathToAvatar.lastIndexOf('.') + 1)],
				'Cache-Control': 'private, no-cache, must-revalidate',
			});
			return new StreamableFile(createReadStream(relativePathToAvatar));
		} else {
			throw new NotValidDataError('Такого файла не существует!');
		}
	}

	/**
	 * @IUnknown404I Endpoint for uploading images as avatars for users.
	 * @description Algorithm will auto-delete old users's avatars per upload;
	 * naming-pattern based on the shape: '{username}__{random_hash}.{extension}';
	 * updates userData on uploadEnd.
	 * @param file as image (user avatar);
	 * @param req request Object for auth checks;
	 * @param username string value of the requested user's username;
	 * @returns Notification of seccessfull upload and userData update or an Error if somithing goes wrong.
	 */
	@UseGuards(AccessTokenGuard)
	@Put('users/avatars/:username')
	@ApiTags('Files')
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: { type: 'string', format: 'binary' },
			},
		},
	})
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter(req: any, file: any, cb: any) {
				cb(null, fileValidation(file));
			},
			storage: diskStorage({
				destination: (req, file, cb: any) => {
					const uploadPath = 'public/users/avatars';
					if (!existsSync(uploadPath)) throw new NotValidDataError();
					cb(null, uploadPath);
				},
				filename(req, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
					if (!req.headers.authorization && !req.params.username)
						throw new NotValidDataError('Не найдены атрибуты идентификации!');

					const fileExt = file.originalname.slice(file.originalname.lastIndexOf('.') + 1);
					const fileRandomName = Array(32)
						.fill(null)
						.map(() => Math.round(Math.random() * 32).toString(32))
						.join('');
					callback(null, `${fileRandomName}.${fileExt}`);
				},
			}),
			limits: { fileSize: 0.5 * 1024 * 1024 },
		}),
	)
	async updateUserAvatar(
		@UploadedFile() file: Express.Multer.File,
		@Request() req,
		@Param('username') username: string,
	) {
		if (!req.headers.authorization && !username) throw new NotValidDataError('Не найдены атрибуты идентификации!');
		const requestedUsername = req.headers.authorization
			? ((await this.usersService.decodeJWT(req.headers.authorization?.split(' ')[1])) as AccessTokenPayload)
					.username
			: username;
		if (requestedUsername !== username) throw new UnauthorizedException('Недостаточно прав доступа!');

		// edge case fs validation
		if (!existsSync(file.path) || fs.lstatSync(file.path).isDirectory()) throw new NotValidDataError();

		// delete previous dowloaded user's avatars
		const uploadedAvatars = fs
			.readdirSync('public/users/avatars')
			.filter(
				el =>
					!fs.lstatSync('public/users/avatars/' + el).isDirectory() &&
					el.split('__')[0] === requestedUsername,
			);
		if (uploadedAvatars.length > 0)
			for (const filename of uploadedAvatars)
				fs.unlink('public/users/avatars/' + filename, err => console.log(err));

		// rename uploaded file
		const userAvatarFilename = requestedUsername + '__' + file.filename;
		await fs.rename(file.destination + '/' + file.filename, file.destination + '/' + userAvatarFilename, err =>
			console.log(err),
		);

		// updating user's personal data
		return await this.usersService.updateUserAvatar({
			avatarUrl: userAvatarFilename,
			ident: { username: requestedUsername },
		});
	}

	@UseGuards(AccessTokenGuard)
	@Get('users/avatars/defaults/all')
	@ApiTags('Files')
	async getDefaultAvatars(@Query('extended') extended?: boolean) {
		if (existsSync('public/users/avatars/defaults')) {
			const paths = fs
				.readdirSync('public/users/avatars/defaults')
				.map(el => 'public/users/avatars/defaults/' + el);
			const filteredPaths: string[] & Array<{ url: string; size: number }> = [];
			paths.forEach(path => {
				if (!fs.lstatSync(path).isDirectory()) {
					const filteredPath =
						getCurrentDomain() + '/files/users/avatars/defaults/' + path.split('/').slice(-1)[0];
					extended
						? filteredPaths.push({ url: filteredPath, size: fs.lstatSync(path).size })
						: filteredPaths.push(filteredPath);
				}
			});
			return extended ? (filteredPaths as { url: string; size: number }[]) : (filteredPaths as string[]);
		} else {
			throw new NotValidDataError('Запрашиваемые файлы отсутствуют!');
		}
	}

	@Get('users/avatars/defaults/:filename')
	@ApiTags('Files')
	async getOneDefaultAvatar(@Param('filename') filename: string, @Response({ passthrough: true }) res) {
		if (!filename) throw new NotValidDataError('Переданы пустые параметры!');

		if (
			existsSync('public/users/avatars/defaults/' + filename) &&
			!fs.lstatSync('public/users/avatars/defaults/' + filename).isDirectory()
		) {
			res.set({
				'Content-Type': MIME[filename.slice(filename.lastIndexOf('.') + 1)],
				'Cache-Control': 'private, no-cache, must-revalidate',
			});
			return new StreamableFile(createReadStream('public/users/avatars/defaults/' + filename));
		} else {
			throw new NotValidDataError('Такого файла не существует!');
		}
	}
}
