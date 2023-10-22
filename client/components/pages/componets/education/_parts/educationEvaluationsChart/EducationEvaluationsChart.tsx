import dynamic from 'next/dynamic';
import ru from 'apexcharts/dist/locales/ru.json';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { Paper, Typography, useTheme } from '@mui/material';

export const EducationEvaluationsChart = () => {
	const theme = useTheme();
	const educationFullProgressData = {
		series: [
			{
				name: 'Тестирование',
				data: [5, 4, 3, 3, 3, 0],
			},
			{
				name: 'Практические задания',
				data: [0, 0, 5, 4, 0, 0],
			},
		],
		options: {
			chart: {
				id: 'education-evaluations-chart',
				foreColor: theme.palette.primary.main,
				locales: [ru],
				defaultLocale: 'ru',

				toolbar: {
					show: true,
					tools: {
						download: false, // <== line to add
					},
				},
				sparkline: {
					enabled: false,
				},
			},

			dataLabels: {
				enabled: false,
			},
			labels: ['Тема 1', 'Тема 2', 'Тема 3', 'Тема 4', 'Тема 5', 'Итоговая аттестация'],
			colors: ['#05e296', '#feb01a'],
			tooltip: {
				theme: theme.palette.mode,
			},

			xaxis: {
				// labels: {
				// 	style: {
				// 		colors: theme.palette.primary.sub,
				// 	},
				// },
			},

			yaxis: {
				// labels: {
				// 	style: {
				// 		colors: theme.palette.primary.sub,
				// 	},
				// },
			},
			grid: {
				show: true,
			},
			fill: {
				opacity: 0.5,
			},
		},
	};
	return (
		<>
			<Chart
				options={educationFullProgressData.options}
				series={educationFullProgressData.series}
				type='area'
				width={'100%'}
				height={'500px'}
			/>
		</>
	);
};
