import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { NotValidDataError } from '../errors/NotValidDataError';

export const emailRegex =
	/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

@Injectable()
export class EmailValidationPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		return emailValidation(value as string);
	}
}

/**
 * @throws NotValidDataError.
 * @param email as string.
 * @returns passed email if all checks passed (throws an error either).
 */
export function emailValidation(email: string) {
	if (typeof email !== 'string') throw new NotValidDataError('Тип поля электронной почты невалидный.');
	else if (email.trim().length < 6) throw new NotValidDataError('Минимальная длина электронной почты 6 символов!');
	else if (email.trim().length > 64) throw new NotValidDataError('Превышена максимальная длина электронной почты!');
	else if (email.trim().match(emailRegex).length === 0)
		throw new NotValidDataError('Переданная электронная почта некорректна!');
	else return email;
}
