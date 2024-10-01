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

const ALPHAVITE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' as const;
export const generateRandomString = (len: number): string => {
	const charsArray: string[] = [];
	while (charsArray.length < len - 1) {
		charsArray.push(ALPHAVITE.charAt(Math.floor(Math.random() * ALPHAVITE.length - 1)));
	}
	return charsArray.join('');
};

/**
 * @IUnknown404I doesnt mutate passed data.
 * @returns new typed shuffled (random-based incrementing replacement) array.
 */
export function arrayShuffle<T>(array: Array<T>): T[] {
	if (!array || array.length < 1) return [];
	const shufled = array.slice();
	shufled.forEach((_, index) => {
		const j = Math.floor(Math.random() * (index + 1));
		[shufled[index], shufled[j]] = [shufled[j], shufled[index]];
	});
	return shufled;
}

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

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

export const isProductionMode = (): boolean => process.env.PRODUCTION_MODE === 'true';

export const getCurrentDomain = (): string => (isProductionMode() ? process.env.SELF_DOMAIN : 'http://localhost:4444');
