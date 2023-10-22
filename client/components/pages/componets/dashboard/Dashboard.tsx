import { Box, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { AwardsCard, EventCard, LevelCard, StatsCard, UserActivity, UserProgress } from '../../..';

const StatsDashboardElement = ({ iconPath, title, value }: { iconPath: string; title: string; value: number }) => {
	return (
		<Grid item xs={12} md={4} lg={4}>
			<StatsCard iconPath={iconPath} title={title} value={value} />
		</Grid>
	);
};

export const Dashboard = () => {
	return (
		<Grid container spacing={3}>
			<Grid item xs={12} lg={8} xl={8}>
				<Grid container spacing={3}>
					<StatsDashboardElement iconPath={'/icons/enrol.svg'} title={'Активных курсов'} value={1} />
					<StatsDashboardElement
						iconPath={'/icons/compete-courses.svg'}
						title={'Пройдено курсов'}
						value={2}
					/>
					<StatsDashboardElement iconPath={'/icons/trophy.svg'} title={'Набрано очков'} value={240} />

					<Grid item xs={12} md={12} lg={12}>
						<UserActivity />
						<Typography variant={'body1'} align='center' marginBottom='1rem' fontWeight='bold'>
							СОБЫТИЯ
						</Typography>
						<EventCard />
					</Grid>
				</Grid>
			</Grid>

			<Grid item xs={12} lg={4} xl={4}>
				<Stack direction={'column'} spacing={3}>
					<Paper sx={{ borderRadius: '20px' }}>
						<UserProgress />
					</Paper>

					<Box>
						<Typography
							variant={'body1'}
							align='center'
							marginTop='.5rem'
							marginBottom='1rem'
							fontWeight='bold'
						>
							УРОВЕНЬ И НАГРАДЫ
						</Typography>
						<LevelCard />
					</Box>

					<AwardsCard />
				</Stack>
			</Grid>
		</Grid>
	);
};
