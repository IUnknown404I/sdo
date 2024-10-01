import { Box, Divider, Paper, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { UserProgress } from '../../..';
import { rtkApi } from '../../../../redux/api';
import OnyxImage from '../../../basics/OnyxImage';
import OnyxLink from '../../../basics/OnyxLink';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import ClassicLoader from '../../../utils/loaders/ClassicLoader';
import AwardsCard from './_parts/awardsCard/AwardsCard';
import EventCards from './_parts/eventCard/EventCard';
import LevelCard from './_parts/levelCard/LevelCard';
import UserActivity from './_parts/userActivity/UserActivity';

const Dashboard = () => {
	const { currentData: userLoyality } = rtkApi.useUserLoyalityQuery();
	const { data: myProgresses, isFetching: isProgressFetching } = rtkApi.useMyProgressesQuery('');

	return (
		<Grid container spacing={3}>
			<Grid item xs={12} lg={8} xl={8}>
				<Grid container spacing={3}>
					<StatsDashboardElement
						value={
							myProgresses?.filter(progress => progress.status === 'active' && !!progress.lgid).length ||
							0
						}
						isLoading={isProgressFetching}
						title='Активных курсов'
						iconPath='/icons/enrol.svg'
						href='/account/courses?current=in-progress'
					/>

					<StatsDashboardElement
						value={
							myProgresses?.filter(progress => progress.status === 'finished' && !!progress.lgid)
								.length || 0
						}
						isLoading={isProgressFetching}
						title='Пройдено курсов'
						iconPath='/icons/compete-courses.svg'
						href='/account/courses?current=completed-courses'
					/>

					<StatsDashboardElement
						isLoading={!userLoyality}
						value={userLoyality?.coins || 0}
						title='Набрано монет'
						iconPath='/icons/trophy.svg'
						href='/account/awards'
					/>

					<Grid item xs={12} md={12} lg={12} sx={{ marginTop: '.25rem' }}>
						<UserActivity />
						<OnyxTypography
							text='СОБЫТИЯ'
							tpWeight='bold'
							tpAlign='center'
							tpSize='1.25rem'
							tpVariant='body1'
							sx={{ textTransform: 'uppercase' }}
						/>
						<EventCards sx={{ marginTop: '1.25rem' }} />
					</Grid>
				</Grid>
			</Grid>

			<Grid item xs={12} lg={4} xl={4}>
				<Stack direction='column' spacing={3}>
					<Paper sx={{ borderRadius: '20px' }}>
						<UserProgress />
					</Paper>

					<Box>
						<OnyxTypography
							text='УРОВЕНЬ И НАГРАДЫ'
							tpWeight='bold'
							tpAlign='center'
							tpSize='1.25rem'
							tpVariant='body1'
							sx={{ textTransform: 'uppercase', marginBottom: '1rem' }}
						/>
						<LevelCard />
					</Box>

					<AwardsCard />
				</Stack>
			</Grid>
		</Grid>
	);
};

export default Dashboard;

interface StatsDashboardElementI {
	iconPath: string;
	title: string;
	value: number;
	isLoading?: boolean;
	href?: string;
}

function StatsDashboardElement(payload: StatsDashboardElementI) {
	return (
		<Grid item xs={12} md={4} lg={4}>
			<StatsCard
				title={payload.title}
				iconPath={payload.iconPath}
				value={!payload.isLoading ? payload.value : <ClassicLoader />}
				href={payload.href}
			/>
		</Grid>
	);
}

interface StatsCardI {
	iconPath: string;
	title: string;
	value: React.ReactNode;
	href?: string;
}

function StatsCard({ iconPath, title, value, href }: StatsCardI) {
	const Element = (
		<Paper sx={{ padding: '5px', borderRadius: '20px' }}>
			<Stack direction='row' justifyContent='space-around' alignItems='center'>
				<OnyxImage
					alt={title}
					src={iconPath}
					sx={{
						width: {
							xs: '90px',
							md: '90px',
							lg: '70px',
							xl: '90px',
						},
						height: {
							xs: '60px',
							md: '70px',
							lg: '60px',
							xl: '70px',
						},
						padding: '10px',
						borderRadius: '15px',
					}}
				/>
				<Divider sx={{ paddingY: '30px' }} orientation='vertical' />

				<Stack
					direction='column'
					alignItems='center'
					justifyContent='center'
					sx={{ padding: '15px 10px' }}
					spacing={0.5}
				>
					<OnyxTypography component='span' tpSize='.85rem' text={title} sx={{ textTransform: 'uppercase' }} />
					<OnyxTypography tpSize='1.75rem' tpWeight='bold'>
						{value}
					</OnyxTypography>
				</Stack>
			</Stack>
		</Paper>
	);

	return !!href ? <OnyxLink href={href}>{Element}</OnyxLink> : Element;
}
