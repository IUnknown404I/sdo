import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { Badge, Box, Grid, Tab, Tabs } from '@mui/material';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SetStateAction } from 'react';
import { rtkApi } from '../../../../redux/api';
import { CourseProgressI } from '../../../../redux/endpoints/courseProgressEnd';
import { useTypedSelector } from '../../../../redux/hooks';
import { SystemRolesOptions, selectUser } from '../../../../redux/slices/user';
import { querySwitcher } from '../../../../utils/http';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import UserAdminCoursesTabContent from './UserAdminCoursesTabContent';
import UserCoursesTabContent from './UserCoursesTabContent';

interface TabPanelProps {
	children?: (string | JSX.Element) | (string | JSX.Element)[];
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;
	return (
		<Box hidden={value !== index} aria-labelledby={`vertical-tab-${index}`} {...other}>
			{value === index && (
				<OnyxTypography component='span' boxWrapper>
					{children}
				</OnyxTypography>
			)}
		</Box>
	);
}

const MY_COURSES_QUARY_CASES = ['in-progress', 'upcoming-courses', 'completed-courses', 'administrative-courses'];

const UserCourses = () => {
	const router = useRouter();
	const userData = useTypedSelector(selectUser);

	const [position, setPosition] = React.useState(0);

	const { data: activeProgresses, isFetching: isActiveProgressesFetching } = rtkApi.useActiveProgressesQuery('');
	const { data: finishedProgresses, isFetching: isFinishedProgressesFetching } =
		rtkApi.useFinishedProgressesQuery('');
	const { data: adminProgresses, isFetching: isAdminProgressesFetching } =
		rtkApi.useAdministrativeProgressesQuery('');

	const currentStudy = React.useMemo<CourseProgressI[]>(
		() =>
			!!activeProgresses
				? activeProgresses.reduce(
						(acc, course) => (course.from! <= +new Date() ? [...acc, course] : acc),
						[] as CourseProgressI[],
				  )
				: [],
		[activeProgresses],
	);
	const upcomingStudy = React.useMemo<CourseProgressI[]>(
		() =>
			!!activeProgresses
				? activeProgresses.reduce(
						(acc, course) => (course.from! > +new Date() ? [...acc, course] : acc),
						[] as CourseProgressI[],
				  )
				: [],
		[activeProgresses],
	);

	const handleChange = (event: any, newPosition: SetStateAction<number>) => {
		router.replace(`courses?current=${MY_COURSES_QUARY_CASES[newPosition as number]}`);
		setPosition(newPosition as number);
	};

	React.useEffect(() => {
		const positionByQueryChange = querySwitcher('current', MY_COURSES_QUARY_CASES, router.query);
		setPosition(() => (positionByQueryChange === undefined ? 0 : positionByQueryChange));
	}, [router.query]);

	return (
		<>
			<Grid container>
				<Grid item xs={12} md={12} lg={12}>
					<Tabs
						variant='scrollable'
						orientation='horizontal'
						aria-label='меню личного кабинета'
						value={position}
						onChange={handleChange}
						scrollButtons
						allowScrollButtonsMobile
					>
						<Tab
							iconPosition='start'
							icon={<TaskAltOutlinedIcon />}
							label={
								<TabBadgeItem color='success' badgeContent={currentStudy?.length || 0}>
									Идет обучение
								</TabBadgeItem>
							}
						/>
						<Tab
							iconPosition='start'
							icon={<CalendarMonthOutlinedIcon />}
							label={
								<TabBadgeItem color='warning' badgeContent={upcomingStudy?.length || 0}>
									Предстоящие курсы
								</TabBadgeItem>
							}
						/>
						<Tab
							iconPosition='start'
							icon={<Inventory2OutlinedIcon />}
							label={
								<TabBadgeItem color='secondary' badgeContent={finishedProgresses?.length || 0}>
									Пройденные курсы
								</TabBadgeItem>
							}
						/>
						{SystemRolesOptions[userData._systemRole].accessLevel > 0 && (
							<Tab
								iconPosition='start'
								icon={<StarsOutlinedIcon />}
								label={
									<Badge
										color='primary'
										badgeContent={adminProgresses?.length || 0}
										sx={{ '.MuiBadge-badge': { right: '-5px', top: '-10px' } }}
									>
										<strong>Администрируемые мной</strong>
									</Badge>
								}
							/>
						)}
					</Tabs>
				</Grid>

				<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
					<TabPanel value={position} index={0}>
						<UserCoursesTabContent
							isFetching={isActiveProgressesFetching}
							coursesProgresses={currentStudy}
							cardsProps={{
								colorBadge: 'success',
								colorCourse: 'active',
								textBadge: 'идет обучение',
							}}
						/>
					</TabPanel>
					<TabPanel value={position} index={1}>
						<UserCoursesTabContent
							isFetching={isActiveProgressesFetching}
							coursesProgresses={upcomingStudy}
							cardsProps={{
								disableLink: true,
								colorBadge: 'warning',
								colorCourse: 'upcoming',
								textBadge: 'ожидается зачисление',
							}}
							emptyErrorText='Список предстоящих курсов, на которые вы записаны, пуст!'
						/>
					</TabPanel>
					<TabPanel value={position} index={2}>
						<UserCoursesTabContent
							isFetching={isFinishedProgressesFetching}
							coursesProgresses={finishedProgresses}
							cardsProps={{
								disableLink: true,
								colorBadge: 'secondary',
								colorCourse: 'completed',
								textBadge: 'обучение завершено',
							}}
							emptyErrorText='Пока что вы не проходили обучение на нашей платформе!'
						/>
					</TabPanel>
					<TabPanel value={position} index={3}>
						<UserAdminCoursesTabContent
							isFetching={isAdminProgressesFetching}
							coursesProgresses={adminProgresses}
							cardsProps={{
								colorBadge: 'primary',
								colorCourse: 'administrative',
								textBadge: 'администрирование',
							}}
							emptyErrorText='Пока что вы не администрируете ни одной программы!'
						/>
					</TabPanel>
				</Grid>
			</Grid>
		</>
	);
};

function TabBadgeItem(props: Pick<React.ComponentProps<typeof Badge>, 'children' | 'badgeContent' | 'color'>) {
	return (
		<Badge color='primary' badgeContent={0} sx={{ '.MuiBadge-badge': { right: '-5px', top: '-12px' } }} {...props}>
			{props.children}
		</Badge>
	);
}

export default UserCourses;
