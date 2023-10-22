import dynamic from 'next/dynamic';
import ru from 'apexcharts/dist/locales/ru.json';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { Divider, Paper, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { EducationElementsProgress } from '../../../../..';

const educationSectionProgressData = [
	{ id: '1', title: 'Теория', progress: 40, color: '#006fba' },
	{ id: '2', title: 'Тесты', progress: 20, color: '#4ee6a4' },
	{ id: '3', title: 'Практика', progress: 70, color: '#fab945' },
];

export const CourseProgress = () => {
	const theme = useTheme();
	const educationFullProgressData = {
		series: [49],

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
			// plotOptions: {
			// 	radialBar: {
			// 		startAngle: -135,
			// 		endAngle: 225,
			// 		hollow: {
			// 			margin: 0,
			// 			size: '60%',
			// 			background: theme.palette.background.paper,
			// 			image: undefined,
			// 			imageOffsetX: 0,
			// 			imageOffsetY: 0,
			// 			position: 'front',
			// 			dropShadow: {
			// 				enabled: true,
			// 				top: 3,
			// 				left: 0,
			// 				blur: 4,
			// 				opacity: 0.24,
			// 			},
			// 		},
			// 		track: {
			// 			background: '#fff',
			// 			strokeWidth: '47%',
			// 			margin: 0, // margin is in pixels
			// 			dropShadow: {
			// 				enabled: true,
			// 				top: -3,
			// 				left: 0,
			// 				blur: 4,
			// 				opacity: 0.35,
			// 			},
			// 		},

			// 		dataLabels: {
			// 			show: true,
			// 			name: {
			// 				offsetY: -10,
			// 				show: true,
			// 				color: theme.palette.primary.sub,
			// 				fontSize: '14px',
			// 			},
			// 			value: {
			// 				formatter: function (val) {
			// 					return `${parseInt(val)}%`;
			// 				},
			// 				color: theme.palette.primary.main,
			// 				fontSize: '24px',
			// 				show: true,
			// 			},
			// 		},
			// 	},
			// },
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
							formatter: function (val) {
								return val + '%';
							},
						},
					},
				},
			},
			// fill: {
			// 	type: 'gradient',
			// 	gradient: {
			// 		shade: 'dark',
			// 		type: 'horizontal',
			// 		shadeIntensity: 0.5,
			// 		gradientToColors: ['#ABE5A1'],
			// 		inverseColors: true,
			// 		opacityFrom: 1,
			// 		opacityTo: 1,
			// 		stops: [0, 100],
			// 	},
			// },
			// stroke: {
			// 	lineCap: 'round',
			// },
			labels: ['Завершено'],

			tooltip: {
				theme: theme.palette.mode,
			},
			xaxis: {
				labels: {
					style: {
						colors: theme.palette.primary.sub,
					},
				},
			},
			yaxis: {
				max: 100,
				labels: {
					style: {
						colors: theme.palette.primary.sub,
					},
				},
			},
			grid: {
				show: false,
			},
		},
	};
	return (
		<>
			<Paper sx={{ padding: '20px', borderRadius: '20px' }}>
				<Chart
					options={educationFullProgressData.options}
					series={educationFullProgressData.series}
					type='radialBar'
					width={'100%'}
					height={'250px'}
				/>
				{/* <Divider /> */}
				<Stack direction={'column'} spacing={3} sx={{ width: '100%', padding: '20px' }}>
					{educationSectionProgressData.map(el => {
						return (
							<React.Fragment key={el.id}>
								<EducationElementsProgress title={el.title} progress={el.progress} color={el.color} />
							</React.Fragment>
						);
					})}
				</Stack>
			</Paper>
		</>
	);
};
