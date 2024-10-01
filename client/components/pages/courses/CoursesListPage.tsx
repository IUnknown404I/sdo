import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import ContentPasteSearchOutlinedIcon from '@mui/icons-material/ContentPasteSearchOutlined';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import InfoIcon from '@mui/icons-material/Info';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import {
	Alert,
	Box,
	Button,
	Chip,
	Grow,
	IconButton,
	InputAdornment,
	Pagination,
	Paper,
	Stack,
	TextField,
	Tooltip,
} from '@mui/material';
import Image from 'next/image';
import React from 'react';
import useCoursesList, { UseCourseListReturnType } from '../../../hooks/useCoursesList';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { rtkApi } from '../../../redux/api';
import { useTypedSelector } from '../../../redux/hooks';
import { selectUser, SystemRolesOptions } from '../../../redux/slices/user';
import { scrollDocumentToTop } from '../../../utils/utilityFunctions';
import OnyxLink from '../../basics/OnyxLink';
import OnyxSelect from '../../basics/OnyxSelect';
import { OnyxTypography } from '../../basics/OnyxTypography';
import ClassicLoadersBlock from '../../utils/loaders/ClassicLoadersBlock';
import { CoursePublicPartI, CourseRolesTranslation } from './coursesTypes';

const COUNT_PER_PAGE = 10;
export type CourseAccessFilterType = 'any' | 'access' | 'deny';

interface ICoursesListPage {
	list: CoursePublicPartI[];
	categories: string[];
}

const CoursesListPage = (props: ICoursesListPage) => {
	const [title, setTitle] = React.useState<string>('');
	const [currentPage, setCurrentPage] = React.useState<number>(1);
	const [category, setCategory] = React.useState<string>('Все категории');
	const [accessFilter, setAccessFilter] = React.useState<CourseAccessFilterType>('any');

	const {
		data: myProgresses,
		isFetching: isProgressFetching,
		isError: isProgressFetchingError,
	} = rtkApi.useMyProgressesQuery('');

	const courses = useCoursesList<(typeof props.list)[number]>({
		list: props.list,
		progressList: myProgresses,
		categoryFilter: category,
		nameRegex: useDebouncedValue(title, 350)[0],
		accessFilter,
	});

	function getCourses(pageNumber: number): ReturnType<typeof useCoursesList> {
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
							size='small'
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
						<Box sx={{ paddingRight: '.25rem', width: { xs: '100%', md: '25%' }, maxWidth: '100%' }}>
							<OnyxSelect
								fullwidth
								size='small'
								value={accessFilter}
								setValue={e => setAccessFilter(e.target.value as CourseAccessFilterType)}
								listItems={['Все программы', 'Есть доступ', 'Нет доступа']}
								itemsIndexes={['any', 'access', 'deny']}
								disableEmptyOption
							/>
						</Box>
						<Box sx={{ paddingRight: '.25rem', width: { xs: '100%', md: '25%' }, maxWidth: '100%' }}>
							<OnyxSelect
								fullwidth
								size='small'
								value={category}
								setValue={e => setCategory(e.target.value as string)}
								listItems={['Все категории', ...props.categories]}
								itemsIndexes={['Все категории', ...props.categories]}
								disableEmptyOption
							/>
						</Box>
					</Stack>
				</Paper>

				<Stack component='section' direction='column' gap={2} className='courses-container' width='100%'>
					{accessFilter !== 'any' && isProgressFetchingError && (
						<Alert
							severity='warning'
							sx={{ marginTop: '.5rem', width: 'fit-content', marginInline: 'auto' }}
						>
							<OnyxTypography text='Не удалось получить данный о текущих и завершенных курсах! Попробуйте обновить страницу или вернуться на неё позже.' />
						</Alert>
					)}

					{accessFilter !== 'any' && isProgressFetching ? (
						<ClassicLoadersBlock />
					) : getCourses(currentPage).length > 0 ? (
						getCourses(currentPage).map(course => <CourseCard {...course} key={course.cid} />)
					) : (
						<Stack
							width='100%'
							direction='row'
							alignItems='center'
							justifyContent='center'
							gap={1.5}
							sx={{
								color: '#006fba',
								margin: '3rem 0',
								fontWeight: 'bold',
								fontSize: '1.25rem',
								svg: { fontSize: '2.75rem' },
							}}
						>
							<ContentPasteSearchOutlinedIcon /> Не удалось найти образовательные программы с
							установленными фильтрами!
						</Stack>
					)}
				</Stack>
			</Stack>

			<Pagination
				size='large'
				color='primary'
				shape='rounded'
				variant='outlined'
				page={currentPage}
				onChange={handlePaginationClick}
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

function CourseCard(course: UseCourseListReturnType<Pick<CoursePublicPartI, 'cid' | 'icon' | 'main'>>) {
	const userData = useTypedSelector(selectUser);
	const [showState, setShowState] = React.useState<boolean>(true);

	React.useEffect(() => {
		const cardElement = document.querySelector(`.course-card-${course.cid}`);
		const containerElement = document.querySelector('.courses-container');
		if (!cardElement || !containerElement) return;

		const cardIntersectionObserver = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
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
						{!!course.roles?.length && (
							<Stack
								width='100%'
								direction='row'
								alignItems='center'
								justifyContent='flex-start'
								marginBottom='.15rem'
								gap={0.5}
							>
								{course.roles.map((role, index) => (
									<Chip
										key={role + index}
										label={CourseRolesTranslation[role]}
										size='small'
										variant='filled'
										color={
											role === 'student'
												? 'success'
												: role === 'teacher'
												? 'warning'
												: role === 'content_maker'
												? 'primary'
												: 'error'
										}
										sx={{ paddingInline: '.75rem' }}
									/>
								))}
							</Stack>
						)}
						<OnyxTypography text={`Категория: ${course.main.category}`} tpColor='secondary' tpSize='1rem' />
						<OnyxTypography
							text={`Тип программы: ${course.main.type.toLowerCase()}`}
							tpColor='secondary'
							tpSize='1rem'
						/>
						<OnyxTypography text={course.main.title} tpColor='primary' tpWeight='bold' tpSize='1.5rem' />

						<OnyxTypography text={course.main.description} tpSize='1.25rem' sx={{ margin: '.5rem 0' }} />

						<Stack
							direction='column'
							gap={1}
							sx={{
								'> p': { display: 'flex', alignItems: 'center', gap: '.5rem' },
								svg: { fontSize: '1.85rem' },
							}}
						>
							<OnyxTypography tpSize='1.1rem'>
								<HistoryToggleOffIcon color='primary' /> Длительность обучения: {course.main.duration}
								ч.
							</OnyxTypography>
							<OnyxTypography tpSize='1.1rem'>
								<CastForEducationIcon color='primary' /> Формат обучения: {course.main.studyFormat}
							</OnyxTypography>
							<OnyxTypography tpSize='1.1rem'>
								<HistoryEduIcon color='primary' /> Документ по завершении:
								<OnyxTypography
									ttArrow
									ttPlacement='top'
									ttNode='Посмотреть документ'
									text={course.main.document}
									tpSize='inherit'
									lkHref={
										course.main.document === 'Удостоверение установленного образца'
											? 'https://umcmrg.ru/documents/papers/Удостоверение%20о%20повышении%20квалификации.pdf'
											: course.main.document ===
											  'Диплом о профессиональной переподготовке с приложением'
											? 'https://umcmrg.ru/documents/papers/recval.png'
											: 'https://umcmrg.ru/documents/papers/профессия_шаблон.png'
									}
									lkProps={{ target: '_blank' }}
								/>
							</OnyxTypography>
						</Stack>
					</Box>
					<Box sx={{ display: { xs: 'none', md: 'block' } }}>
						<Image src={course.icon} alt='course-icon' width={175} height={175} />
					</Box>
				</Stack>

				<Stack
					width='100%'
					alignItems='center'
					flexDirection='row'
					justifyContent='space-between'
					sx={{ marginTop: { xs: '1rem', md: 'none' } }}
					gap={1.25}
				>
					<Stack
						direction='row'
						sx={{
							button: {
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								border: theme => `1px solid ${theme.palette.warning.main}`,
								a: { height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
								svg: { fontSize: '1.25rem' },
							},
						}}
						gap={1}
					>
						{SystemRolesOptions[userData._systemRole].accessLevel > 3 && (
							<>
								<OnyxLink href={`/admin-courses/${course.cid}`}>
									<Tooltip arrow title='Настройки курса' placement='bottom'>
										<IconButton size='small' color='warning'>
											<SettingsIcon />
										</IconButton>
									</Tooltip>
								</OnyxLink>
								<OnyxLink href={`/admin-courses/${course.cid}/groups`}>
									<Tooltip arrow title='Настройка зачислений групп' placement='bottom'>
										<IconButton size='small' color='warning'>
											<ManageAccountsIcon />
										</IconButton>
									</Tooltip>
								</OnyxLink>
								<OnyxLink href={`/admin-courses/${course.cid}/sections`}>
									<Tooltip arrow title='Управление разделами программы' placement='bottom'>
										<IconButton size='small' color='warning'>
											<AutoAwesomeMotionIcon />
										</IconButton>
									</Tooltip>
								</OnyxLink>
							</>
						)}
					</Stack>

					<Stack
						direction='row'
						sx={{
							flexWrap: { xs: 'wrap', sm: 'nowrap' },
							width: { xs: '100%', md: 'fit-content' },
							button: {
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								flexGrow: 1,
								gap: '.25rem',
							},
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
								<InfoIcon sx={{ fontSize: '1.35rem' }} /> Ознакомиться с программой
							</Button>
						</OnyxTypography>

						<OnyxLink href={`courses/${course.cid}`} disabled={!course.accessible}>
							<OnyxTypography
								boxWrapper
								ttNode={!!course.accessible ? undefined : 'Вы не записаны на программу'}
								ttPlacement={!!course.accessible ? undefined : 'bottom'}
								sx={
									!!course.accessible
										? { width: '100%', whiteSpace: 'nowrap' }
										: { display: { xs: 'none', md: 'block' }, cursor: 'not-allowed !important' }
								}
							>
								<Button
									disabled={!course.accessible}
									color={!!course.accessible ? 'success' : undefined}
									variant={!!course.accessible ? 'contained' : 'outlined'}
									sx={{ width: '100%', whiteSpace: 'nowrap' }}
								>
									Перейти к обучению <ArrowRightIcon sx={{ fontSize: '1.65rem' }} />
								</Button>
							</OnyxTypography>
						</OnyxLink>
					</Stack>
				</Stack>
			</Paper>
		</Grow>
	);
}

export default CoursesListPage;
