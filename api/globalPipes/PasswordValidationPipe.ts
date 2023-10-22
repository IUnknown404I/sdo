import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { NotValidDataError } from '../errors/NotValidDataError';

const passwordRegex = /^.(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$*%&/^? "]).*$/i;

@Injectable()
export class PasswordValidationPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		if (typeof value !== 'string') throw new NotValidDataError();
		else if (value.trim().length < 12) throw new NotValidDataError('Минимальная длина пароля 12 символов!');
		else if (value.trim().length > 64) throw new NotValidDataError('Превышена максимальная длина пароля!');
		else if (value.trim().match(passwordRegex).length === 0)
			throw new NotValidDataError(
				'Пароль должен содержать латинские заглавные и строчные буквы, цифры и спец. символы (*^%&/$#!?)!',
			);
		else return value;
	}
}
