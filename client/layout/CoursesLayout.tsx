import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import SchoolIcon from '@mui/icons-material/School';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SupportOutlinedIcon from '@mui/icons-material/SupportOutlined';
import { Button, Divider, List, SxProps, Theme, useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ComponentProps, ReactNode } from 'react';
import { Footer, Header, LogoGMI } from '../components';
import OnyxBreacrumbs, { BreadcrumbItem } from '../components/basics/OnyxBreadcrumbs';
import OnyxRangeInput from '../components/basics/OnyxRangeInput';
import { OnyxTypography } from '../components/basics/OnyxTypography';
import { SideListItem } from '../components/layout/sidebar/SidebarElements';
import { useTypedDispatch, useTypedSelector } from '../redux/hooks';
import { changeCourseViewMode } from '../redux/slices/courses';

export interface ILayoutProps {
	children: ReactNode | ReactNode[];
	contentContainerSx?: SxProps<Theme>;
	breadcrumbsCourseContent?: BreadcrumbItem[];
	progressValue?: number;
	backButton?: boolean;
	backButtonprops?: {
		href?: string;
		text?: string;
		size?: ComponentProps<typeof Button>['size'];
		variant?: ComponentProps<typeof Button>['variant'];
		onClick?: Function;
		sx?: SxProps;
	};
}

const CoursesLayout = (props: ILayoutProps & { courseIconUrl?: string }): JSX.Element => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.up('md'));

	const router = useRouter();
	const dispatcher = useTypedDispatch();
	const coursesViewMode = useTypedSelector(store => store.courses.mode);

	const handleRouteBack = () => {
		if (!!props.backButtonprops?.href) router.push(props.backButtonprops.href);
		else {
			const basepath = router.asPath.includes('?')
				? router.asPath.slice(0, router.asPath.indexOf('?'))
				: router.asPath;
			router.push(basepath.slice(0, basepath.lastIndexOf('/')));
		}
	};

	React.useEffect(() => {
		const storedViewedMode = localStorage.getItem('courses-view-mode');
		if (!!storedViewedMode && storedViewedMode !== coursesViewMode)
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

			<Grid container sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
				<Grid
					item
					xs={0}
					md={0}
					lg={2}
					xl={2}
					display={{ xs: 'none', md: 'none', lg: 'block' }}
					position='relative'
				>
					<LogoGMI />
					<Stack position='sticky' top='0' sx={{ maxHeight: 'unset', overflowY: 'auto' }}>
						<List sx={{ marginTop: '1rem' }}>
							{!!router.query.cid && router.asPath.split(router.query.cid as string).length > 1 && (
								<SideListItem
									text='Программа'
									href={`/courses/${router.query.cid}`}
									icon={<SchoolIcon />}
								/>
							)}
							<SideListItem
								href={`${router.query.cid}/documents`}
								text='Документы'
								icon={<ManageAccountsOutlinedIcon />}
							/>
							<SideListItem
								href={`${router.query.cid}/materials`}
								text='Материалы'
								icon={<BarChartOutlinedIcon />}
							/>
							<SideListItem
								href={`${router.query.cid}/webinars`}
								text='Записи вебинаров'
								icon={<CloudDoneOutlinedIcon />}
							/>
						</List>
						<Divider sx={{ margin: 'auto', marginY: '10px', width: '80%' }} />

						{props.progressValue !== undefined && (
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
										aria-label='Course progress'
										valueLabelDisplay='auto'
										value={30}
										max={100}
										thumbSize={12}
									/>
								</Stack>

								<Divider sx={{ margin: 'auto', marginY: '10px', width: '80%' }} />
							</>
						)}

						<List sx={{ marginBottom: '1.5rem' }}>
							<SideListItem href='/courses' text='Курсы' icon={<SchoolOutlinedIcon />} />
							<SideListItem text='Справка' icon={<SupportOutlinedIcon />} />
							<SideListItem href='/support' text='Помощь' icon={<HeadsetMicOutlinedIcon />} />
						</List>

						{props.courseIconUrl && (
							<Stack
								justifyContent='center'
								alignItems='center'
								sx={{ width: '100%', padding: '0 1rem', marginBottom: '1.25rem' }}
							>
								<img src={props.courseIconUrl} style={{ maxWidth: '100%' }} />
							</Stack>
						)}

						<Footer />
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
						component={'main'}
						sx={{
							padding: '15px',
							minHeight: 'calc(100vh - 100px)',
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
								direction='row'
								justifyContent='space-between'
								alignItems='center'
								marginBottom='1rem'
								gap={2}
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
										...(props.breadcrumbsCourseContent || []),
									]}
									sx={{ marginBottom: '1rem' }}
								/>

								<Button
									size={props.backButtonprops?.size || 'small'}
									variant={props.backButtonprops?.variant || 'outlined'}
									onClick={
										!!props.backButtonprops?.onClick
											? () => {
													props.backButtonprops!.onClick!();
													handleRouteBack();
											  }
											: handleRouteBack
									}
									sx={{ paddingInline: '1rem', whiteSpace: 'nowrap', ...props.backButtonprops?.sx }}
								>
									<KeyboardBackspaceIcon sx={{ fontSize: '1.25rem', marginRight: '.25rem' }} />{' '}
									{props.backButtonprops?.text || 'Вернуться'}
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
									...(props.breadcrumbsCourseContent || []),
								]}
								sx={{ marginBottom: '1rem' }}
							/>
						)}

						{props.children}
					</Box>
				</Grid>
			</Grid>
		</>
	);
};

export default CoursesLayout;
