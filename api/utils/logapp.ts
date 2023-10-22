import { isProductionMode } from './utilityFunctions';

type LoggerDataT = Array<undefined | null | void | boolean | number | string | Object>;
type LoggerGuardT = { element: any; index?: number };

/**
 * @IUnknown404I Regular logger with production mode check and type guard.
 * @returns an Object with attributes for logging data at different levels.
 */
export default {
	info: (...data: LoggerDataT): false | void => abilityToLogCheck() && console.info(...data),
	debug: (...data: LoggerDataT): false | void => abilityToLogCheck() && console.debug(...data),
	warn: (...data: LoggerDataT): false | void => abilityToLogCheck() && console.warn(...data),
	error: (...data: LoggerDataT): false | void => abilityToLogCheck() && console.error(...data),
	log: (...data: LoggerDataT): false | void => abilityToLogCheck() && console.log(...data),
};

function abilityToLogCheck(...data: LoggerDataT): boolean {
	if (isProductionMode()) return false;
	let flag: boolean = true;
	data.slice().forEach((element, index) => !loggerGuard({ element, index }) && (flag = false));
	return flag;
}

function throwLoggerError({ element, index }: LoggerGuardT): TypeError {
	throw new TypeError(`Invalid type for one of element ${element} ${index ? `at index ${index}` : ''}!`);
}

function loggerGuard({ element, index }: LoggerGuardT): boolean {
	if (
		element === undefined ||
		element === null ||
		(typeof element !== 'string' &&
			typeof element !== 'object' &&
			typeof element !== 'boolean' &&
			typeof element !== 'number')
	)
		throwLoggerError({ element, index });
	return true;
}
