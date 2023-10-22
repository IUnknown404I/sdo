import { Grow, Paper, Stack, useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';
import OnyxImage from '../../../../../basics/OnyxImage';

const steps = ['Тема 1', 'Тема 2', 'Тема 3', 'Тема 4', 'Тема 5', 'Итоговая аттестация'];
const stepSection = [
	{
		id: '1',
		section: 'Тема 1',
		title: 'Общие сведения о средствах индивидуальной защиты',
		sectionMaterial: [
			{ id: '1', title: 'Теоретический материал', progress: 100 },
			{ id: '2', title: 'Вебинары', progress: 80 },
			{ id: '3', title: 'Самостоятельная работа', progress: 50 },
			{ id: '4', title: 'Тестирование', progress: 100 },
		],
	},
	{
		id: '2',
		section: 'Тема 2',
		title: 'Входной контроль при поставках средств индивидуальной защиты',
		sectionMaterial: [
			{ id: '1', title: 'Теоретический материал', progress: 80 },
			{ id: '2', title: 'Вебинары', progress: 90 },
			{ id: '3', title: 'Самостоятельная работа', progress: 40 },
			{ id: '4', title: 'Тестирование', progress: 0 },
		],
	},
	{
		id: '3',
		section: 'Тема 3',
		title: 'Требования к составу сопроводительной документации, упаковке и маркировке СИЗ ',
		sectionMaterial: [
			{ id: '1', title: 'Практическая работа', progress: 0 },
			{ id: '2', title: 'Тестирование', progress: 0 },
		],
	},
	{
		id: '4',
		section: 'Тема 4',
		title: 'Выявление нарушений при входном контроле СИЗ',
		sectionMaterial: [
			{ id: '1', title: 'Практическая работа', progress: 0 },
			{ id: '2', title: 'Тестирование', progress: 0 },
		],
	},
	{
		id: '5',
		section: 'Тема 5',
		title: 'Списание и утилизация средств индивидуальной защиты',
		sectionMaterial: [
			{ id: '1', title: 'Практическая работа', progress: 0 },
			{ id: '2', title: 'Тестирование', progress: 0 },
		],
	},
	{
		id: '6',
		section: 'Итоговая аттестация',
		title: 'Итоговая аттестация',
		sectionMaterial: [{ id: '1', title: 'Итоговая аттестация', progress: 0 }],
	},
];

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Box sx={{ width: '100%', mr: 1 }}>
				<LinearProgress variant='determinate' {...props} />
			</Box>
			<Box sx={{ minWidth: 35 }}>
				<Typography variant='body2' color='text.secondary'>{`${Math.round(props.value)}%`}</Typography>
			</Box>
		</Box>
	);
}

export const CourseSectionsProgress = () => {
	const theme = useTheme();
	const lessThanSmall = useMediaQuery(theme.breakpoints.down('sm'));
	const [activeStep, setActiveStep] = useState(0);
	const [completed, setCompleted] = useState<{
		[k: number]: boolean;
	}>({});

	const returnIconPath = (title: string): string => {
		let path;
		switch (title) {
			case 'Теоретический материал':
				path = '/icons/folder.svg';
				break;
			case 'Вебинары':
				path = '/icons/videos3.svg';
				break;
			case 'Самостоятельная работа':
				path = '/icons/selfWork3.svg';
				break;
			case 'Практическая работа':
				path = '/icons/caret.svg';
				break;
			case 'Тестирование':
				path = '/icons/tests.svg';
				break;
			case 'Итоговая аттестация':
				path = '/icons/finalTest.svg';
				break;
			default:
				path = '/icons/folder.svg';
				break;
		}
		return path;
	};
	const changeDirection = () => {
		if (lessThanSmall) {
			return 'vertical';
		} else {
			return 'horizontal';
		}
	};

	const totalSteps = () => {
		return steps.length;
	};

	const completedSteps = () => {
		return Object.keys(completed).length;
	};

	const isLastStep = () => {
		return activeStep === totalSteps() - 1;
	};

	const allStepsCompleted = () => {
		return completedSteps() === totalSteps();
	};

	const handleNext = () => {
		const newActiveStep =
			isLastStep() && !allStepsCompleted()
				? // It's the last step, but not all steps have been completed,
				  // find the first step that has been completed
				  steps.findIndex((step, i) => !(i in completed))
				: activeStep + 1;
		setActiveStep(newActiveStep);
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	const handleStep = (step: number) => () => {
		setActiveStep(step);
	};

	const handleComplete = () => {
		const newCompleted = completed;
		newCompleted[activeStep] = true;
		setCompleted(newCompleted);
		handleNext();
	};

	const handleReset = () => {
		setActiveStep(0);
		setCompleted({});
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Paper
				sx={{
					padding: '20px',
					borderRadius: '20px',
				}}
			>
				<Stepper orientation={changeDirection()} nonLinear activeStep={activeStep}>
					{stepSection.map((el, index) => (
						<Step key={el.id} completed={completed[index]}>
							<StepButton color='inherit' onClick={handleStep(index)}>
								{el.section}
							</StepButton>
						</Step>
					))}
				</Stepper>
			</Paper>
			<Box>
				{allStepsCompleted() ? (
					<>
						<Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
					</>
				) : (
					<>
						{stepSection.map(section => {
							return (
								<React.Fragment key={section.id}>
									{parseInt(section.id) === activeStep + 1 ? (
										<React.Fragment key={section.id}>
											<Grow
												in={true}
												style={{ transformOrigin: '0 0 0' }}
												{...(activeStep + 1 ? { timeout: 1000 } : {})}
											>
												<Box sx={{ marginY: '20px' }}>
													<Typography variant='body1' sx={{ marginY: '20px' }}>
														{section.title}
													</Typography>
													<Grid container spacing={3}>
														{section.sectionMaterial.map(el => {
															return (
																<React.Fragment key={el.id}>
																	<Grid item xs={12} md={12} lg={4}>
																		<Paper
																			sx={{
																				borderRadius: '10px',
																				padding: '20px',
																			}}
																		>
																			<Stack direction={'row'} spacing={3}>
																				<OnyxImage
																					src={returnIconPath(el.title)}
																					alt={el.title}
																					width='100px'
																					height='100px'
																				/>
																				<Stack
																					direction={'column'}
																					spacing={1}
																					sx={{
																						width: '100%',
																					}}
																				>
																					<Typography variant='body1'>
																						{el.title}
																					</Typography>
																					<Typography variant='caption'>
																						Процент завершения
																					</Typography>
																					<LinearProgressWithLabel
																						value={el.progress}
																					/>
																				</Stack>
																			</Stack>
																		</Paper>
																	</Grid>
																</React.Fragment>
															);
														})}
													</Grid>
												</Box>
											</Grow>
										</React.Fragment>
									) : null}
								</React.Fragment>
							);
						})}
						<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, height: '100%' }}>
							<Button
								color='primary'
								disabled={activeStep === 0}
								onClick={handleBack}
								sx={{ mr: 1, borderRadius: '30px', width: '150px' }}
								variant='outlined'
								size={'small'}
							>
								Назад
							</Button>
							<Box sx={{ flex: '1 1 auto' }} />
							<Button
								onClick={handleNext}
								variant='contained'
								sx={{ mr: 1, borderRadius: '30px', width: '150px' }}
								size={'small'}
							>
								Далее
							</Button>
							{/* {activeStep !== steps.length &&
								(completed[activeStep] ? (
									<Typography variant="caption" sx={{ display: 'inline-block' }}>
										Step {activeStep + 1} already completed
									</Typography>
								) : (
									<Button onClick={handleComplete}>
										{completedSteps() === totalSteps() - 1
											? 'Finish'
											: 'Complete Step'}
									</Button>
								))} */}
						</Box>
					</>
				)}
			</Box>
		</Box>
	);
};
