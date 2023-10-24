import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Grow, InputAdornment, Pagination, Paper, Stack, TextField } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import useCoursesList from '../../../hooks/useCoursesList';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { scrollDocumentToTop } from '../../../utils/utilityFunctions';
import OnyxSelect from '../../basics/OnyxSelect';
import { OnyxTypography } from '../../basics/OnyxTypography';

const COUNT_PER_PAGE = 10;

const CoursesListPage = (props: { list: Pick<CoursesI, 'cid' | 'icon' | 'main'>[]; categories: string[] }) => {
	const [title, setTitle] = React.useState<string>('');
	const [category, setCategory] = React.useState<string>('Все категории');
	const [currentPage, setCurrentPage] = React.useState<number>(1);

	const courses = useCoursesList({
		list: props.list,
		categoryFilter: category,
		nameRegex: useDebouncedValue(title, 350)[0],
	});

	function getCourses(pageNumber: number): typeof props.list {
		if (pageNumber > Math.ceil(courses.length / COUNT_PER_PAGE) || pageNumber < 1) return [];
		return courses.slice((pageNumber - 1) * COUNT_PER_PAGE, pageNumber * COUNT_PER_PAGE);
	}

	function handlePaginationClick(_: React.ChangeEvent<any>, page: number) {
		setCurrentPage(page);
		scrollDocumentToTop();
	}

	React.useEffect(() => {
		if (currentPage > Math.ceil(courses.length / COUNT_PER_PAGE)) {
			setCurrentPage(1);
			scrollDocumentToTop();
		}
	}, [courses]);

	return (
		<>
			<Stack component='section' direction='column' gap={2} alignItems='center' justifyContent='center'>
				<Paper sx={{ width: '100%', padding: '.5rem', borderRadius: '10px' }}>
					<Stack
						alignItems='center'
						justifyContent='space-between'
						gap={2}
						sx={{ flexDirection: { xs: 'column', md: 'row' } }}
					>
						<TextField
							fullWidth
							size='medium'
							value={title}
							label='Введите название программы'
							inputProps={{ maxLength: 256 }}
							onChange={e => setTitle(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<SearchIcon /> Поиск
									</InputAdornment>
								),
							}}
						/>
						<Box sx={{ paddingRight: '.25rem', width: { xs: '100%', md: '50%' }, maxWidth: '100%' }}>
							<OnyxSelect
								fullwidth
								value={category}
								size='medium'
								setValue={e => setCategory(e.target.value as string)}
								listItems={['Все категории', ...props.categories]}
								itemsIndexes={['Все категории', ...props.categories]}
								disableEmptyOption
							/>
						</Box>
					</Stack>
				</Paper>

				<Stack component='section' direction='column' gap={2} className='courses-container' width='100%'>
					{getCourses(currentPage).map(course => (
						<CourseCard {...course} key={course.cid} />
					))}
				</Stack>
			</Stack>

			<Pagination
				size='large'
				color='primary'
				shape='rounded'
				variant='outlined'
				page={currentPage}
				onChange={handlePaginationClick}
				// count={Math.ceil(props.list.length / COUNT_PER_PAGE)}
				count={Math.ceil(courses.length / COUNT_PER_PAGE)}
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					gap: '1.25rem',
					margin: '1rem auto',
					'li > button': { borderRadius: '10px' },
				}}
			/>
		</>
	);
};

function CourseCard(course: Pick<CoursesI, 'cid' | 'icon' | 'main'>) {
	const [showState, setShowState] = React.useState<boolean>(true);

	React.useEffect(() => {
		const cardElement = document.querySelector(`.course-card-${course.cid}`);
		const containerElement = document.querySelector('.courses-container');
		if (!cardElement || !containerElement) return;

		const cardIntersectionObserver = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					console.log(entry);
					if (entry.isIntersecting) setShowState(true);
					else setShowState(false);
				});
			},
			{ root: document, threshold: 0.05 },
		);
		cardIntersectionObserver.observe(cardElement);

		return () => cardIntersectionObserver.disconnect();
	}, []);

	return (
		<Grow in={showState} timeout={1000}>
			{/* <Slide direction='left' in={showState} mountOnEnter unmountOnExit> */}
			<Paper
				className={`course-card-${course.cid}`}
				elevation={3}
				sx={{ width: '100%', padding: '1rem', borderRadius: '10px' }}
			>
				<Stack
					gap={2}
					width='100%'
					justifyContent='space-between'
					sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
				>
					<Box>
						<OnyxTypography text={`Категория: ${course.main.category}`} tpColor='secondary' tpSize='1rem' />
						<OnyxTypography
							text={`Тип программы: ${course.main.type.toLowerCase()}`}
							tpColor='secondary'
							tpSize='1rem'
						/>
						<OnyxTypography text={course.main.title} tpColor='primary' tpWeight='bold' tpSize='1.5rem' />

						<OnyxTypography text={course.main.description} tpSize='1.25rem' sx={{ margin: '.5rem 0' }} />

						<Stack direction='column' gap={1}>
							<OnyxTypography
								tpSize='1.1rem'
								sx={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}
							>
								<HistoryEduIcon color='primary' sx={{ fontSize: '1.85rem' }} /> Документ по завершении:{' '}
								{course.main.document}
							</OnyxTypography>
							<OnyxTypography
								tpSize='1.1rem'
								sx={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}
							>
								<CastForEducationIcon color='primary' sx={{ fontSize: '1.85rem' }} /> Формат обучения:{' '}
								{course.main.studyFormat}
							</OnyxTypography>
							<OnyxTypography
								tpSize='1.1rem'
								sx={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}
							>
								<HistoryToggleOffIcon color='primary' sx={{ fontSize: '1.85rem' }} /> Длительность
								обучения: {course.main.duration} ч.
							</OnyxTypography>
						</Stack>
					</Box>
					<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
						<Image src={course.icon} alt='course-icon' width={175} height={175} />
					</Box>
				</Stack>

				<Stack
					width='100%'
					justifyContent='center'
					alignItems='flex-end'
					sx={{ marginTop: { xs: '1rem', md: 'none' } }}
				>
					<Stack
						direction='row'
						sx={{
							width: { xs: '100%', md: 'fit-content' },
							flexWrap: { xs: 'wrap', sm: 'nowrap' },
						}}
						gap={1}
					>
						<OnyxTypography
							lkHref={`https://umcmrg.ru/courses/${course.cid}`}
							lkProps={{ target: '_blank' }}
							ttNode='Перейти к титульному листу'
							ttPlacement='bottom'
							boxWrapper
							sx={{ display: 'block' }}
						>
							<Button variant='outlined' sx={{ width: '100%', whiteSpace: 'nowrap' }}>
								Ознакомиться с программой
							</Button>
						</OnyxTypography>

						{course.cid === 'metrological-support' ? (
							<OnyxTypography lkHref={`courses/${course.cid}`} boxWrapper>
								<Button variant='outlined' sx={{ width: '100%', whiteSpace: 'nowrap' }}>
									Перейти к обучению
								</Button>
							</OnyxTypography>
						) : (
							<OnyxTypography
								ttNode='Вы не записаны на программу'
								ttPlacement='bottom'
								boxWrapper
								sx={{ display: { xs: 'none', md: 'block' } }}
							>
								<Button disabled variant='outlined' sx={{ width: '100%', whiteSpace: 'nowrap' }}>
									Перейти к обучению
								</Button>
							</OnyxTypography>
						)}
					</Stack>
				</Stack>
			</Paper>
		</Grow>
	);
}

export default CoursesListPage;

export interface CoursesI {
	cid: string;
	status: boolean;
	main: {
		title: string;
		category: string;
		type: string;
		description: string;
		previewScreenshot: string;
		duration: number;
		studyFormat: string;
		document: landingDocumentType;
	};
	icon: string;
}

export type landingDocumentType =
	| 'Удостоверение установленного образца'
	| 'Диплом о профессиональной переподготовке с приложением'
	| 'Свидетельство о профессии рабочего, должности служащего';
