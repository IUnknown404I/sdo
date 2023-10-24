import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SetStateAction, useState } from 'react';
import { querySwitcher } from '../../../../utils/http';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import CourseCardPersonal from './CourseCardPersonal';

const coursesData = [
	{
		date: '01.09.2022 - 14.09.2022',
		typeCourse: 'Повышение квалификации',
		title: 'Правила проведения входного контроля средств индивидуальной защиты',
		href: '/courses/personal-protective-equipment',
		status: 'active',
		colorBadge: 'success',
		textBadge: 'идет обучение',
		progress: 49,
		imagePath: '/images/courses/coursesCard/sizPreview.svg',
		colorCourse: '#ffca28',
	},

	{
		date: '01.09.2022 - 14.09.2022',
		typeCourse: 'Повышение квалификации',
		title: 'Правила проведения входного контроля средств индивидуальной защиты',
		href: '/courses/personal-protective-equipment',
		status: 'completed',
		colorBadge: 'secondary',
		textBadge: 'обучение завершено',
		progress: 100,
		imagePath: '/images/courses/coursesCard/sizPreview.svg',
		colorCourse: '#cecece',
	},
	{
		date: '01.09.2022 - 14.09.2022',
		typeCourse: 'Повышение квалификации',
		title: 'Правила проведения входного контроля средств индивидуальной защиты',
		href: '/courses/personal-protective-equipment',
		status: 'completed',
		colorBadge: 'secondary',
		textBadge: 'обучение завершено',
		progress: 100,
		imagePath: '/images/courses/coursesCard/sizPreview.svg',
		colorCourse: '#cecece',
	},
	{
		date: '01.09.2022 - 14.09.2022',
		typeCourse: 'Повышение квалификации',
		title: 'Правила проведения входного контроля средств индивидуальной защиты',
		href: '/courses/personal-protective-equipment',
		status: 'upcoming',
		colorBadge: 'warning',
		textBadge: 'ожидается зачисление',
		progress: 0,
		imagePath: '/images/courses/coursesCard/sizPreview.svg',
		colorCourse: '#006fba',
	},
];

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

const MY_COURSES_QUARY_CASES = ['in-progress', 'upcoming-courses', 'completed-courses'];

export const UserCourses = () => {
	const router = useRouter();
	const [position, setPosition] = useState(0);

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
						orientation='horizontal'
						variant='scrollable'
						scrollButtons
						allowScrollButtonsMobile
						value={position}
						onChange={handleChange}
						aria-label='меню личного кабинета'
					>
						<Tab iconPosition='start' icon={<TaskAltOutlinedIcon />} label='Идет обучение' />
						<Tab iconPosition='start' icon={<CalendarMonthOutlinedIcon />} label='Предстоящие курсы' />
						<Tab iconPosition='start' icon={<Inventory2OutlinedIcon />} label='Пройденный курсы' />
					</Tabs>
				</Grid>

				<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
					<TabPanel value={position} index={0}>
						<Grid container sx={{ marginTop: '20px' }} spacing={2}>
							{coursesData
								.filter(el => el.status === 'active')
								.map((course, index) => {
									return (
										<Grid item xs={12} lg={12} key={index}>
											<CourseCardPersonal {...course} />
										</Grid>
									);
								})}
						</Grid>
					</TabPanel>

					<TabPanel value={position} index={1}>
						<Grid item sx={{ marginTop: '20px' }} spacing={2} container>
							{coursesData
								.filter(el => el.status === 'upcoming')
								.map((course, index) => {
									return (
										<Grid item xs={12} lg={12} key={index}>
											<CourseCardPersonal {...course} />
										</Grid>
									);
								})}
						</Grid>
					</TabPanel>

					<TabPanel value={position} index={2}>
						<Grid container sx={{ marginTop: '20px' }} spacing={2}>
							{coursesData
								.filter(el => el.status === 'completed')
								.map((course, index) => {
									return (
										<Grid item xs={12} lg={12} key={index}>
											<CourseCardPersonal {...course} />
										</Grid>
									);
								})}
						</Grid>
					</TabPanel>
				</Grid>
			</Grid>
		</>
	);
};
