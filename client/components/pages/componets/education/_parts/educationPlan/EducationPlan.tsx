import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ru from 'apexcharts/dist/locales/ru.json';
import { format, parse, fromUnixTime, intervalToDuration, differenceInCalendarDays, differenceInHours } from 'date-fns';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const EducationPlan = () => {
	const theme = useTheme();
	const educationPlanData = {
		series: [
			{
				name: 'Теория',
				data: [
					{
						x: 'Тема 1',
						y: [new Date('2022-09-01T09:00+03:00').getTime(), new Date('2022-09-01T11:00+03:00').getTime()],
					},
					{
						x: 'Тема 2',
						y: [new Date('2022-09-01T14:00+03:00').getTime(), new Date('2022-09-01T16:00+03:00').getTime()],
					},
				],
			},
			{
				name: 'Практические занятия',
				data: [
					{
						x: 'Тема 3',
						y: [new Date('2022-09-02T09:00+03:00').getTime(), new Date('2022-09-02T10:00+03:00').getTime()],
					},
					{
						x: 'Тема 4',
						y: [new Date('2022-09-02T11:00+03:00').getTime(), new Date('2022-09-02T12:00+03:00').getTime()],
					},
					{
						x: 'Тема 5',
						y: [new Date('2022-09-02T13:00+03:00').getTime(), new Date('2022-09-02T14:00+03:00').getTime()],
					},
				],
			},
			{
				name: 'Самостоятельная работа',
				data: [
					{
						x: 'Тема 1',
						y: [new Date('2022-09-01T11:00+03:00').getTime(), new Date('2022-09-01T12:00+03:00').getTime()],
					},
					{
						x: 'Тема 2',
						y: [new Date('2022-09-01T16:00+03:00').getTime(), new Date('2022-09-01T17:00+03:00').getTime()],
					},
				],
			},
			{
				name: 'Тестирование',
				data: [
					{
						x: 'Тема 1',
						y: [new Date('2022-09-01T12:00+03:00').getTime(), new Date('2022-09-01T13:00+03:00').getTime()],
					},
					{
						x: 'Тема 2',
						y: [new Date('2022-09-01T17:00+03:00').getTime(), new Date('2022-09-01T18:00+03:00').getTime()],
					},
					{
						x: 'Тема 3',
						y: [new Date('2022-09-02T10:00+03:00').getTime(), new Date('2022-09-02T11:00+03:00').getTime()],
					},
					{
						x: 'Тема 4',
						y: [new Date('2022-09-02T12:00+03:00').getTime(), new Date('2022-09-02T13:00+03:00').getTime()],
					},
					{
						x: 'Тема 5',
						y: [new Date('2022-09-02T14:00+03:00').getTime(), new Date('2022-09-02T15:00+03:00').getTime()],
					},
				],
			},

			{
				name: 'Вебинары',
				data: [
					{
						x: 'Вебинары',
						y: [new Date('2022-09-01T09:00+03:00').getTime(), new Date('2022-09-01T11:00+03:00').getTime()],
					},
					{
						x: 'Вебинары',
						y: [new Date('2022-09-01T14:00+03:00').getTime(), new Date('2022-09-01T16:00+03:00').getTime()],
					},
				],
			},

			{
				name: 'Итоговая аттестация',
				data: [
					{
						x: 'Итоговая аттестация',
						y: [new Date('2022-09-02T15:00+03:00').getTime(), new Date('2022-09-02T17:00+03:00').getTime()],
					},
				],
			},
		],

		options: {
			chart: {
				id: 'education-plan',
				foreColor: theme.palette.primary.main,
				locales: [ru],
				defaultLocale: 'ru',
				stroke: {
					curve: 'smooth',
				},
				toolbar: {
					show: true,
					tools: {
						download: false, // <== line to add
					},
				},
				// sparkline: {
				// 	enabled: true,
				// },
			},

			tooltip: {
				theme: theme.palette.mode,
				x: {
					show: true,
					format: 'dd MMM',
				},
			},
			colors: [
				'#008FFB',
				'#00E396',
				'#FEB019',
				'#FF4560',
				'#775DD0',
				'#01579b',
				'#546E7A',
				'#D4526E',
				'#8D5B4C',
				'#F86624',
				'#D7263D',
				'#1B998B',
				'#2E294E',
				'#F46036',
				'#E2C044',
			],
			xaxis: {
				type: 'datetime',
				labels: {
					style: {
						colors: theme.palette.primary.sub,
					},
					datetimeFormatter: {
						year: 'yyyy',
						month: "MMM 'yy",
						day: 'dd MMM',
						hour: 'HH:mm',
					},
					datetimeUTC: false,
				},
			},
			yaxis: {
				labels: {
					style: {
						colors: theme.palette.primary.sub,
					},
				},
			},
			// grid: {
			// 	show: true,
			// },
			stroke: {
				width: 1,
			},

			fill: {
				type: 'gradient',
				gradient: {
					shade: 'light',
					type: 'vertical',
					shadeIntensity: 0.25,
					gradientToColors: undefined,
					inverseColors: true,
					opacityFrom: 1,
					opacityTo: 1,
					stops: [50, 0, 100, 100],
				},
			},
			plotOptions: {
				bar: {
					horizontal: true,
					barHeight: '100%',
					// distributed: true,
					// rangeBarOverlap: true,
					rangeBarGroupRows: true,
				},
			},
			dataLabels: {
				enabled: true,
				formatter: function (val) {
					// console.log(val);
					// console.log(differenceInHours(val[1], val[0]));
					const diff = differenceInHours(val[1], val[0]);
					// const diff = differenceInCalendarDays(new Date(val[1]), new Date(val[0]));
					return diff + (diff > 1 ? ' ч.' : 'ч.');
				},
				style: {
					colors: ['#f3f4f5', '#fff'],
				},
			},

			// legend: {
			// 	position: 'top',
			// },
		},
	};

	return (
		<>
			<Stack spacing={1}>
				{/* <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
					<Typography variant="body2">{title}</Typography>
					<Typography variant="body2">{progress}%</Typography>
				</Stack> */}
				<Chart
					options={educationPlanData.options}
					series={educationPlanData.series}
					type='rangeBar'
					width={'100%'}
					height={'500px'}
				/>
			</Stack>
		</>
	);
};
