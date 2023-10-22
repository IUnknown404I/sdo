import { ArgumentMetadata, Injectable, NestMiddleware, PipeTransform } from '@nestjs/common';
import { NextFunction } from 'express';
import { NotValidDataError } from '../errors/NotValidDataError';

@Injectable()
export class FileValidationPipe implements PipeTransform {
	constructor(
		private readonly MAX_SIZE_KB: number = 5 * 1024,
		private readonly MAX_SIZE_VIDEO_KB: number = 15 * 1024,
		private readonly ALLOWED_TYPES: string[] = [
			'image/webp',
			'video/webm',
			'application/pdf',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		],
	) {}

	transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
		if (!this.ALLOWED_TYPES.includes(value.mimetype))
			throw new NotValidDataError('Переданный тип файлов запрещён, используйте указанные форматы!');

		if (
			value.mimetype.includes('webp')
				? value.size / 1024 < this.MAX_SIZE_VIDEO_KB
				: value.size / 1024 < this.MAX_SIZE_KB
		)
			return value;
		else
			throw new NotValidDataError(
				'Размер выгружаемого файла превышает установленные ограничения! Используйте сжатие или предоставьте другой объект.',
			);
	}
}

export class FileValidationMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		// console.log(req.body)
		// console.log(res.body)
		next();
	}
}
