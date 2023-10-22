/**
 * @IUnknown404I
 * @param date as Date object to be formatted;
 * @param options 
 * @param enableSeconds seconds-output is disabled by default;
 * @returns formatted data in string format.
 */
export const formatData = (
	date: Date,
	options?: {
		mode: 'full' | 'full_short' | 'only_date' | 'only_time' | 'week_date';
		locale?: string;
		options?: Intl.DateTimeFormatOptions;
	},
	enableSeconds?: boolean,
): string => {
	const fullModeOptions: Intl.DateTimeFormatOptions = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: enableSeconds ? 'numeric' : undefined,
	};

	const dateFormatter = new Intl.DateTimeFormat(
		options?.locale || 'ru',
		options?.options || (options && options.mode !== 'full')
			? options.mode === 'only_date'
				? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
				: options.mode === 'only_time'
				? { hour: 'numeric', minute: 'numeric', second: enableSeconds ? 'numeric' : undefined }
				: options.mode === 'week_date'
				? { weekday: 'long', hour: 'numeric', minute: 'numeric', second: enableSeconds ? 'numeric' : undefined }
				: options.mode === 'full_short'
				? {
						...fullModeOptions,
						weekday: undefined,
						month: 'numeric',
						second: enableSeconds ? 'numeric' : undefined,
				  }
				: {}
			: fullModeOptions,
	);

	let formattedDate = dateFormatter.format(date);
	const formattedDateArray = formattedDate.split(' ');
	if (formattedDateArray.length > 1 && formattedDateArray[1].startsWith('0')) {
		formattedDateArray[1] = formattedDateArray[1].slice(1);
		formattedDate = formattedDateArray.join(' ');
	} else if (formattedDate.startsWith('0')) formattedDate = formattedDate.slice(1);
	return formattedDate;
};

/**
 * @IUnknown404I Returns <string> representation of passed Date in yyyy-mm-dd format.
 * @param date as <Date> object to be transformed to <string>.
 * @returns stringified <Date> object.
 */
export const getDashDateString = (date: Date): string => date.toJSON().split('T')[0];

/**
 * @IUnknown404I
 * @param date as <Date> object.
 * @returns new <Date> object of last date in previous month.
 */
export const getLastDayOfPreviousMonth = (date: Date): Date => new Date(new Date(date).setDate(0));

/**
 * @IUnknown404I
 * @param date as <Date> object.
 * @returns new <Date> object of first date in previous month.
 */
export const getFirstDayOfPreviousMonth = (date: Date): Date => new Date(getLastDayOfPreviousMonth(date).setDate(1));

/**
 * @IUnknown404I Counts and returns first and last days as Date[] of passed initial date.
 * @param initDate as <Date> object from which the previous date will be counted.
 * @returns an Array<Date> in format [FIRST_DAY_OF_PREVIOUS_MONTH, LAST_DAY_OF_PREVIOUS_MONTH].
 */
export const getPreviousMonthPeriod = (initDate: Date): Date[] => [
	getFirstDayOfPreviousMonth(initDate),
	getLastDayOfPreviousMonth(initDate),
];

/**
 *
 * @param monthsAmount amount of previous months to count their periods.
 * @param includeCurrent pass <true> to include period of current month as [FIRST_DAY_OF_CURRENT_MONTH, TODAY].
 * @returns a two-dimensional array: Array<String[]> in format [FIRST_DAY_OF_PREVIOUS_MONTH, LAST_DAY_OF_PREVIOUS_MONTH].
 */
export function getMonthsPeriods(monthsAmount: number, includeCurrent: boolean, toString: false): Array<Date[]>;
export function getMonthsPeriods(monthsAmount: number, includeCurrent: boolean, toString: true): Array<string[]>;
export function getMonthsPeriods(
	monthsAmount: number,
	includeCurrent: boolean = false,
	toString: boolean = false,
): (string | Date)[][] {
	const thisMonthStart = new Date(new Date().setDate(1));
	const thisMonth = [
		toString ? getDashDateString(thisMonthStart) : thisMonthStart,
		toString ? getDashDateString(new Date()) : new Date(),
	];

	let periodsArray = includeCurrent ? [thisMonth] : [];
	let periodDate = new Date();

	while (monthsAmount !== 0) {
		periodsArray.push(
			toString
				? getPreviousMonthPeriod(periodDate).map(date => getDashDateString(date))
				: getPreviousMonthPeriod(periodDate),
		);
		periodDate = getLastDayOfPreviousMonth(periodDate);
		monthsAmount--;
	}
	return periodsArray;
}

enum months {
	jan = 'январь',
	feb = 'февраль',
	mar = 'март',
	apr = 'апрель',
	may = 'май',
	jun = 'июнь',
	jul = 'июль',
	aug = 'август',
	sep = 'сентябрь',
	nov = 'ноябрь',
	oct = 'октябрь',
	dec = 'декабрь',
}

export const allMonths = [
	'январь',
	'февраль',
	'март',
	'апрель',
	'май',
	'июнь',
	'июль',
	'август',
	'сентябрь',
	'ноябрь',
	'октябрь',
	'декабрь',
];

export const getMonthNumberFromString = (monthString: string): string => {
	switch (
		monthString
			.trim()
			.toLowerCase()
			.slice(0, monthString.length - 1)
	) {
		case months.jan.slice(0, months.jan.length - 1):
			return '01';
		case months.feb.slice(0, months.feb.length - 1):
			return '02';
		case months.mar.slice(0, months.mar.length - 1):
			return '03';
		case months.mar:
			return '03';
		case months.apr.slice(0, months.apr.length - 1):
			return '04';
		case months.may.slice(0, months.may.length - 1):
			return '05';
		case months.jun.slice(0, months.jun.length - 1):
			return '06';
		case months.jul.slice(0, months.jul.length - 1):
			return '07';
		case months.aug.slice(0, months.aug.length - 1):
			return '08';
		case months.aug:
			return '08';
		case months.sep.slice(0, months.sep.length - 1):
			return '09';
		case months.oct.slice(0, months.oct.length - 1):
			return '10';
		case months.nov.slice(0, months.nov.length - 1):
			return '11';
		case months.dec.slice(0, months.dec.length - 1):
			return '12';
		default:
			return '0';
	}
};

export const getStringMonthFromMonthNumber = (month: number, fromZero: boolean = false) => {
	if (fromZero)
		switch (month) {
			case 0:
				return 'января';
			case 1:
				return 'февраля';
			case 2:
				return 'марта';
			case 3:
				return 'апреля';
			case 4:
				return 'мая';
			case 5:
				return 'июня';
			case 6:
				return 'июля';
			case 7:
				return 'августа';
			case 8:
				return 'сентября';
			case 9:
				return 'октября';
			case 10:
				return 'ноября';
			case 11:
				return 'декабря';
		}
	else
		switch (month) {
			case 1:
				return 'января';
			case 2:
				return 'февраля';
			case 3:
				return 'марта';
			case 4:
				return 'апреля';
			case 5:
				return 'мая';
			case 6:
				return 'июня';
			case 7:
				return 'июля';
			case 8:
				return 'августа';
			case 9:
				return 'сентября';
			case 10:
				return 'октября';
			case 11:
				return 'ноября';
			case 12:
				return 'декабря';
		}
};

/**
 * @IUnknown404I Get readable stringDate from [Date] object.
 * @param date as [Date] object.
 * @returns formatted [string] as "dd.mm.yyyy" from the passed date.
 */
export const getStringFromDate = (date: Date) => {
	const dd = String(date.getDate()).padStart(2, '0');
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const yyyy = String(date.getFullYear());

	return {
		day: dd,
		month: mm,
		year: yyyy,
		stringDate: `${dd}.${mm}.${yyyy}`,
	};
};

/**
 * @IUnknown404I Get [Date] object from formatted date-string.
 * @param stringDate as formatted date-string as "dd.mm.yyyy".
 * @returns [Date] object from passed string.
 */
export const getDateFromString = (stringDate: string) => {
	if (!stringDate) throw new Error('expect string to be passed.');

	let [day, month, year] = stringDate.split('.');
	year = yearRefactor(year);

	return new Date(`${year}-${month}-${day}`);
};

/**
 * @IUnknown404I Helper function with date and time attributes.
 * @returns [object] with next [string] attributes:
 * - date: { day, month, year };
 * - time: { seconds, minutes, hours };
 * - complex: { today as "dd.mm.yyyy", time as "hh:mm.ss" }
 */
export const getToday = (): {
	day: string;
	month: string;
	year: string;
	today: string;
	hours: string;
	minutes: string;
	seconds: string;
	time: string;
} => {
	const today = new Date();
	let dd = today.getDate();
	let mm = today.getMonth() + 1;
	let yyyy = today.getFullYear();
	let hours = today.getUTCHours() + 3;

	if (hours > 23) {
		hours = hours - 24;

		if (dd == new Date(yyyy, mm - 1, 0).getDate()) {
			dd = 1;

			if (mm === 12) {
				mm = 1;
				yyyy++;
			} else mm++;
		} else dd++;
	}

	const validHours = hours.toString().padStart(2, '0');
	const validMinutes = today.getMinutes().toString().padStart(2, '0');
	const validSeconds = today.getSeconds().toString().padStart(2, '0');
	const validDD = String(dd).padStart(2, '0');
	const validMM = String(mm).padStart(2, '0');
	const validYYYY = String(yyyy);
	const formattedToday = `${validDD}.${validMM}.${validYYYY}`;
	const formattedTime = `${validHours}:${validMinutes}.${validSeconds}`;

	return {
		hours: validHours,
		minutes: validMinutes,
		seconds: validSeconds,
		day: validDD,
		month: validMM,
		year: validYYYY,

		today: formattedToday,
		time: formattedTime,
	};
};

export const twoDatesCompare = (date1: string, date2: string): -1 | 0 | 1 => {
	let [day1, month1, year1] = date1.split('.');
	let [day2, month2, year2] = date2.split('.');
	year1 = yearRefactor(year1);
	year2 = yearRefactor(year2);

	if (day1 === day2 && month1 === month2 && year1 === year2) return 0;
	else if (new Date(`${year1}-${month1}-${day1}`) < new Date(`${year2}-${month2}-${day2}`)) return -1;
	else return 1;
};

export const dateBeforeTodayCompare = (date: string, includeToday: boolean = false): boolean => {
	let [day, month, year] = date.split('.');
	year = yearRefactor(year);

	return includeToday
		? new Date(`${year}-${month}-${day}`).getDate() - new Date().getDate() <= 1000 * 60 * 60 * 60 * 24
		: new Date(`${year}-${month}-${day}`).getDate() - new Date().getDate() < 0;
};

/**
 * @IUnknown404I Helper year-refactor function.
 * @param year as [string] or [number] value.
 * @returns formatted 4-digit year as [string].
 */
export const yearRefactor = (year: string | number): string => {
	let refactoredYear = String(year);

	if (refactoredYear.length !== 4) {
		refactoredYear = getToday().year.slice(0, 2) + year;
	}
	return refactoredYear;
};

/**
 * @IUnknown404I Helper funciton for simple date of complex date-object detecting.
 * @param date as string or object.
 * @returns [boolean] is string-date value was passed.
 */
export const isSimpleDate = (date: string | { from: string; to: string }): date is string => {
	return !(typeof date !== 'string' && date.from !== undefined);
};

/**
 * @IUnknown404I Formats passed month as [string] in full date-readable value [string].
 * @param month as [string].
 * @returns formatted [string] date as "dd.mm.yyyy".
 */
export const toSeminarValidDateString = (month: string): string => {
	let date: Date = new Date();
	const validMonth = month.includes(' - ') ? month.split(' - ')[1] : month;

	switch (validMonth) {
		case months.jan: {
			date = new Date(new Date().getFullYear(), 1, 29);
			break;
		}
		case months.feb: {
			date = new Date(new Date().getFullYear(), 2, 28);
			break;
		}
		case months.mar: {
			date = new Date(new Date().getFullYear(), 3, 29);
			break;
		}
		case months.apr: {
			date = new Date(new Date().getFullYear(), 4, 29);
			break;
		}
		case months.may: {
			date = new Date(new Date().getFullYear(), 5, 29);
			break;
		}
		case months.jun: {
			date = new Date(new Date().getFullYear(), 6, 29);
			break;
		}
		case months.jul: {
			date = new Date(new Date().getFullYear(), 7, 29);
			break;
		}
		case months.aug: {
			date = new Date(new Date().getFullYear(), 8, 29);
			break;
		}
		case months.sep: {
			date = new Date(new Date().getFullYear(), 9, 29);
			break;
		}
		case months.oct: {
			date = new Date(new Date().getFullYear(), 10, 29);
			break;
		}
		case months.nov: {
			date = new Date(new Date().getFullYear(), 11, 29);
			break;
		}
		case months.dec: {
			date = new Date(new Date().getFullYear(), 12, 29);
			break;
		}
	}
	return `${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date
		.getFullYear()
		.toString()
		.slice(2)}`;
};

/**
 * @IUnknown404I Function for prepairing the date as [string] for passed to the Date-Pickers (mui ones exactly) with MONTH-mode.
 * @param date as [string]. Available options: "[month]" \ "[month] - [month]" \ "dd.mm.yyyy"
 * @param firstMonth if passed date as "[month] - [month]" and this value passed as [boolean] the function will return first or second month according the value, for [undefined] value returns big string for both months as "mm.dddd mm.dddd".
 * @returns prepaired [string] value for passing in MONTH Date-Pickers.
 */
export const getValidDateForMonthsDatePicker = (date: string | undefined, firstMonth?: boolean): string => {
	if (!date) return '';
	else if (date.split('.').length > 1) {
		const dateArr = date.split('.');
		return `${
			dateArr[2].length !== 4 ? new Date().getFullYear().toString().slice(0, 2) + dateArr[2] : dateArr[2]
		}-${dateArr[1]}-${dateArr[0]}`;
	} else if (date.split(' - ').length === 1) {
		return `${new Date().getFullYear().toString()}-${getMonthNumberFromString(date).toString().padStart(2, '0')}`;
	} else {
		const dateMonths = date.split(' - ');
		return firstMonth !== undefined
			? firstMonth
				? `${new Date().getFullYear().toString()}-${getMonthNumberFromString(dateMonths[0])
						.toString()
						.padStart(2, '0')}`
				: `${new Date().getFullYear().toString()}-${getMonthNumberFromString(dateMonths[1])
						.toString()
						.padStart(2, '0')}`
			: `${new Date().getFullYear().toString()}-${getMonthNumberFromString(dateMonths[0])
					.toString()
					.padStart(2, '0')} ${new Date().getFullYear().toString()}-${getMonthNumberFromString(dateMonths[1])
					.toString()
					.padStart(2, '0')}`;
	}
};

/**
 * @IUnknown404I presented for convert onyxTime like "17:51.29" in object with hours, minutes and seconds.
 * @param onyxTime is [string] as onyxTimeString.
 * @returns an [object] with detached [number] attributes equal to hours, minutes and seconds from the passed string.
 */
export const getDetailedInfoFromTimeString = (
	onyxTime: string,
): { hours: number; minutes: number; seconds: number } => {
	const hours = onyxTime.split(':')[0];
	const [minutes, seconds] = onyxTime.split(':')[1].split('.');
	return {
		hours: parseInt(hours),
		minutes: parseInt(minutes),
		seconds: parseInt(seconds),
	};
};

/**
 * @IUnknown404I allows to get the valid [Date] object from the OnyxDateString.
 * @param onyxDateString a complex OnyxDateString as "30.11.2023 -> 17:51.29".
 * @returns valid [Date] object with hours, minutes and seconds counted.
 */
const getDateFromOnyxDate = (onyxDateString: string): Date => {
	const [date, time] = onyxDateString.trim().split(' ');
	const validDate = getDateFromString(date);
	const { hours, minutes, seconds } = getDetailedInfoFromTimeString(time);

	validDate.setHours(hours, minutes, seconds);
	return validDate;
};

/**
 * @IUnknown404I You can pass only first dateString as onyx-date ("[date] [time]") for the compairing with the current Date and pass both dates for the bettwen-compairing.
 * @param date1 is a [string] as OnyxDateString.
 * @param date2 is a [string] as OnyxDateString.
 * @returns the difference in hours between passed dates.
 */
export const twoOnyxDatesDifference = (date1: string, date2?: string): number => {
	const validDate1 = getDateFromOnyxDate(date1);
	const validDate2 = date2 ? getDateFromOnyxDate(date2) : new Date();
	return (+validDate1 - +validDate2) / (1000 * 3600);
};
