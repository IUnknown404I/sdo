import StartOutlinedIcon from '@mui/icons-material/StartOutlined';
import { Box, Grid, Grow, Paper, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { useWindowDimensions } from '../../../hooks/useWindowDimensions';
import { checkSectionAvailability } from '../../../layout/CoursesLayout';
import { rtkApi } from '../../../redux/api';
import ClassicLoadersBlock from '../../utils/loaders/ClassicLoadersBlock';
import { CourseI } from './coursesTypes';
import MainPageCourseHeader from './mainpage-elements/MainPageCourseHeader';
import MainPageCourseSectionContent from './mainpage-elements/MainPageCourseSectionContent';
import MainPageSectionCard from './mainpage-elements/MainPageSectionCard';

const CourseMainPage = (props: { courseData: CourseI }) => {
	const router = useRouter();
	const windowDimensions = useWindowDimensions();

	const [activeSection, setActiveSection] = React.useState<number>(
		!!windowDimensions?.clientWidth && windowDimensions.clientWidth < 1200 ? 0 : 1,
	);

	const { data: currentProgressData, isLoading } = rtkApi.useCurrentCourseProgressQuery(
		(router.query.cid as string) || '',
	);

	function handleSectionsScroll(down: boolean = true) {
		const sectionsContainer = document?.querySelector('.sections-container');
		if (!sectionsContainer) return;

		sectionsContainer.scrollBy({ behavior: 'smooth', top: down ? 167 : -167 });
	}

	React.useEffect(() => {
		if (!windowDimensions) return;
		if (windowDimensions.clientWidth < 1200 && activeSection !== 0) setActiveSection(0);
		else if (windowDimensions.clientWidth >= 1200 && activeSection === 0) setActiveSection(1);
	}, [windowDimensions]);

	return (
		<Stack component='section' width='100%' height='100%' direction='column' gap={2}>
			<MainPageCourseHeader
				type={props.courseData?.main?.type || ''}
				title={props.courseData?.main?.title || 'Главная страница курса'}
				duration={props.courseData?.main?.duration}
			/>

			<Grid
				container
				component='section'
				columnSpacing={1}
				rowGap={1}
				sx={{
					marginTop: '.25rem',
					minHeight:
						props.courseData?.main?.title && (props.courseData.main.title as string).length > 85
							? 'calc(100vh - 300px)'
							: 'calc(100vh - 250px)',
				}}
			>
				<Grow in timeout={450}>
					<Grid
						className='sections-container'
						item
						xs={12}
						lg={5}
						sx={{
							position: 'relative',
							display: 'flex',
							direction: 'rtl',
							overflow: 'auto',
							flexDirection: 'row',
							gap: '.25rem',
							transition: 'all .25s ease-out',
						}}
						maxHeight={{ xs: 'unset', lg: `calc(${140 * 4}px + ${28 * 4}px)` }}
					>
						{props.courseData.sections.length > 4 &&
							!!windowDimensions &&
							windowDimensions.clientWidth >= 1200 && (
								<Stack
									flexDirection='column'
									justifyContent='space-between'
									alignItems='center'
									sx={{
										position: 'sticky',
										top: '0',
										right: '0',
										bottom: '.5rem',
										svg: {
											color: theme => theme.palette.primary.main,
											transition: 'all .15s ease-out',
											cursor: 'pointer',
											'&:hover': {
												color: theme => theme.palette.primary.dark,
											},
										},
									}}
								>
									<StartOutlinedIcon
										sx={{ transform: 'rotate(-90deg)' }}
										onClick={() => handleSectionsScroll(false)}
									/>
									<StartOutlinedIcon
										sx={{ transform: 'rotate(90deg)' }}
										onClick={() => handleSectionsScroll()}
									/>
								</Stack>
							)}

						<Paper
							sx={{
								width: '100%',
								borderRadius: '15px',
								backgroundColor: theme => (theme.palette.mode === 'light' ? '#edeff1' : ''),
								padding: '.5rem !important',
								height: 'fit-content',
								direction: 'ltr',
							}}
						>
							<Stack
								position='relative'
								direction='column'
								width='100%'
								gap='10px'
								zIndex={1}
								sx={{
									transition: 'all .25s ease-out',
									minHeight: isLoading ? '500px' : '',
									alignItems: isLoading ? 'center' : '',
									justyfyContent: isLoading ? 'center' : '',
								}}
							>
								{isLoading ? (
									<ClassicLoadersBlock />
								) : (
									<>
										{props.courseData.sections
											.toSorted((a, b) => a.orderNumber - b.orderNumber)
											.map(section => {
												const accessible = checkSectionAvailability(
													section.csid,
													currentProgressData?.restrictments,
												);
												return (
													<MainPageSectionCard
														key={section.csid}
														disabled={!accessible}
														orderNumber={section.orderNumber}
														description={section.title}
														iconUrl={section.background?.backgroundIcon}
														patternUrl={section.background?.backgroundPattern}
														from={
															currentProgressData?.restrictments?.sections[section.csid]
																?.availableFrom
														}
														to={
															currentProgressData?.restrictments?.sections[section.csid]
																?.availableTo
														}
														onClick={setActiveSection}
													/>
												);
											})}

										<Box
											sx={{
												position: 'absolute',
												width: '100%',
												transform: `translateY(${
													((activeSection || 1) - 1) * 140 + ((activeSection || 1) - 1) * 26
												}px)`,
												opacity: activeSection === 0 ? '0' : '1',
												height: 'calc(140px + 1rem)',
												backgroundColor: 'rgba(54, 142, 232, .25)',
												borderRadius: '15px',
												zIndex: '0',
												transition: 'all .25s ease-out',
											}}
										/>
									</>
								)}
							</Stack>
						</Paper>
					</Grid>
				</Grow>

				<Grid item xs={12} lg={7} sx={{ position: 'relative' }}>
					{props.courseData.sections.map(section => (
						<MainPageCourseSectionContent
							key={section.csid}
							csid={section.csid}
							active={activeSection === section.orderNumber}
							setActive={setActiveSection}
							sectionUrl={`${section.csid}`}
							sectionOrder={section.orderNumber}
							title={section.title}
							iconUrl={section.background?.backgroundIcon}
							patternUrl={section.background?.backgroundPattern}
							duration={section.duration}
							contentTypes={section.contentTypes}
							progress={{
								current: !!currentProgressData
									? currentProgressData.data.progress[section.csid].filter(
											item => item.visited === true,
									  ).length
									: 0,
								total: !!currentProgressData
									? currentProgressData.data.progress[section.csid].length
									: 0,
							}}
						/>
					))}
				</Grid>
			</Grid>
		</Stack>
	);
};

export default CourseMainPage;
