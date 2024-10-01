import { Box, Typography, useTheme } from '@mui/material';
import { Stack } from '@mui/system';
import dynamic from 'next/dynamic';
import React from 'react';
import { rtkApi } from '../../../../../../redux/api';
import { CourseProgressWithRestrictmentsI } from '../../../../../../redux/endpoints/courseProgressEnd';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const UserProgress = (props: { total?: number; theory?: number; tests?: number; practics?: number }) => {
	const theme = useTheme();

	const { data: myProgresses } = rtkApi.useMyProgressesQuery('');
	const myParsedProgress = React.useMemo<CourseProgressWithRestrictmentsI | undefined>(
		() =>
			(myProgresses?.filter(
				progress =>
					progress.status === 'active' &&
					(progress.role === 'student' || (progress.role === 'teacher' && !!progress.lgid)),
			) || [])[0],
		[myProgresses],
	);
	const { data: progressStats, refetch: progressStatsRefetch } = rtkApi.useCurrentProgressStatsQuery(
		myParsedProgress?.cpid || 'undefined',
	);

	React.useEffect(() => {
		if (!!myParsedProgress) progressStatsRefetch();
	}, [myParsedProgress]);

	const data = {
		series: [
			progressStats?.summary?.theory || props.theory || 0,
			progressStats?.summary?.tests || props.tests || 0,
			progressStats?.summary?.self || props.practics || 0,
		],
		options: {
			chart: {
				id: 'user-progress',
			},

			plotOptions: {
				radialBar: {
					dataLabels: {
						name: {
							fontSize: '20px',
						},

						value: {
							fontSize: '18px',
							color: theme.palette.primary.main,
						},

						total: {
							show: true,
							label: 'Изучено',
							color: theme.palette.primary.main,

							formatter: function (w: any) {
								// By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
								return progressStats?.summary?.total !== undefined
									? progressStats.summary.total + ' %'
									: props.total !== undefined
									? props.total + ' %'
									: `${(props.theory || 0) * (props.tests || 0) * (props.practics || 0)} %`;
							},
						},
					},
				},
			},
			stroke: {
				lineCap: 'round',
			},
			labels: ['Теория', 'Тесты', 'Практика'],
		},
	};

	return (
		<Stack sx={{ padding: '20px' }} spacing={2}>
			<Typography variant='body1' align='center' marginBottom='-.5rem' fontWeight='bold'>
				ПРОГРЕСС ОБУЧЕНИЯ
			</Typography>

			<Chart
				options={data.options as ApexCharts.ApexOptions}
				series={data.series}
				type='radialBar'
				width='100%'
				height='300px'
			/>

			<Stack direction='row' justifyContent='center' alignItems='center' spacing={3}>
				{[
					{ color: '#409EFA', text: 'Теория' },
					{ color: '#4EE6A4', text: 'Тесты' },
					{ color: '#FEBA48', text: 'Практика' },
				].map(pin => (
					<Stack justifyContent={'center'} alignItems={'center'} key={pin.color}>
						<Box
							sx={{
								width: '20px',
								height: '20px',
								bgcolor: pin.color,
								borderRadius: '10px',
							}}
						/>
						<Typography variant='caption'>{pin.text}</Typography>
					</Stack>
				))}
			</Stack>
		</Stack>
	);
};
