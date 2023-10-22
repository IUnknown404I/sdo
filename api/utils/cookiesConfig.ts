import { CookieOptions } from 'express';
import { isProductionMode } from './utilityFunctions';

export const cookiesConfig: CookieOptions = {
	expires: new Date(new Date().setTime(new Date().getTime() + 24 * 60 * 60 * 1000)),
	domain: isProductionMode() ? 'api.sdo.rnprog.ru' : 'localhost',
	path: '/',
	secure: isProductionMode() ? true : false,
	sameSite: 'lax',
	// maxAge: +new Date() + 24 * 60 * 60 * 1000,
	maxAge: 24 * 60 * 60 * 1000,
	httpOnly: true,
};

export const withoutSaveCookiesConfig: CookieOptions = {
	domain: isProductionMode() ? 'api.sdo.rnprog.ru' : 'localhost',
	path: '/',
	secure: isProductionMode() ? true : false,
	sameSite: 'lax',
	httpOnly: true,
};

export const expiredCookiesConfig: CookieOptions = {
	// expires: new Date(new Date().setDate(new Date().getMinutes() - 5)),
	domain: isProductionMode() ? 'api.sdo.rnprog.ru' : 'localhost',
	path: '/',
	secure: isProductionMode() ? true : false,
	sameSite: 'lax',
	maxAge: -1,
	httpOnly: true,
};
