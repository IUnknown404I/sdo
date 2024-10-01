import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { NotValidDataError } from '../errors/NotValidDataError';

@Injectable()
export class StringOrUndefinedValidationPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		if (typeof value !== 'string' && value !== undefined)
			throw new NotValidDataError(`Переданный атрибут ${metadata.data} невалиден.`);
		return value;
	}
}
