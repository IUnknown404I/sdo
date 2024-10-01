import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { Paper, Tab, Tabs } from '@mui/material';
import Grid from '@mui/material/Grid';
import React from 'react';
import { Education } from '../..';
import Dashboard from '../componets/dashboard/Dashboard';
import Profile from '../componets/profile/Profile';
import UserCourses from '../componets/userCourses/UserCourses';

export const Personal = (props: { tabPosition?: number }) => {
	const [panelNum, setPanelNum] = React.useState<number>(props.tabPosition || 0);

	const handleChange = (event: any, newValue: number) => {
		setPanelNum(() => newValue);
	};

	return (
		<Grid container>
			<Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginBottom: '20px' }}>
				<Paper sx={{ borderRadius: '20px' }}>
					<Tabs
						orientation='horizontal'
						variant='scrollable'
						scrollButtons
						allowScrollButtonsMobile
						value={panelNum}
						onChange={handleChange}
						aria-label='Меню личного кабинета'
					>
						<Tab icon={<DonutLargeOutlinedIcon />} iconPosition='start' label='Дашборд' {...tabsProps(0)} />
						<Tab
							icon={<LocalLibraryOutlinedIcon />}
							iconPosition='start'
							label='Обучение'
							{...tabsProps(1)}
						/>
						<Tab icon={<SchoolOutlinedIcon />} iconPosition='start' label='Мои курсы' {...tabsProps(2)} />
						<Tab icon={<FolderOutlinedIcon />} iconPosition='start' label='Документы' {...tabsProps(3)} />
						<Tab
							icon={<PersonOutlineOutlinedIcon />}
							iconPosition='start'
							label='Профиль'
							{...tabsProps(4)}
						/>
						<Tab
							icon={<EmojiEventsOutlinedIcon />}
							iconPosition='start'
							label='Награды'
							{...tabsProps(5)}
						/>
					</Tabs>
				</Paper>
			</Grid>

			<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
				{getPageContent(props.tabPosition)}
			</Grid>
		</Grid>
	);
};

function tabsProps(index: number) {
	return {
		id: `vertical-tab-${index}`,
		'aria-controls': `vertical-tabpanel-${index}`,
	};
}

function getPageContent(tabPosition?: number) {
	if (tabPosition === undefined || ![0, 1, 2, 3, 4, 5].includes(tabPosition)) return <Dashboard />;
	switch (tabPosition) {
		case 0:
			return <Dashboard />;
		case 1:
			return <Education />;
		case 2:
			return <UserCourses />;
		case 3:
			return 'документы';
		case 4:
			return <Profile />;
		case 5:
			return 'награды';
		default:
			return <Dashboard />;
	}
}
