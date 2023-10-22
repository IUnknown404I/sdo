import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { NotValidDataError } from '../errors/NotValidDataError';

const usernameRegex = /^[a-zA-Z]+([a-zA-Z0-9]+)*$/i;

@Injectable()
export class UsernameValidationPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		if (typeof value !== 'string') throw new NotValidDataError();
		else if (value.trim().length < 5) throw new NotValidDataError('Минимальная длина логина 5 символов!');
		else if (value.trim().length > 64) throw new NotValidDataError('Превышена максимальная длина логина!');
		else if (value.trim().match(usernameRegex).length === 0)
			throw new NotValidDataError(
				'Логин должен содержать латиницу или числа и начинаться с буквы! (пример: user1sub)!',
			);
		else return value;
	}
}
