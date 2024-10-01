import { Paper, Stack, useTheme } from '@mui/material';
import ru from 'apexcharts/dist/locales/ru.json';
import dynamic from 'next/dynamic';
import { EducationElementsProgress } from '../../../../..';
import { ProgressStatsOptions, UserStatsByProgressType } from '../../../../../../redux/endpoints/courseProgressEnd';
import ClassicLoader from '../../../../../utils/loaders/ClassicLoader';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const CourseProgress = (props: { summaryStats?: UserStatsByProgressType['summary'] }) => {
	const theme = useTheme();

	const educationFullProgressData = {
		// series: [49],
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
			plotOptions: {
				radialBar: {
					startAngle: -135,
					endAngle: 135,
					dataLabels: {
						name: {
							fontSize: '16px',
							color: undefined,
							offsetY: 120,
						},
						value: {
							offsetY: 76,
							fontSize: '22px',
							color: undefined,
							formatter: function (val: string | number) {
								return val + '%';
							},
						},
					},
				},
			},
			labels: ['Изучение программы'],

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
		},
	};

	return (
		<Paper sx={{ padding: '10px 20px 20px 20px', borderRadius: '20px' }}>
			{!!props.summaryStats ? (
				<>
					<Chart
						options={educationFullProgressData.options}
						series={[props.summaryStats.total]}
						type='radialBar'
						width='100%'
						height='250px'
					/>

					<Stack direction='column' spacing={3} sx={{ width: '100%', padding: '20px 0' }}>
						{Object.keys(props.summaryStats).map((attribute, index) =>
							attribute === 'total' ? (
								<></>
							) : (
								<EducationElementsProgress
									key={index}
									color={ProgressStatsOptions[attribute as keyof typeof ProgressStatsOptions].color}
									progress={props.summaryStats![attribute as keyof typeof props.summaryStats] || 0}
									title={
										ProgressStatsOptions[attribute as keyof typeof ProgressStatsOptions]
											.translation_short
									}
								/>
							),
						)}
					</Stack>
				</>
			) : (
				<Stack alignItems='center' justifyContent='center' gap={5}>
					<ClassicLoader size={65} />
					<ClassicLoader size={65} />
					<ClassicLoader size={65} />
				</Stack>
			)}
		</Paper>
	);
};
