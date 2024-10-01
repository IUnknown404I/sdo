import ExtensionOffTwoToneIcon from '@mui/icons-material/ExtensionOffTwoTone';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import { Chip, Grow, Paper, Skeleton, Stack, useMediaQuery, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Stepper from '@mui/material/Stepper';
import React, { useState } from 'react';
import { checkSectionAvailability } from '../../../../../../layout/CoursesLayout';
import {
	ProgressStatsOptions,
	UserStatsByProgressForSectionType,
} from '../../../../../../redux/endpoints/courseProgressEnd';
import { useTypedSelector } from '../../../../../../redux/hooks';
import { selectUser } from '../../../../../../redux/slices/user';
import { formatDate } from '../../../../../../utils/date-utils';
import OnyxImage from '../../../../../basics/OnyxImage';
import { OnyxTypography } from '../../../../../basics/OnyxTypography';
import { LocalGroupRestrictmentsType } from '../../../../courses/coursesTypes';

export const CourseSectionsProgress = (props: {
	cid?: string;
	sectionStats?: UserStatsByProgressForSectionType[];
	restrictments?: Omit<LocalGroupRestrictmentsType, 'meta'>;
}) => {
	const theme = useTheme();
	const userData = useTypedSelector(selectUser);
	const lessThanSmall = useMediaQuery(theme.breakpoints.down('sm'));

	const [activeStep, setActiveStep] = useState<number>(0);

	const handleStepChange = (step: number) => () => {
		if (!props.sectionStats?.length || step < 0 || step > props.sectionStats.length - 1) return;
		setActiveStep(step);
	};

	const isCompletedSection = (sectionIndex: number): boolean => {
		if (
			!props.sectionStats?.length ||
			!props.sectionStats[sectionIndex] ||
			Object.keys(props.sectionStats[sectionIndex])?.length <= 2
		)
			return false;
		let flag = true;
		for (const attr in props.sectionStats[sectionIndex]) {
			if (attr === 'title' || attr === 'csid') continue;
			if ((props.sectionStats[sectionIndex][attr as keyof (typeof props.sectionStats)[number]] as number) < 100) {
				flag = false;
				break;
			}
		}
		return flag;
	};

	if (!props.sectionStats?.length) return <CourseSectionsSkeleton />;
	return (
		<Stack width='100%' gap={2} sx={{ width: '100%' }}>
			<Paper
				sx={{ padding: '1.25rem .5rem', borderRadius: '20px', paddingInline: { xs: '1.25rem', sm: 'unset' } }}
			>
				<Stepper nonLinear activeStep={activeStep} orientation={lessThanSmall ? 'vertical' : 'horizontal'}>
					{props.sectionStats.map((section, index, arr) => (
						<Step
							key={section.csid}
							sx={{
								span: activeStep === index ? { fontWeight: 'bold !important' } : {},
								svg: isCompletedSection(index)
									? { color: theme => `${theme.palette.success.main} !important` }
									: {},
							}}
						>
							<StepButton
								color='inherit'
								onClick={handleStepChange(index)}
								sx={{ display: { xs: 'block', sm: '' } }}
							>
								<OnyxTypography
									// component='span'
									text={index === arr.length - 1 ? `Финальный раздел` : `Раздел ${index + 1}`}
									sx={{ textAlign: 'center', width: '100%' }}
								/>
							</StepButton>
						</Step>
					))}
				</Stepper>
			</Paper>

			<Stack width='100%' gap={3}>
				<>
					{props.sectionStats.map((stats, index) => (
						<Grow
							timeout={750}
							key={stats.csid}
							in={activeStep === index}
							style={{ display: activeStep === index ? '' : 'none', transformOrigin: '0 0 0' }}
						>
							<Stack width='100%' gap={2}>
								<ProgressSectionHeader sectionIndex={index} sectionStats={stats} />

								<Grid container spacing={3}>
									{Object.keys(stats).filter(attr => attr !== 'title' && attr !== 'csid')?.length ? (
										Object.keys(stats)
											.filter(attr => attr !== 'title' && attr !== 'csid')
											.map((option, index) => (
												<Grid key={index} item xs={12} md={12} lg={4}>
													<Paper
														sx={{
															display: 'flex',
															flexDirection: 'row',
															borderRadius: '10px',
															padding: '1rem',
															gap: '1rem',
														}}
													>
														<OnyxImage
															src={
																ProgressStatsOptions[
																	option as keyof typeof ProgressStatsOptions
																].svgPath
															}
															alt='Stats type icon'
															width='100px'
															height='100px'
														/>

														<Stack width='100%' direction='column' gap={0.25}>
															<OnyxTypography
																tpSize='1.05rem'
																text={
																	ProgressStatsOptions[
																		option as keyof typeof ProgressStatsOptions
																	].translation
																}
																sx={{ marginBottom: '.5rem' }}
															/>
															<OnyxTypography text='Процент изучения' tpSize='.85rem' />
															<LinearProgressWithLabel
																value={stats[option as keyof typeof stats] as number}
															/>
														</Stack>
													</Paper>
												</Grid>
											))
									) : (
										<Stack
											width='100%'
											direction='row'
											minHeight='200px'
											alignItems='center'
											justifyContent='center'
											gap={1.5}
											sx={{
												svg: { fontSize: '2.75rem' },
												color: theme => ' ' || theme.palette.primary.main,
											}}
										>
											<ExtensionOffTwoToneIcon color='primary' /> Данный раздел пока что не
											содержит отслеживаемых элементов!
										</Stack>
									)}
								</Grid>
							</Stack>
						</Grow>
					))}

					<Stack width='100%' direction='row' alignItems='center' justifyContent='space-between' gap={1}>
						<Button
							size='small'
							color='primary'
							variant='outlined'
							disabled={activeStep === 0}
							onClick={() => setActiveStep(prev => prev - 1)}
							sx={{ mr: 1, borderRadius: '30px', paddingInline: '3.5rem' }}
						>
							Назад
						</Button>

						<Button
							size='small'
							variant='contained'
							disabled={activeStep === props.sectionStats.length - 1}
							onClick={() => setActiveStep(prev => prev + 1)}
							sx={{ mr: 1, borderRadius: '30px', paddingInline: '3.5rem' }}
						>
							Далее
						</Button>
					</Stack>
				</>
			</Stack>
		</Stack>
	);

	function ProgressSectionHeader({
		sectionIndex,
		sectionStats,
	}: {
		sectionIndex: number;
		sectionStats: UserStatsByProgressForSectionType;
	}) {
		const now = +new Date();
		const isAvailable =
			userData._systemRole !== 'user' || !props.restrictments
				? true
				: checkSectionAvailability(sectionStats.csid, props.restrictments);

		const restrictmentsText = React.useMemo<string>(() => {
			const sectionRestrictments = !!props.restrictments?.sections
				? props.restrictments.sections[sectionStats.csid]
				: undefined;
			const startWords =
				!!sectionRestrictments && (!!sectionRestrictments.availableFrom || !!sectionRestrictments.availableTo)
					? `${
							!!sectionRestrictments.availableTo && sectionRestrictments.availableTo < now
								? 'было доступно '
								: 'доступно '
					  }`
					: '';
			return (
				startWords +
				(!!sectionRestrictments && (!!sectionRestrictments.availableFrom || !!sectionRestrictments.availableTo)
					? `${
							!startWords.includes('было доступно') && sectionRestrictments.availableFrom
								? 'c ' +
								  formatDate(new Date(sectionRestrictments.availableFrom), { mode: 'full_short' })
								: ''
					  }${
							!startWords.includes('было доступно') &&
							!!sectionRestrictments.availableFrom &&
							!!sectionRestrictments.availableTo
								? ' - '
								: ''
					  }${
							sectionRestrictments.availableTo
								? 'по ' + formatDate(new Date(sectionRestrictments.availableTo), { mode: 'full_short' })
								: ''
					  }`
					: '')
			);
		}, [props.restrictments]);

		function DatesAlertChip() {
			return (
				<Chip
					size='small'
					variant='outlined'
					color={
						(!!props.restrictments?.startDate && props.restrictments?.startDate > now) ||
						(!!props.restrictments?.endDate && props.restrictments?.endDate <= now)
							? 'error'
							: 'warning'
					}
					label={
						!!restrictmentsText
							? restrictmentsText
							: !!props.restrictments?.startDate && props.restrictments?.startDate > now
							? 'обучение ещё не началось'
							: 'обучение уже завершилось'
					}
					sx={{ paddingInline: '.15rem', fontSize: '.85rem', fontWeight: 'normal' }}
				/>
			);
		}

		function ProgressSectionTitle() {
			return isAvailable ? (
				<OnyxTypography
					ttArrow
					boxWrapper
					component='div'
					tpSize='1.15rem'
					tpWeight='bold'
					ttPlacement='top'
					ttNode={props.cid ? 'Перейти к разделу программы' : undefined}
					lkHref={props.cid ? `/courses/${props.cid}/${sectionStats.csid}` : undefined}
					sx={{
						width: 'fit-content',
						svg: { fontSize: '1rem', marginLeft: '.25rem', transform: 'translateY(-5px)' },
					}}
				>
					{sectionStats.title}
					<LaunchTwoToneIcon />
					{!!restrictmentsText && (
						<>
							{' '}
							<DatesAlertChip />
						</>
					)}
				</OnyxTypography>
			) : (
				<OnyxTypography component='div' tpSize='1.15rem' tpWeight='bold' sx={{ width: 'fit-content' }}>
					{sectionStats.title} <DatesAlertChip />
				</OnyxTypography>
			);
		}

		if (typeof sectionIndex !== 'number' || !sectionStats) return null;
		return isCompletedSection(sectionIndex) ? (
			<Stack
				width='100%'
				alignItems='flex-start'
				sx={{
					flexDirection: { xs: 'column-reverse', sm: 'row' },
					gap: { xs: '.15rem', sm: '1.5rem' },
				}}
			>
				<ProgressSectionTitle />
				<Chip
					size='small'
					color='success'
					variant='outlined'
					label='раздел изучен'
					sx={{ paddingInline: '1rem', display: { xs: 'non !important', md: '' } }}
				/>
			</Stack>
		) : (
			<ProgressSectionTitle />
		);
	}
};

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
	return (
		<Stack direction='row' width='100%' alignItems='center' gap={1}>
			<LinearProgress variant='determinate' sx={{ width: '100%' }} {...props} />
			<OnyxTypography component='span' tpColor='text.secondary'>{`${Math.round(props.value)}%`}</OnyxTypography>
		</Stack>
	);
}

function CourseSectionsSkeleton() {
	return (
		<Stack width='100%' gap={1}>
			<Skeleton variant='text' width='150px' />
			<Skeleton variant='rounded' width='100%' height={75} />
			<Skeleton variant='text' width='250px' />

			<Stack width='100%' direction='row' justifyContent='flex-start' gap={1.5}>
				<Skeleton variant='rounded' width='30%' height={125} />
				<Skeleton variant='rounded' width='30%' height={125} />
				<Skeleton variant='rounded' width='30%' height={125} />
			</Stack>
			<Stack width='100%' direction='row' justifyContent='flex-start' gap={1.5}>
				<Skeleton variant='rounded' width='30%' height={150} />
				<Skeleton variant='rounded' width='30%' height={150} />
			</Stack>

			<Stack width='100%' direction='row' alignItems='center' justifyContent='space-between' gap={1}>
				<Skeleton variant='rounded' width={125} height={35} />
				<Skeleton variant='rounded' width={125} height={35} />
			</Stack>
		</Stack>
	);
}
