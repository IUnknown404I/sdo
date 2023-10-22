import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, Grid, Tab, Tabs, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { SetStateAction } from 'react';
import { useTypedSelector } from '../../../../redux/hooks';
import { querySwitcher } from '../../../../utils/http';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import ProfileUserCard from './ProfileUserCard';
import RequestModalProfile from './components/RequestModalProfile';
import ProfileConfigComponent from './tabs/ProfileConfigComponent';
import ProfileInformationComponent from './tabs/ProfileInformationComponent';
import ProfileSecurityComponent from './tabs/ProfileSecurityComponent';

const MY_COURSES_QUARY_CASES = ['cabinet', 'security', 'settings'];

export const Profile = () => {
	const router = useRouter();
	const axiosInstance = useTypedSelector(store => store.axiosInstance.instance);

	const [position, setPosition] = React.useState<number>(0);
	const [passwordModalState, setPasswordModalState] = React.useState<boolean>(false);
	const [emailModalState, setEmailModalState] = React.useState<boolean>(false);

	const handleChange = (event: any, newPosition: SetStateAction<number>) => {
		router.replace(`profile?current=${MY_COURSES_QUARY_CASES[newPosition as number]}`);
		setPosition(newPosition as number);
	};

	React.useEffect(() => {
		const positionByQueryChange = querySwitcher('current', MY_COURSES_QUARY_CASES, router.query);
		setPosition(() => (positionByQueryChange === undefined ? 0 : positionByQueryChange));
	}, [router.query]);

	return (
		<>
			<Grid container spacing={3}>
				<Grid item xs={12} lg={5}>
					<Typography
						variant='body1'
						fontWeight='bold'
						textTransform='uppercase'
						textAlign='center'
						sx={{ padding: '22px 20px' }}
					>
						Карточка профиля
					</Typography>

					<ProfileUserCard
						emailChangeClick={() => setEmailModalState(prev => !prev)}
						passwordChangeClick={() => setPasswordModalState(prev => !prev)}
					/>
					<RequestModalProfile
						state={passwordModalState}
						setState={setPasswordModalState}
						callback={({ password }) =>
							axiosInstance.put(`${process.env.NEXT_PUBLIC_SERVER}/users/personal/password`, {
								password,
							})
						}
					/>
					<RequestModalProfile
						emailField
						state={emailModalState}
						setState={setEmailModalState}
						callback={({ password, email }) =>
							axiosInstance.put(`${process.env.NEXT_PUBLIC_SERVER}/users/personal/email`, {
								password: password,
								email: email,
							})
						}
					/>
				</Grid>

				<Grid item xs={12} lg={7}>
					<Grid container>
						<Grid item xs={12} lg={12}>
							<Tabs
								orientation='horizontal'
								variant='scrollable'
								scrollButtons
								allowScrollButtonsMobile
								value={position}
								onChange={handleChange}
								aria-label='menu'
							>
								<Tab iconPosition='start' icon={<AccountCircleOutlinedIcon />} label='Личные данные' />
								<Tab iconPosition='start' icon={<SettingsOutlinedIcon />} label='Настройки' />
								<Tab iconPosition='start' icon={<LockPersonOutlinedIcon />} label='Безопасность' />
							</Tabs>
						</Grid>

						<Grid item xs={12} lg={12}>
							<TabPanel value={position} index={0}>
								<ProfileInformationComponent />
							</TabPanel>
							<TabPanel value={position} index={1}>
								<ProfileConfigComponent />
							</TabPanel>
							<TabPanel value={position} index={2}>
								<ProfileSecurityComponent />
							</TabPanel>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
};

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;
	return (
		<Box
			role='tabpanel'
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{value === index && (
				<OnyxTypography boxWrapper sx={{ width: '100%' }}>
					{children as JSX.Element}
				</OnyxTypography>
			)}
		</Box>
	);
}
