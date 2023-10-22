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

export enum months {
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

/**
 * @IUnknown404I
 * @returns an actual time-filled [object]:
 * {
		hours: string,
		minutes: string,
		seconds: string,
		day: string,
		month: string,
		year: string,
		today: string,
		time: string,
	}
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

/**
 * @IUnknown404I
 * @param year passed [string] or [number] as full year "2023" or 2023 or as short version like "23" or 2023.
 * @returns refactored valid year as four-chars [string].
 */
export const yearRefactor = (year: string | number): string => {
	let refactoredYear = String(year);

	if (refactoredYear.length !== 4) {
		refactoredYear = getToday().year.slice(0, 2) + year;
	}
	return refactoredYear;
};

/**
 * @IUnknown404I
 * @param date as [string] in ru locale: "dd.mm.yyyy".
 * @returns [boolean] flag is passed date already passed or not.
 */
export const dateBeforeTodayCompare = (date: string): boolean => {
	let [day, month, year] = date.split('.');
	year = yearRefactor(year);

	return new Date(`${year}-${month}-${day}`) < new Date();
};

/**
 * @IUnknown404I
 * @param date as defauld Date-type [object]
 * @returns an actual [object]: {
 * 		day: string,
		month: string,
		year: string,
		stringDate: string,
 * }
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
 * @IUnknown404I
 * @param stringDate is date-string in ru locale like "dd.mm.yyyy".
 * @returns valid Date-type object from passed date-string.
 */
export const getDateFromString = (stringDate: string) => {
	let [day, month, year] = stringDate.split('.');
	year = yearRefactor(year);

	return new Date(`${year}-${month}-${day}`);
};

/**
 * @IUnknown404I This is utility function for determining the type of date-attribute of some DTO's.
 * @param sem as date-attribute.
 * @returns type-guard [boolean] flag is passed string or not.
 */
export const isSimpleDate = (sem: string | { from: string; to: string }): sem is string => {
	return !(typeof sem !== 'string' && sem.from !== undefined);
};

/**
 * @IUnknown404I This is utility function for converting month to [string] -> representation of corresponding Date-object.
 * @param month as [string].
 * @returns [string] -> representation of corresponding Date-object.
 */
export const toSeminarValidDateString = (month: string): string => {
	let date: Date = new Date();
	const validMonth = month.includes(' ') ? month.split(' ')[0] : month;

	switch (validMonth) {
		case months.jan: {
			date = new Date(new Date().getFullYear(), 1, 1);
			break;
		}
		case months.feb: {
			date = new Date(new Date().getFullYear(), 2, 1);
			break;
		}
		case months.mar: {
			date = new Date(new Date().getFullYear(), 3, 1);
			break;
		}
		case months.apr: {
			date = new Date(new Date().getFullYear(), 4, 1);
			break;
		}
		case months.may: {
			date = new Date(new Date().getFullYear(), 5, 1);
			break;
		}
		case months.jun: {
			date = new Date(new Date().getFullYear(), 6, 1);
			break;
		}
		case months.jul: {
			date = new Date(new Date().getFullYear(), 7, 1);
			break;
		}
		case months.aug: {
			date = new Date(new Date().getFullYear(), 8, 1);
			break;
		}
		case months.sep: {
			date = new Date(new Date().getFullYear(), 9, 1);
			break;
		}
		case months.oct: {
			date = new Date(new Date().getFullYear(), 10, 1);
			break;
		}
		case months.nov: {
			date = new Date(new Date().getFullYear(), 11, 1);
			break;
		}
		case months.dec: {
			date = new Date(new Date().getFullYear(), 12, 1);
			break;
		}
	}

	return `01.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear().toString().slice(2)}`;
};

/**
 * @IUnknown404I
 * @param date1 as [string] Date in ru locale like "dd.mm.yyyy".
 * @param date2 as [string] Date in ru locale like "dd.mm.yyyy".
 * @returns -1 if date1 < date2; 0 if passed Dates are equal and 1 if date1 > date2.
 */
export const twoDatesCompare = (date1: string, date2: string): -1 | 0 | 1 => {
	let [day1, month1, year1] = date1.split('.');
	let [day2, month2, year2] = date2.split('.');
	year1 = yearRefactor(year1);
	year2 = yearRefactor(year2);

	if (day1 === day2 && month1 === month2 && year1 === year2) return 0;
	else if (new Date(`${year1}-${month1}-${day1}`) < new Date(`${year2}-${month2}-${day2}`)) return -1;
	else return 1;
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
 * @param onyxDateString a complex OnyxDateString as "30.11.2023 17:51.29".
 * @returns valid [Date] object with hours, minutes and seconds counted.
 */
export const getDateFromOnyxDate = (onyxDateString: string): Date => {
	const [date, time] = onyxDateString.trim().split(' ');
	const validDate = getDateFromString(date);
	const { hours, minutes, seconds } = getDetailedInfoFromTimeString(time);

	validDate.setHours(hours, minutes, seconds);
	return validDate;
};

/**
 * @IUnknown404I You can pass only first dateString as onyx-date ("[date] [time]") for comparisson
 * with the current Date and pass both dates for the bettwen-compairing.
 * @param date1 is a [string] as OnyxDateString.
 * @param date2 is a [string] as OnyxDateString.
 * @returns the difference in hours between passed dates.
 */
export const twoOnyxDatesDifferenceInHours = (date1: string, date2?: string): number => {
	const validDate1 = getDateFromOnyxDate(date1);
	const validDate2 = date2 ? getDateFromOnyxDate(date2) : getMSKInMilliseconds();
	return (+validDate1 - +validDate2) / (1000 * 3600);
};

/**
 * @IUnknown404I You can pass only first dateString as onyx-date ("[date] [time]") for comparisson
 * with the current Date and pass both dates for the bettwen-compairing.
 * @param date1 is a [string] as OnyxDateString.
 * @param date2 is a [string] as OnyxDateString.
 * @returns the difference in minuts between passed dates.
 */
export const twoOnyxDatesDifferenceInMinutes = (date1: string, date2?: string): number => {
	const validDate1 = getDateFromOnyxDate(date1);
	const validDate2 = date2 ? getDateFromOnyxDate(date2) : getMSKInMilliseconds();
	return (+validDate1 - +validDate2) / (1000 * 60);
};

/**
 * @IUnknown404I
 * @returns valid Date object for MSK timeline regardless of the server timezone offset.
 */
function getMSKInMilliseconds(): Date {
	const date = new Date();
	date.setDate(new Date().getUTCDate());
	date.setHours(new Date().getUTCHours() + 3);
	return date;
}
