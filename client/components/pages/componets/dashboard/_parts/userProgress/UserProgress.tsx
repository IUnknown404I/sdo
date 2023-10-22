import { Box, Typography, useTheme } from '@mui/material';
import { Stack } from '@mui/system';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const UserProgress = () => {
	const theme = useTheme();

	const data = {
		series: [44, 55, 67],
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
							label: 'Завершено',
							color: theme.palette.primary.main,

							formatter: function (w: any) {
								// By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
								return `${((44 + 55 + 67) * 3) / 10} %`;
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
				width={'100%'}
				height={'300px'}
			/>

			<Stack direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={3}>
				{[
					{ color: '#409EFA', text: 'Теория' },
					{ color: '#4EE6A4', text: 'Тесты' },
					{ color: '#FEBA48', text: 'Практика' },
				].map((pin) => (
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
