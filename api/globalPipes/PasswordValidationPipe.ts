import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { NotValidDataError } from '../errors/NotValidDataError';

export const passwordRegex = /^.(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$*%&/^? "]).*$/i;

@Injectable()
export class PasswordValidationPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		return passwordValidation(value as string);
	}
}

/**
 * @throws NotValidDataError.
 * @param password as string.
 * @returns passed password if all checks passed (throws an error either).
 */
export function passwordValidation(password: string): string {
	if (!password) throw new NotValidDataError();
	if (typeof password !== 'string') throw new NotValidDataError('Тип переданного атрибуда пароля невалидный.');
	else if (password.trim().length < 12) throw new NotValidDataError('Минимальная длина пароля 12 символов!');
	else if (password.trim().length > 64) throw new NotValidDataError('Превышена максимальная длина пароля!');
	else if (password.trim().match(passwordRegex).length === 0)
		throw new NotValidDataError(
			'Пароль должен содержать латинские заглавные и строчные буквы, цифры и спец. символы (*^%&/$#!?)!',
		);
	else return password;
}
