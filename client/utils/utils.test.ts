import {
	dateBeforeTodayCompare,
	getDetailedInfoFromTimeString,
	getMonthNumberFromString,
	getStringMonthFromMonthNumber,
	getToday,
	getValidDateForMonthsDatePicker,
	toSeminarValidDateString,
	twoDatesCompare,
	twoOnyxDatesDifference,
} from './date-utils';
import logapp from './logapp';
import { copyTextToClipboard } from './utilityFunctions';

describe('Logapp -> ', () => {
	console = {
		...console,
		// log: jest.fn(),
		// debug: jest.fn(),
		// info: jest.fn(),
		// warn: jest.fn(),
		// error: jest.fn(),
	};
	//TODO: Spying on console.log while logapp processing. Simple spyOn-jest fn doesnt work.
	const logSpy = jest.spyOn(logapp, 'log');
	const debugSpy = jest.spyOn(logapp, 'debug');
	const infoSpy = jest.spyOn(logapp, 'info');
	const warnSpy = jest.spyOn(logapp, 'warn');
	const errorSpy = jest.spyOn(logapp, 'error');

	test('# Logapp calls check:', () => {
		logapp.log('check');
		expect(logSpy).toHaveBeenCalledWith('check');
		logapp.debug('check');
		expect(debugSpy).toHaveBeenCalledWith('check');
		logapp.info('check');
		expect(infoSpy).toHaveBeenCalledWith('check');
		logapp.warn('check');
		expect(warnSpy).toHaveBeenCalledWith('check');
		logapp.error('check');
		expect(errorSpy).toHaveBeenCalledWith('check');
	});
});

describe('Utilities ->', () => {
	test('# getMonthNumberFromString:', () => {
		expect(getMonthNumberFromString('')).toBe('0');
		expect(getMonthNumberFromString('май')).not.toBe('0');
		expect(getMonthNumberFromString('май')).toBe('05');
	});

	test('# getStringMonthFromMonthNumber:', () => {
		expect(getStringMonthFromMonthNumber(12)).toBe('декабря');
		expect(getStringMonthFromMonthNumber(12, true)).toBeUndefined();
	});

	test('# twoDatesCompare:', () => {
		expect(twoDatesCompare('10.10.10', '10.10.10')).toBe(0);
		expect(twoDatesCompare('9.10.10', '10.10.10')).toBe(-1);
		expect(twoDatesCompare('11.10.10', '10.10.10')).toBe(1);
	});

	test('# dateBeforeTodayCompare:', () => {
		expect(dateBeforeTodayCompare(getToday().today)).toBeFalsy();
		expect(dateBeforeTodayCompare(getToday().today, true)).toBeTruthy();
	});

	test('# toSeminarValidDateString:', () => {
		expect(toSeminarValidDateString('декабрь')).toBe(`29.00.24`);
		expect(toSeminarValidDateString('май')).toBe(`29.05.${getToday().year.slice(2)}`);
		expect(toSeminarValidDateString('декабрь - май')).toBe(`29.05.${getToday().year.slice(2)}`);
	});

	test('# getValidDateForMonthsDatePicker:', () => {
		expect(getValidDateForMonthsDatePicker('декабрь')).toBe('2023-12');
		expect(getValidDateForMonthsDatePicker('декабрь - январь')).toBe('2023-12 2023-01');
		expect(getValidDateForMonthsDatePicker('декабрь - январь', true)).toBe('2023-12');
		expect(getValidDateForMonthsDatePicker('25.05.23')).toBe('2023-05-25');
		expect(getValidDateForMonthsDatePicker('25.05.2023')).toBe('2023-05-25');
	});

	test('# getDetailedInfoFromTimeString:', () => {
		expect(getDetailedInfoFromTimeString('17:23.01')).toStrictEqual({
			hours: 17,
			minutes: 23,
			seconds: 1,
		});
		expect(getDetailedInfoFromTimeString('2:02.02')).toStrictEqual({
			hours: 2,
			minutes: 2,
			seconds: 2,
		});
	});

	test('# twoOnyxDatesDifference:', () => {
		expect(twoOnyxDatesDifference('30.11.2023 17:51.29', '30.11.2023 17:51.29')).toBe(0);
		expect(twoOnyxDatesDifference('31.11.2023 17:51.29', '30.11.2023 17:51.29')).not.toBe(0);
	});

	test('# copy text to the clipboard', () => {
		expect(copyTextToClipboard('').then(data => expect(data).toBeUndefined()));
	});
});
