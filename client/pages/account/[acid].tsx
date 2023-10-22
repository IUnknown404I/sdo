import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { Grid, Grow, Paper, Tab, Tabs } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Dashboard, Education, Profile, UserCourses } from '../../components';
import useModernLoading from '../../hooks/useModernLoading';
import { Layout } from '../../layout/Layout';

/**
 * @IUnknown404I Dynamic Content Element acording to the requested /account/[acid] acid path.
 * @param props with acid from static generation with revalidation rule.
 * @returns isolated Element.
 */
const AccountSubPage = (props: { acid: string }) => {
	const router = useRouter();
	const [panelId, setPanelID] = React.useState<string>(props.acid || 'dashboard');
	const {
		Loader,
		loading: loadingState,
		setLoading: setLoadingState,
	} = useModernLoading({ tripleLoadersMode: true, containerSx: { height: 'calc(100vh - 250px)' } });

	const handlePanelChange = (event: any, acid: string) => {
		if (acid !== panelId) {
			setPanelID(() => acid);
			router.push(`${acid}`);
			setLoadingState(() => !router.asPath.includes(acid));
		}
	};

	// active tab change duo to url changes by others page elements and loading state fix
	useEffect(() => {
		if (loadingState) setLoadingState(() => false);
		if (router.query.acid && panelId !== router.query.acid) setPanelID(() => router.query.acid as string);
	}, [router.query]);

	return (
		<>
			<Head>
				<title>{getPageTitle(props.acid)}</title>
			</Head>
			<Layout
				contentContainerSx={{
					padding: '15px',
					minHeight: 'calc(100vh - 100px)',
					maxHeight: loadingState ? 'calc(100vh - 100px)' : 'unset',
					overflow: loadingState ? 'hidden' : '',
				}}
			>
				<Grid container>
					<Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginBottom: '20px' }}>
						<Paper sx={{ borderRadius: '20px' }}>
							<Tabs
								orientation='horizontal'
								variant='scrollable'
								scrollButtons
								allowScrollButtonsMobile
								value={panelId}
								onChange={handlePanelChange}
								aria-label='Меню личного кабинета'
							>
								<Tab
									icon={<DonutLargeOutlinedIcon />}
									iconPosition='start'
									label='Дашборд'
									value='dashboard'
								/>
								<Tab
									icon={<LocalLibraryOutlinedIcon />}
									iconPosition='start'
									label='Обучение'
									value='study'
								/>
								<Tab
									icon={<SchoolOutlinedIcon />}
									iconPosition='start'
									label='Мои курсы'
									value='courses'
								/>
								<Tab
									icon={<FolderOutlinedIcon />}
									iconPosition='start'
									label='Документы'
									value='documents'
								/>
								<Tab
									icon={<PersonOutlineOutlinedIcon />}
									iconPosition='start'
									label='Профиль'
									value='profile'
								/>
								<Tab
									icon={<EmojiEventsOutlinedIcon />}
									iconPosition='start'
									label='Награды'
									value='awards'
								/>
							</Tabs>
						</Paper>
					</Grid>

					<Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ position: 'relative' }}>
						{loadingState && Loader}
						<Grow in={!loadingState}>
							<div>{getPageContent(props.acid)}</div>
						</Grow>
					</Grid>
				</Grid>
			</Layout>
		</>
	);
};

export async function getStaticPaths() {
	const ACCOUNT_PAGES = ['dashboard', 'study', 'courses', 'documents', 'profile', 'awards'];

	return {
		paths: ACCOUNT_PAGES.map(path => {
			return {
				params: {
					acid: path,
				},
			};
		}),
		fallback: false,
	};
}

export async function getStaticProps(params: { params: { acid: string } }) {
	return {
		props: { acid: params.params.acid },
		revalidate: 90,
	};
}

/**
 * @IUnknown404I Matches the address with the content.
 * @param acid as urlPath of /accaount/ sdo-module .
 * @returns the content for requested path.
 */
function getPageContent(acid?: string): JSX.Element {
	if (acid === undefined) return <Dashboard />;
	switch (acid) {
		case 'dashboard':
			return <Dashboard />;
		case 'study':
			return <Education />;
		case 'courses':
			return <UserCourses />;
		case 'documents':
			return <span>Документы</span>;
		case 'profile':
			return <Profile />;
		case 'awards':
			return <span>Награды</span>;
		default:
			return <Dashboard />;
	}
}

function getPageTitle(acid?: string): string {
	if (acid === undefined) return 'Личный кабинет';
	switch (acid) {
		case 'dashboard':
			return 'Личный кабинет';
		case 'study':
			return 'Обучение';
		case 'courses':
			return 'Мои курсы';
		case 'documents':
			return 'Документы';
		case 'profile':
			return 'Профиль';
		case 'awards':
			return 'Награды';
		default:
			return 'Личный кабинет';
	}
}

export default AccountSubPage;
