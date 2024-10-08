import * as yup from 'yup';

export const EMPTY_STRING_REGEX = /$/;
export const USERNAME_REGEX = /^[a-zA-Z]+([a-zA-Z0-9]+)*$/i;
export const PHONE_REGEX =
	/^[+0-9]((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export const PASSWORD_REGEX = /^.(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$*%&/^? "]).*$/i;

export const YUP_SCHEMA_HELPERS = {
	USERNAME: yup
		.string()
		.trim()
		.matches(USERNAME_REGEX, 'Должен содержать латиницу или числа и начинаться с буквы! (пример: user1sub).')
		.min(5, 'Минимальная длина логина 5 символов!')
		.max(64, 'Достигнута максимальная длина.')
		.required('Необходимо ввести имя пользователя!'),
	PASSWORD: yup
		.string()
		.matches(
			PASSWORD_REGEX,
			'Пароль должен содержать латинские заглавные и строчные буквы, цифры и спец. символы (*^%&/$#!?)!',
		)
		.min(12, 'Минимальная длина пароля 12 символов!')
		.max(64, 'Достигнута максимальная длина.')
		.required('Необходимо ввести пароль!'),
	EMAIL: yup
		.string()
		.email('Некорректно введена электронная почта!')
		.min(6, 'Минимальная длина электронной почты 6 символов!')
		.max(64, 'Достигнута максимальная длина.')
		.required('Необходимо ввести электронную почту!'),
	TEL: yup
		.string()
		.test('Phone regex check with empty string enabled', 'Номер телефона введен некорректно!', function (tel) {
			return !tel ? EMPTY_STRING_REGEX.test(tel as string) : PHONE_REGEX.test(tel as string);
		})
		// .matches(PHONE_REGEX, 'Номер телефона введен некорректно!')
		// .min(10, 'Минимальная длина телефона 10 символов!')
		.max(12, 'Достигнута максимальная длина.'),
	SURNAME: yup.string().max(128, 'Достигнута максимальная длина.'),
	NAME: yup.string().max(128, 'Достигнута максимальная длина.'),
	COMPANY: yup
		.string()
		// .min(2, 'Минимальная длина названия организации 2 символа!')
		.max(128, 'Достигнута максимальная длина.'),
	CITY: yup
		.string()
		// .min(2, 'Минимальная длина названия города 2 символа!')
		.max(128, 'Достигнута максимальная длина.'),
	COUNTRY: yup
		.string()
		// .min(2, 'Минимальная длина названия страны 2 символа!')
		.max(128, 'Достигнута максимальная длина.'),
	POSITION: yup
		.string()
		// .min(3, 'Минимальная длина названия должности 3 символа!')
		.max(128, 'Достигнута максимальная длина.'),
} as const;
