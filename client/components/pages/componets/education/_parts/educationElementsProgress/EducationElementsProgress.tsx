import { Stack, Typography, useTheme } from '@mui/material';
import ru from 'apexcharts/dist/locales/ru.json';
import dynamic from 'next/dynamic';
import { IEducationElementsProgressProps } from './EducationElementsProgress.props';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const EducationElementsProgress = ({ title, progress, color }: IEducationElementsProgressProps) => {
	const theme = useTheme();

	const educationProgressData = {
		series: [
			{
				name: 'Прогресс',
				data: [
					{
						x: title,
						y: progress,
					},
				],
			},
		],

		options: {
			chart: {
				id: 'education-progress',
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
				sparkline: {
					enabled: true,
				},
			},
			stroke: {
				curve: 'straight' as 'smooth' | 'straight' | 'stepline' | 'monotoneCubic',
				// "smooth" | "straight" | "stepline" | "monotoneCubic" | ("smooth" | "straight" | "stepline" | "monotoneCubic"
			},
			fill: {
				colors: [color],
			},
			tooltip: {
				theme: theme.palette.mode,
			},
			xaxis: {
				labels: {
					style: {
						colors: theme.palette.primary.main,
						// colors: theme.palette.primary.sub,
					},
				},
			},
			yaxis: {
				max: 100,
				labels: {
					style: {
						colors: theme.palette.primary.main,
						// colors: theme.palette.primary.sub,
					},
				},
			},
			grid: {
				show: false,
			},

			plotOptions: {
				bar: {
					horizontal: true,
					barHeight: '100%',
					borderRadius: 5,
					colors: {
						backgroundBarColors: ['#e4e4e4'],
					},
				},
			},
		},
	};

	return (
		<Stack spacing={1}>
			<Stack direction='row' justifyContent='space-between' alignItems='center'>
				<Typography variant='body2'>{title}</Typography>
				<Typography variant='body2'>{progress}%</Typography>
			</Stack>

			<Chart
				options={educationProgressData.options}
				series={educationProgressData.series}
				type='bar'
				width='100%'
				height='10px'
			/>
		</Stack>
	);
};
