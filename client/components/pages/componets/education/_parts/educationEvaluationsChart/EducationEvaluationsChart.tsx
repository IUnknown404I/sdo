import { useTheme } from '@mui/material';
import ru from 'apexcharts/dist/locales/ru.json';
import dynamic from 'next/dynamic';
import React from 'react';
import { rtkApi } from '../../../../../../redux/api';
import { ProgressTestStatsItemType } from '../../../../../../redux/endpoints/courseProgressEnd';
import { useTypedSelector } from '../../../../../../redux/hooks';
import { selectUser } from '../../../../../../redux/slices/user';
import OnyxSwitch from '../../../../../basics/OnyxSwitch';
import ClassicLoadersBlock from '../../../../../utils/loaders/ClassicLoadersBlock';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const EducationEvaluationsChart = ({ cpid }: { cpid?: string }) => {
	const theme = useTheme();
	const userData = useTypedSelector(selectUser);

	const [adminRuns, setAdminRuns] = React.useState<boolean>(false);
	const {
		data: examsStats,
		isFetching,
		refetch,
	} = rtkApi.useProgressExamsStatsQuery({ cpid: cpid || 'not-found', countAdminRuns: adminRuns });
	React.useEffect(() => {
		refetch();
	}, [cpid, adminRuns]);

	const educationFullProgressData = React.useMemo(() => {
		if (isFetching) return undefined;
		const parsedStats: undefined | (ProgressTestStatsItemType & { cid: string })[] = !!examsStats
			? examsStats.stats.map(stat => ({
					...stat,
					cid: examsStats.cid,
			  }))
			: undefined;
		return !parsedStats
			? undefined
			: {
					series: [
						{
							name: 'Тестирование',
							data: parsedStats.map(stat =>
								stat.finalMark === -1 || stat.testType === 'practice' ? 0 : stat.finalMark,
							),
						},
						{
							name: 'Практические задания',
							data: parsedStats.map(stat =>
								stat.finalMark === -1 || stat.testType === 'test' ? 0 : stat.finalMark,
							),
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
							enabled: true,
						},
						labels: parsedStats.map(stat => `Раздел ${stat.sectionOrderNumber}`),
						colors: ['#05e296', '#feb01a'],
						tooltip: {
							theme: theme.palette.mode,
						},
						yaxis: {
							min: 0,
							max: 5,
							tickAmount: 5,
							// labels: {
							// 	style: {
							// 		colors: theme.palette.primary.sub,
							// 	},
							// },
						},
						xaxis: {
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
	}, [examsStats, isFetching]);

	return !!educationFullProgressData ? (
		<>
			{userData._systemRole !== 'user' && (
				<OnyxSwitch
					state={adminRuns}
					setState={setAdminRuns}
					size='small'
					labelPlacement='end'
					label={adminRuns ? 'Попытки администратора учитываются' : 'Попытки администратора не учитываются'}
					sx={{ marginLeft: '1.5rem', marginBottom: '-1.25rem', position: 'relative', zIndex: 1 }}
				/>
			)}
			<Chart
				type='area'
				width='100%'
				height='500px'
				series={educationFullProgressData.series}
				options={educationFullProgressData.options}
			/>
		</>
	) : (
		<ClassicLoadersBlock loadersSize={50} />
	);
};
