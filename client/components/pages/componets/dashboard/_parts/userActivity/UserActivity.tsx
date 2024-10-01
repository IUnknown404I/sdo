import { Stack, SxProps, Theme, useTheme } from '@mui/material';
import ru from 'apexcharts/dist/locales/ru.json';
import dynamic from 'next/dynamic';
import React from 'react';
import { rtkApi } from '../../../../../../redux/api';
import { UserActivityObjectType } from '../../../../../../redux/endpoints/userEnd';
import { formatDate } from '../../../../../../utils/date-utils';
import OnyxSelect from '../../../../../basics/OnyxSelect';
import { OnyxTypography } from '../../../../../basics/OnyxTypography';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const UserActivity = (props: { sx?: SxProps<Theme> }) => {
	const theme = useTheme();
	const [activityPeriod, setActivityPeriod] = React.useState<Parameters<typeof parseSeriesByDays>[1]>('week');

	const {
		data: myActivity,
		isFetching: isMyActivityFetching,
		isError: isMyActivityError,
	} = rtkApi.useMyActivityQuery(undefined, { pollingInterval: 3 * 60 * 1000 });

	const activitySeries = React.useMemo<ReturnType<typeof parseSeriesByDays>>(
		() => parseSeriesByDays(myActivity, activityPeriod),
		[activityPeriod, myActivity],
	);

	const userActivityData = {
		options: {
			chart: {
				id: 'user-activity',
				foreColor: theme.palette.primary.main,
				locales: [ru],
				defaultLocale: 'ru',
				stroke: {
					curve: 'smooth',
				},
				toolbar: {
					show: false,
					tools: {
						download: false, // <== line to add
					},
				},
			},
			tooltip: {
				theme: theme.palette.mode,
			},
			xaxis: {
				labels: {
					style: {
						colors: theme.palette.primary as unknown as string,
						// colors: theme.palette.primary.sub, //property .sub doesn't exist in interface PaletteColor
					},
				},
			},
			yaxis: {
				labels: {
					style: {
						colors: theme.palette.primary as unknown as string,
						// colors: theme.palette.primary.sub, //property .sub doesn't exist in interface PaletteColor
					},
				},
			},
			grid: {
				show: false,
			},
		},
		// series: [
		// 	{
		// 		name: 'Количество часов',
		// 		data: createDataSeries([3, 5, 3, 4, 2, 1, 5]),
		// 	},
		// ],
	};

	return (
		<Stack sx={{ color: 'text.primary', ...props.sx }} direction='column' spacing={2}>
			<Stack
				width='100%'
				direction='row'
				alignItems='center'
				gap={0.75}
				sx={{
					position: 'relative',
					justifyContent: { xs: 'flex-start', sm: 'center' },
					'> span': { paddingLeft: { xs: '1rem', sm: 'unset' } },
					'> div': {
						position: 'absolute',
						top: '0',
						right: '0',
					},
					'> div > div': { minWidth: '100px' },
					'> div > div > div': {
						fontSize: '.95rem',
						padding: '.25rem !important',
						color: theme => theme.palette.secondary.main,
					},
				}}
			>
				<OnyxTypography
					component='span'
					text='ГРАФИК АКТИВНОСТИ'
					tpWeight='bold'
					tpSize='1.25rem'
					tpVariant='body1'
					sx={{ textTransform: 'uppercase' }}
				/>
				<OnyxSelect
					disabled={isMyActivityFetching || isMyActivityError}
					size='small'
					disableEmptyOption
					value={activityPeriod || 'week'}
					setValue={e => setActivityPeriod(e.target.value as typeof activityPeriod)}
					listItems={['неделя', 'месяц', 'полугодие', 'год']}
					itemsIndexes={['week', 'month', 'half-year', 'year']}
				/>
			</Stack>

			<Chart
				options={userActivityData.options}
				series={[
					{
						name: 'Действий совершено',
						data: activitySeries,
					},
				]}
				type='area'
				width='100%'
				height='350px'
			/>
		</Stack>
	);
};

export default UserActivity;

function parseSeriesByDays(
	logs?: UserActivityObjectType['logs'],
	activityPeriod?: 'week' | 'month' | 'half-year' | 'year',
): { x: string; y: number }[] {
	return activityPeriod === 'week' || activityPeriod === 'month'
		? parseDaysActivity(logs, activityPeriod === 'month' ? 31 : 7)
		: parseMonthsActivity(logs, activityPeriod === 'half-year' ? 6 : 12);
}

function parseDaysActivity(
	logs?: UserActivityObjectType['logs'],
	length?: 7 | 31,
	fromDate?: Date,
): { x: string; y: number }[] {
	const today = fromDate || new Date();
	const days: ReturnType<typeof parseDaysActivity> = [];

	for (let i = 0; i < (length || 7); i++) {
		const first = today.getDate() - (i > 0 ? 1 : 0);
		const dayString = formatDate(new Date(today.setDate(first)), { mode: 'date_short' });
		days.push({ x: dayString, y: !!logs ? logs[dayString] || 0 : 0 });
	}
	return days.toReversed();
}

function parseMonthsActivity(
	logs?: UserActivityObjectType['logs'],
	length?: 6 | 12,
	fromDate?: Date,
): { x: string; y: number }[] {
	const today = fromDate || new Date();
	const months: ReturnType<typeof parseDaysActivity> = [];

	for (let m = 0; m < (length || 6); m++) {
		const days: ReturnType<typeof parseDaysActivity> = [];

		const finishDay = today.getDate();
		for (let i = 0; i < finishDay; i++) {
			const dayString = formatDate(new Date(today.setDate(i + 1)), { mode: 'date_short' });
			days.push({ x: dayString, y: !!logs ? logs[dayString] || 0 : 0 });
		}

		months.push({
			x: formatDate(today, { mode: length === 6 ? 'only_month' : 'only_month_short' }),
			y: days.reduce((acc, cur) => acc + cur.y, 0),
		});
		today.setDate(-1);
	}
	return months.toReversed();
}
