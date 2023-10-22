import { Stack, Typography, useTheme } from '@mui/material';
import ru from 'apexcharts/dist/locales/ru.json';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';

const getWeek = () => {
	const curr = new Date();
	const week = [];

	for (let i = 1; i <= 7; i++) {
		const first = curr.getDate() - curr.getDay() + i;
		const day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
		week.push(day);
	}
	return week;
};

const createDataSeries = (hours: number[]) => {
	const currentWeek = getWeek();
	const result: { x: string; y: number }[] = [];

	currentWeek.map((day, index) => {
		result.push({ x: format(new Date(day), 'dd.MM.yy'), y: hours[index] });
	});

	return result;
};

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const UserActivity = () => {
	const theme = useTheme();
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
		series: [
			{
				name: 'Количество часов',
				data: createDataSeries([3, 5, 3, 4, 2, 1, 5]),
			},
		],
	};

	return (
		<Stack sx={{ color: 'text.primary' }} direction={'column'} spacing={2}>
			<Typography variant='body1' align='center' marginTop='.65rem' marginBottom='-.5rem' fontWeight='bold'>
				ГРАФИК АКТИВНОСТИ - ПОСЛЕДНЯЯ НЕДЕЛЯ
			</Typography>
			<Chart
				options={userActivityData.options}
				series={userActivityData.series}
				type='area'
				width={'100%'}
				height={'350px'}
			/>
		</Stack>
	);
};
