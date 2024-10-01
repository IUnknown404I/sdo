import { notification } from '../components/utils/notifications/Notification';

// TODO: proxing observable refactor!
// export const makeObservable = (target: Object, handler: (property: string, newValue?: any) => void) => {
// 	console.log(target);
// 	console.log(handler);
// 	const observe = Symbol('observe');
// 	const handlers = Symbol('handlers');

// 	target[handlers] = [] as ((property: string, value: any) => void)[];
// 	target[observe] = function () {
// 		this[handlers].push(handler);
// 	};

// 	return new Proxy(target, {
// 		get(target, property, receiver) {
// 			console.log('GETTING', property);
// 			if (Reflect.get(...arguments)) target[handlers].forEach(handler => handler(property));
// 			return true;
// 		},
// 		set(target, property, value, receiver) {
// 			console.log('SETTING', property);
// 			if (Reflect.set(...arguments)) target[handlers].forEach(handler => handler(property, value));
// 			return true;
// 		},
// 	});
// };

/**
 * @IUnknown404I expected type of data is stream (StreamableFile) <===> blob
 * @param data as Blob;
 * @param filenameWithoutExtension optional name without extension;
 * @param successMessageNotification optional notification message for success dowloading the data.
 */
export const dowloadRequestedExcelFile = (
	data: any,
	filenameWithoutExtension: string = 'Экспортированные данные',
	successMessageNotification: string = 'Экпорт данных выполнен успешно!',
) => {
	try {
		const href = URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms -excel' }));
		const _link = document.createElement('a');
		_link.href = href;

		_link.setAttribute('download', filenameWithoutExtension + '.xlsx');
		document.body.appendChild(_link);
		_link.click();

		document.body.removeChild(_link);
		URL.revokeObjectURL(href);

		try {
			notification({
				message: successMessageNotification,
				type: 'success',
			});
		} catch (e) {}
	} catch (err: any) {
		notification({
			message: 'Не удалось выполнить экспорт данных!',
			type: 'error',
		});
	}
};

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
	if (typeof a[orderBy] === 'boolean' && typeof b[orderBy] === 'boolean')
		return b[orderBy] && !a[orderBy] ? -1 : !b[orderBy] && a[orderBy] ? 1 : 0;
	else if (
		(typeof a[orderBy] === 'string' && typeof b[orderBy] === 'string') ||
		(typeof a[orderBy] === 'number' && typeof b[orderBy] === 'number')
	)
		return b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0;

	if (a[orderBy] !== undefined && b[orderBy] === undefined) return -1;
	else if (a[orderBy] === undefined && b[orderBy] !== undefined) return 1;
	else if (a[orderBy] === undefined && b[orderBy] === undefined) return 0;

	return 0;
}

export function getComparator<Key extends keyof any>(
	order: 'desc' | 'asc',
	orderBy: Key,
	customDescendingComparator?: typeof descendingComparator,
): (
	a: { [key in Key]: number | boolean | string | object | undefined },
	b: { [key in Key]: number | boolean | string | object | undefined },
) => number {
	return order === 'desc'
		? (a, b) =>
				!!customDescendingComparator
					? customDescendingComparator(a, b, orderBy)
					: descendingComparator(a, b, orderBy)
		: (a, b) =>
				!!customDescendingComparator
					? -customDescendingComparator(a, b, orderBy)
					: -descendingComparator(a, b, orderBy);
}

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

/**
 * @IUnknown404I Generic for type-checks of passed ?any value accroding passed Type.
 * @param x is a value to type-check.
 * @returns is value's type passed Type or not.
 */
export const isType = <T>(x: any): x is T => true;

/**
 * @IUnknown404I Simply return an array with all passed Objects' keys by deep scanning. Also can log all steps.
 * @param payload as [Object] with keys:
 * - obj: [Object] as main obj to analize;
 * - enableLogs?: [boolean], false by default. Pass true to logout every found key on the steps;
 * - prefix?: [string] as prefixed keynames for the inner objects.
 * @returns Array<string> as all-keys of passed object.
 */
export const deepObjectKeysGetter = (payload: { obj: Object; enableLogs?: boolean; prefix?: string }): string[] => {
	let keysArray: string[] = [];
	Object.keys(payload.obj).forEach(el => {
		if (payload.obj[el as keyof typeof payload.obj] instanceof Object)
			keysArray = keysArray.concat(
				deepObjectKeysGetter({ obj: payload.obj[el as keyof typeof payload.obj], prefix: el }),
			);
		else keysArray.push(payload.prefix ? `${payload.prefix}.${el}` : el);
	});
	return keysArray;
};

export const isIOS = (): boolean => typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

export const isMobileDevice = (): boolean =>
	typeof navigator !== 'undefined' &&
	/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
		navigator.userAgent,
	);

export const checkProductionMode = (): boolean => process.env.NEXT_PUBLIC_PRODUCTION_MODE === 'true';

/**
 * @IUnknown404I funciton for copying text. Uses deprecated browser API as fallback in edge cases.
 * @param text as string to copy.
 */
export async function copyTextToClipboard(text: string): Promise<void | undefined> {
	if (!text) return;
	if (!navigator.clipboard) {
		// deprecated fallback
		fallbackCopyTextToClipboard(text);
		return;
	}
	navigator.clipboard.writeText(text);
}

/**
 * @deprecated
 * @IUnknown404I use this function only if navigator.clipboard object isn't avaible.
 * @param text as string to copy.
 */
function fallbackCopyTextToClipboard(text: string): void | undefined {
	if (!text) return;
	var textArea = document.createElement('textarea');
	textArea.value = text;
	textArea.style.opacity = '0';

	// Avoid scrolling to bottom
	textArea.style.top = '0';
	textArea.style.left = '0';
	textArea.style.position = 'fixed';

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		var successful = document.execCommand('copy');
	} catch (e) {}

	document.body.removeChild(textArea);
}

export function scrollDocumentToTop() {
	if (!!document.scrollingElement) document.scrollingElement.scrollTo(0, 0);
}

export function arrayShuffle<T>(array: Array<T>): T[] {
	if (!array || array.length < 1) return [];
	const shufled = array.toReversed();
	shufled.forEach((_, index) => {
		const j = Math.floor(Math.random() * (index + 1));
		[shufled[index], shufled[j]] = [shufled[j], shufled[index]];
	});
	return shufled;
}

/**
 * @IUnknown404I Scrolling to the end of passed element throught Ref object.
 * @param element as Ref object.
 * @param timeout optional, pass as number.
 */
export function scrollDivToBottom(
	element: React.RefObject<HTMLDivElement | undefined> | React.RefObject<HTMLDivElement>,
	timeout: number = 0,
) {
	setTimeout(() => {
		if (element?.current) {
			element.current.scrollTo({ top: element.current.scrollHeight });
		}
	}, timeout);
}

/**
 * @IUnknown404I Basic function to convert any number to Roman number;
 * @param num as number to be processed;
 * @returns string as roman number.
 */
export function convertToRomanNumeral(num: number): string {
	let numberToConvert = num;
	return [
		{ value: 1000, char: 'M' },
		{ value: 900, char: 'CM' },
		{ value: 500, char: 'D' },
		{ value: 400, char: 'CD' },
		{ value: 100, char: 'C' },
		{ value: 90, char: 'XC' },
		{ value: 50, char: 'L' },
		{ value: 40, char: 'XL' },
		{ value: 10, char: 'X' },
		{ value: 9, char: 'IX' },
		{ value: 5, char: 'V' },
		{ value: 4, char: 'IV' },
		{ value: 1, char: 'I' },
	].reduce((accum, cur) => {
		while (numberToConvert / cur.value >= 1) {
			accum += cur.char;
			numberToConvert -= cur.value;
		}
		return accum;
	}, '');
}

/**
 * @IUnknown404I Converts passed string to camelCaseString.
 * @param text the string to be processed.
 * @param separator the string to split passed text to words.
 * @returns string in camelCase.
 */
export function textToCamelCase(text: string, separator: string = ' '): string {
	const words = text.split(separator);
	return words.reduce(
		(acc, cur, index) => acc + (index === 0 ? cur.toLowerCase() : cur[0].toUpperCase() + cur.slice(1)),
		'',
	);
}

/**
 * @deprecated use secondsToHourMinSecString function instead
 * @IUnknown404I Converts passed seconds into string like '{minCount} мин {secCount} сек'
 * @param totalSeconds total seconds
 * @returns string
 */
export function secondsToMinSec(totalSeconds: number): string {
	if (!totalSeconds) return '';
	const timeLimit = totalSeconds;
	const minutes = Math.floor(timeLimit / 60);
	const seconds = Math.floor(timeLimit - minutes * 60);
	return `${minutes > 0 ? `${minutes} мин` : ''}${seconds > 0 ? ` ${seconds} сек` : ''}`;
}

/**
 * @IUnknown404I Converts passed seconds into string like '{hoursCount} ч. {minsCount} мин. {secsCount} сек.'
 * @param passedSeconds passed seconds to convert to the string
 * @param maxValuableSeconds optional number as limit for the converting. If passed seconds > maxValuableSeconds, maxValuableSeconds will be converted, not passedSeconds
 * @returns string with hours, minutes and seconds from the passedSeconds number.
 */
export function secondsToHourMinSecString(passedSeconds?: number, maxValuableSeconds?: number): string | undefined {
	if (!passedSeconds) return undefined;
	const parsingTimeInSeconds =
		passedSeconds < (maxValuableSeconds || Number.POSITIVE_INFINITY)
			? passedSeconds
			: (maxValuableSeconds as number);
	let seconds = 0,
		minutes = 0,
		hours = 0;

	hours = Math.floor(parsingTimeInSeconds / 60 ** 2);
	minutes = Math.floor((parsingTimeInSeconds - hours * 60 ** 2) / 60);
	seconds = Math.floor(parsingTimeInSeconds - hours * 60 ** 2 - minutes * 60);
	return `${hours ? hours + ' ч.' : ''} ${minutes ? minutes + ' мин.' : ''} ${
		seconds ? seconds + ' сек.' : ''
	}`.trim();
}
