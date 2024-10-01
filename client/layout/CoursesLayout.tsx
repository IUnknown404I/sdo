import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import SchoolIcon from '@mui/icons-material/School';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SupportOutlinedIcon from '@mui/icons-material/SupportOutlined';
import { Button, Divider, List, useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Footer, Header, LogoGMI } from '../components';
import OnyxBreacrumbs from '../components/basics/OnyxBreadcrumbs';
import OnyxRangeInput from '../components/basics/OnyxRangeInput';
import { OnyxTypography } from '../components/basics/OnyxTypography';
import { SideListItem } from '../components/layout/sidebar/SidebarElements';
import { PhotoPreviewProvider } from '../components/pages/componets/photoPreview/PhotoPreviewElements';
import { LocalGroupRestrictmentsType } from '../components/pages/courses/coursesTypes';
import { APP_MAX_WIDTH } from '../pages/_app';
import { rtkApi } from '../redux/api';
import { useTypedDispatch, useTypedSelector } from '../redux/hooks';
import { changeCourseViewMode } from '../redux/slices/courses';
import { SystemRolesOptions, selectUser } from '../redux/slices/user';
import { ILayoutProps, WrapperProps } from './Layout';
import ActiveRunsModalAlert from './layout-components/ActiveRunsModalAlert';

export interface ICoursesLayoutPropsWithWrapper<T> extends ICoursesLayoutProps {
	additionalWrapper: WrapperProps<T>;
}
export interface ICoursesLayoutProps extends ILayoutProps {
	courseIconUrl?: string;
	disableProgress?: boolean;
	disableActiveRunsAlert?: boolean;
}

/**
 * @requires must be used only for exact course. There is have to be router.query.cid option to work with Progresses (/courses/:cid).
 * @description if u dont care of any Progresses, u could still use the layout, but unpredictable behavior is expected.
 * @IUnknown404I This layout provides the UI for the courses pages and some inner logic via ViewMode and actual Progress for the course for the current user.
 * @param additionalWrapper is optional Object that can be used for adding an additional logic-layer as wrapper for all inner content (generic);
 * - additionalWrapper.wrapper is and Constructor for the additional wrapper (generic);
 * - additionalWrapper.props is an optional Props for the additional wrapper that will be passed in (generic);
 * @param disableProgress (optional) boolean flag for hiding the current course-progress line;
 * @param courseIconUrl (optional) is url for the img that will be displated in left sider littel bit upper footer;
 * @param ...others from the ILayoutProps (base for the Layout all across the Onyx ecosystem).
 * @returns JSX.Element as complex layout and
 */
function CoursesLayout<T>(props: ICoursesLayoutProps | ICoursesLayoutPropsWithWrapper<T>): JSX.Element {
	const theme = useTheme();
	const router = useRouter();
	const fullScreen = useMediaQuery(theme.breakpoints.up('md'));

	const dispatcher = useTypedDispatch();
	const userData = useTypedSelector(selectUser);
	const coursesViewMode = useTypedSelector(store => store.courses.mode);

	// prefetch the course-progress data by the current user
	const { data: currentProgressData } = rtkApi.useCurrentCourseProgressQuery((router.query.cid as string) || '');

	const handleRouteBack = () => {
		if (!!props.backButtonProps?.href) router.push(props.backButtonProps.href);
		else if (!!props.backButtonProps?.historyBack) router.back();
		else if (!!router.query.from) router.push(router.query.from as string);
		else {
			const basepath = router.asPath.includes('?')
				? router.asPath.slice(0, router.asPath.indexOf('?'))
				: router.asPath;
			router.push(basepath.slice(0, basepath.lastIndexOf('/')));
		}
	};

	// collect stored view mode if it exists
	React.useEffect(() => {
		const storedViewedMode = localStorage.getItem('courses-view-mode');
		// check for the user access
		if (SystemRolesOptions[userData._systemRole].accessLevel < 2) {
			if ((storedViewedMode as typeof coursesViewMode) !== 'observe')
				localStorage.setItem('courses-view-mode', 'observe');
			if (coursesViewMode !== 'observe') dispatcher(changeCourseViewMode('observe'));
			return;
		}
		// parse stored data
		else if (!!storedViewedMode && storedViewedMode !== coursesViewMode)
			dispatcher(changeCourseViewMode(storedViewedMode as typeof coursesViewMode));
	}, []);

	// forced update editor-mode to classic view for small devices
	React.useEffect(() => {
		if (!fullScreen && coursesViewMode === 'editor') dispatcher(changeCourseViewMode('observe'));
	}, []);

	return (
		<>
			<Head>
				<meta name='description' content='Course <cid-meta>' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<PhotoPreviewProvider loop={false}>
				<Grid
					container
					component='main'
					sx={{
						color: 'text.primary',
						bgcolor: 'background.default',
						maxWidth: `${APP_MAX_WIDTH}px`,
					}}
				>
					{!props.disableActiveRunsAlert && <ActiveRunsModalAlert />}

					<Grid
						item
						component='nav'
						xs={0}
						md={0}
						lg={2}
						xl={2}
						display={{ xs: 'none', md: 'none', lg: 'block' }}
					>
						<Stack width='100%' position='sticky' top='0' sx={{ overflowY: 'auto' }}>
							<LogoGMI />
							<Stack position='sticky' flexGrow='1' top='0'>
								<List sx={{ marginTop: '1rem' }}>
									{!!router.query.cid &&
										router.asPath.split(router.query.cid as string).length > 1 && (
											<SideListItem
												selected={
													router.asPath.split('/').includes('courses') &&
													!router.query.addType
												}
												text='Программа'
												href={`/courses/${router.query.cid}`}
												icon={<SchoolIcon />}
											/>
										)}
									<SideListItem
										selected={
											router.query.addType === 'files' &&
											router.asPath.split('?')[0].split('/').includes('additionals')
										}
										href={`/courses/${router.query.cid}/additionals?addType=files`}
										text='Файлы'
										icon={<ManageAccountsOutlinedIcon />}
									/>
									<SideListItem
										selected={
											router.query.addType === 'materials' &&
											router.asPath.split('?')[0].split('/').includes('additionals')
										}
										href={`/courses/${router.query.cid}/additionals?addType=materials`}
										text='Материалы'
										icon={<BarChartOutlinedIcon />}
									/>
									<SideListItem
										selected={
											router.query.addType === 'records' &&
											router.asPath.split('?')[0].split('/').includes('additionals')
										}
										href={`/courses/${router.query.cid}/additionals?addType=records`}
										text='Записи вебинаров'
										icon={<CloudDoneOutlinedIcon />}
									/>
								</List>
								<Divider sx={{ margin: 'auto', marginY: '10px', width: '80%' }} />

								{!props.disableProgress && (
									<>
										<Stack
											justifyContent='center'
											alignItems='center'
											sx={{
												widht: '100%',
												padding: '.5rem 1rem',
											}}
										>
											<OnyxTypography tpSize='1.1rem' sx={{ marginBottom: '.25rem' }}>
												Прохождение курса
											</OnyxTypography>
											<OnyxRangeInput
												mode='success'
												marks={[{ value: 20 }, { value: 40 }, { value: 60 }, { value: 80 }]}
												value={currentProgressData?.data?.percent?.total || 0}
												aria-label='Course progress'
												valueLabelDisplay='auto'
												thumbSize={12}
												max={100}
											/>
										</Stack>

										<Divider sx={{ margin: 'auto', marginY: '10px', width: '80%' }} />
									</>
								)}

								<List>
									<SideListItem href='/courses' text='Курсы' icon={<SchoolOutlinedIcon />} />
									<SideListItem text='Справка' icon={<SupportOutlinedIcon />} />
									<SideListItem href='/support' text='Помощь' icon={<HeadsetMicOutlinedIcon />} />
								</List>

								{props.courseIconUrl && (
									<Stack
										flexGrow='1'
										alignItems='center'
										justifyContent='center'
										sx={{ width: '100%', padding: '0 1rem', marginBottom: '1.5rem' }}
									>
										<img src={props.courseIconUrl} style={{ maxWidth: '100%' }} />
									</Stack>
								)}

								<Footer />
							</Stack>
						</Stack>
					</Grid>

					<Grid
						item
						sx={{ margin: 0, padding: 0, position: 'relative', overflow: 'hidden' }}
						xs={12}
						sm={12}
						md={12}
						lg={10}
						xl={10}
					>
						<Header chatIcon disableRoundMark />
						<Box
							component='article'
							sx={{
								padding: '15px',
								minHeight: 'calc(100lvh - 100px)',
								// overflow: 'auto',
								marginTop: '100px',
								backgroundColor: theme => (theme.palette.mode === 'light' ? 'white' : ''),
								borderTop: '1px solid',
								borderLeft: '1px solid',
								borderColor: 'lightgray',
								borderTopLeftRadius: '15px',
								...props.contentContainerSx,
							}}
						>
							{props.backButton ? (
								<Stack
									width='100%'
									justifyContent='space-between'
									alignItems='center'
									marginBottom='.5rem'
									sx={{
										gap: { xs: '.25rem', md: '2rem' },
										flexDirection: { xs: 'column', lg: 'row' },
									}}
								>
									<OnyxBreacrumbs
										separator='>'
										itemList={[
											{ href: '/courses', element: 'Курсы', icon: <AutoStoriesIcon /> },
											{
												href: `/courses/${router.query.cid as string | undefined}` || '',
												element: 'Образовательная программа',
												icon: <SchoolIcon />,
											},
											...(props.breadcrumbs || []),
										]}
									/>

									<Button
										size={props.backButtonProps?.size || 'small'}
										variant={props.backButtonProps?.variant || 'outlined'}
										onClick={
											!!props.backButtonProps?.onClick
												? () => {
														props.backButtonProps!.onClick!();
														handleRouteBack();
												  }
												: handleRouteBack
										}
										sx={{
											paddingInline: '1rem',
											whiteSpace: 'nowrap',
											alignSelf: { xs: 'flex-end', lg: '' },
											...props.backButtonProps?.sx,
										}}
									>
										<KeyboardBackspaceIcon sx={{ fontSize: '1.25rem', marginRight: '.25rem' }} />{' '}
										{props.backButtonProps?.text || 'Вернуться'}
									</Button>
								</Stack>
							) : (
								<OnyxBreacrumbs
									separator='>'
									itemList={[
										{ href: '/courses', element: 'Курсы', icon: <AutoStoriesIcon /> },
										{
											href: `/courses/${router.query.cid as string | undefined}` || '',
											element: 'Образовательная программа',
											icon: <SchoolIcon />,
										},
										...(props.breadcrumbs || []),
									]}
									sx={{ marginBottom: '1rem' }}
								/>
							)}

							{'additionalWrapper' in props && !!props.additionalWrapper ? (
								// @ts-ignore
								<props.additionalWrapper.wrapper {...props.additionalWrapper.props}>
									{props.children}
								</props.additionalWrapper.wrapper>
							) : (
								props.children
							)}
						</Box>
					</Grid>
				</Grid>
			</PhotoPreviewProvider>
		</>
	);
}

export default CoursesLayout;

/**
 * @IUnknown404I Checkes user-availability of course-section according passed restriction object got from course-progress instance.
 * @param csid id of section;
 * @param restrictments object with section-restrictments from course-progress instance.
 * @returns boolean flag available or not.
 * @default will instantly return false if id havent been passed or true if no restrictment object passed.
 */
export function checkSectionAvailability(
	csid?: string,
	restrictments?: Omit<LocalGroupRestrictmentsType, 'meta'>,
): boolean {
	if (!csid) return false;
	if (!restrictments) return true;

	const now = +new Date();
	if (now < restrictments.startDate || now > restrictments.endDate) return false;
	else if (!!restrictments?.sections) {
		const sectionRestrictments = Object.entries(restrictments.sections).find(entry => entry[0] === csid);
		if (!sectionRestrictments) return true;
		if (
			(!!sectionRestrictments[1]?.availableFrom && now < sectionRestrictments[1].availableFrom) ||
			(!!sectionRestrictments[1]?.availableTo && now > sectionRestrictments[1].availableTo)
		)
			return false;
	}
	return true;
}
