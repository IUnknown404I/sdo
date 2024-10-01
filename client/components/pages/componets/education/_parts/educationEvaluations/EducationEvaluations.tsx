import { Grid } from '@mui/material';
import React from 'react';
import { rtkApi } from '../../../../../../redux/api';
import { ProgressTestStatsItemType } from '../../../../../../redux/endpoints/courseProgressEnd';
import { EvaluationTable } from './EvaluationsTable';

export const EducationEvaluations = (props: { cpid?: string }) => {
	const [countAdminRuns, setCountAdminRuns] = React.useState<boolean>(false);

	const {
		data: examsStats,
		refetch,
		isFetching,
	} = rtkApi.useProgressExamsStatsQuery({ cpid: props.cpid || 'not-found', countAdminRuns });
	const parsedStats: undefined | (ProgressTestStatsItemType & { cid: string })[] = React.useMemo(
		() =>
			!!examsStats
				? examsStats.stats.map(stat => ({
						...stat,
						cid: examsStats.cid,
				  }))
				: undefined,
		[examsStats],
	);

	React.useEffect(() => {
		refetch();
	}, [props.cpid, countAdminRuns]);

	return (
		<Grid container>
			<Grid item xs={12} md={12} lg={12}>
				<EvaluationTable
					refreshStats={refetch}
					stats={isFetching ? undefined : parsedStats}
					adminRuns={{ state: countAdminRuns, setState: setCountAdminRuns }}
				/>
			</Grid>
		</Grid>
	);
};
