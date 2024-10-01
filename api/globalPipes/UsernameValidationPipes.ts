import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { NotValidDataError } from '../errors/NotValidDataError';

export const usernameRegex = /^[a-zA-Z]+([a-zA-Z0-9*]+)*$/i;

@Injectable()
export class UsernameValidationPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		return usernameValidation(value as string);
	}
}

/**
 * @throws NotValidDataError.
 * @param username as string.
 * @returns passed username if all checks passed (throws an error either).
 */
export function usernameValidation(username: string) {
	if (typeof username !== 'string') throw new NotValidDataError('Тип поля логина пользователя невалидный.');
	else if (username.trim().length < 5) throw new NotValidDataError('Минимальная длина логина 5 символов!');
	else if (username.trim().length > 64) throw new NotValidDataError('Превышена максимальная длина логина!');
	else if (!username.trim().match(usernameRegex) || username.trim().match(usernameRegex).length === 0)
		throw new NotValidDataError(
			'Логин должен содержать латиницу или числа, начинаться с буквы и не содержать символов! (пример: user1sub)!',
		);
	else return username;
}
