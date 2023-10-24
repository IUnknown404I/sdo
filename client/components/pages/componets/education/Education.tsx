import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import { Box, Button, Chip, Grid, IconButton, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { SetStateAction, useEffect, useState } from 'react';
import { querySwitcher } from '../../../../utils/http';
import OnyxImage from '../../../basics/OnyxImage';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import {
	CourseProgress,
	CourseSectionsProgress,
	EducationEvaluations,
	EducationEvaluationsChart,
	EducationPlan,
} from '../../../index';
import OnyxLink from '../../../basics/OnyxLink';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

const TabPanel = (props: TabPanelProps) => {
	const { children, value, index, ...other } = props;

	return (
		<Box
			role='tabpanel'
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box>
					<Typography component={'span'}>{children}</Typography>
				</Box>
			)}
		</Box>
	);
};

const EDUCATION_QUARY_CASES = ['graph', 'progress', 'marks', 'mark-stats'];

export const Education = () => {
	const router = useRouter();
	const [position, setPosition] = useState(0);

	const handlePositionChange = (event: any, newPosition: SetStateAction<number>) => {
		router.replace(`study?current=${EDUCATION_QUARY_CASES[newPosition as number]}`);
		setPosition(() => newPosition as number);
	};

	useEffect(() => {
		const positionByQueryChange = querySwitcher('current', EDUCATION_QUARY_CASES, router.query);
		setPosition(() => (positionByQueryChange === undefined ? 0 : positionByQueryChange));
	}, [router.query]);

	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={12} lg={5} xl={4}>
				<Paper
					sx={{
						borderRadius: '20px',
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						padding: '20px',
					}}
				>
					<OnyxImage
						src='/images/courses/coursesCard/sizPreview.svg'
						alt='Education program label'
						width='130px'
						height='80px'
					/>

					<OnyxLink href='/courses/personal-protective-equipment' fullwidth style={{ marginInline: '.5rem' }}>
						<Button
							endIcon={<ExitToAppOutlinedIcon />}
							sx={{ borderRadius: '40px', width: '100%', height: '100%' }}
							color='primary'
							size='large'
						>
							Перейти к курсу
						</Button>
					</OnyxLink>

					<Stack direction={'row'}>
						<IconButton aria-label='left' size='large'>
							<ArrowBackIosOutlinedIcon />
						</IconButton>
						<IconButton aria-label='right' size='large'>
							<ArrowForwardIosOutlinedIcon />
						</IconButton>
					</Stack>
				</Paper>
			</Grid>

			<Grid item xs={12} md={12} lg={7} xl={8} sx={{ position: 'relative' }}>
				<Chip
					component='div'
					variant='filled'
					color='success'
					size='small'
					label='идет обучение'
					sx={{
						position: 'absolute',
						top: '20px',
						right: '0',
						padding: '10px',
					}}
				/>
				<OnyxTypography
					tpVariant='h6'
					tpWeight='bold'
					tpColor='inherit'
					tpSize='1.25rem'
					sx={{
						textAlign: { xs: 'center', lg: 'left' },
						marginBottom: { xs: '20px', lg: '0' },
						height: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						padding: '20px',
					}}
					text='Правила проведения входного контроля средств индивидуальной защиты'
				/>
			</Grid>

			<Grid item xs={12} md={12} lg={12}>
				<Tabs
					orientation='horizontal'
					variant='scrollable'
					scrollButtons
					allowScrollButtonsMobile
					value={position}
					onChange={handlePositionChange}
					aria-label='меню личного кабинета'
				>
					<Tab iconPosition='start' label='График' />
					<Tab iconPosition='start' label='Прогресс' />
					<Tab iconPosition='start' label='Оценки' />
					<Tab iconPosition='start' label='Статистика оценок' />
				</Tabs>
			</Grid>

			<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
				<TabPanel value={position} index={0}>
					<EducationPlan />
				</TabPanel>

				<TabPanel value={position} index={1}>
					<Grid container spacing={3}>
						<Grid item xs={12} md={12} lg={3}>
							<Stack direction='column' spacing={3}>
								<Typography variant='body1'>Общий прогресс</Typography>
								<CourseProgress />
							</Stack>
						</Grid>

						<Grid item xs={12} md={12} lg={9}>
							<Stack direction='column' spacing={3}>
								<Typography variant='body1'>Прогресс по темам / разделам</Typography>
								<CourseSectionsProgress />
							</Stack>
						</Grid>
					</Grid>
				</TabPanel>

				<TabPanel value={position} index={2}>
					<EducationEvaluations />
				</TabPanel>
				<TabPanel value={position} index={3}>
					<EducationEvaluationsChart />
				</TabPanel>
			</Grid>
		</Grid>
	);
};
