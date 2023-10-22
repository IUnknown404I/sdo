import { SxProps, Theme } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Head from 'next/head';
import { ReactElement } from 'react';
import { Footer, Header, LogoGMI, Sidebar } from '../components';

export interface ILayoutProps {
	children: ReactElement | JSX.Element[];
	contentContainerSx?: SxProps<Theme>;
}

export const Layout = (props: ILayoutProps): JSX.Element => {
	return (
		<>
			<Head>
				{/* <title>Onyx LMS</title> */}
				<meta name='description' content='Система дистанционного образования Газпром межрегионгаз инжиниринг' />
				<meta
					name='copyright'
					lang='ru'
					content='Научно-образовательный центр ООО «Газпром межрегионгаз инжиниринг»'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Grid container sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
				<Grid item xs={0} md={0} lg={2} xl={2} display={{ xs: 'none', md: 'none', lg: 'block' }}>
					<Stack position='sticky' top='0'>
						<LogoGMI />
						<Sidebar />
						<Footer />
					</Stack>
				</Grid>

				<Grid
					item
					sx={{ margin: 0, padding: 0, position: 'relative', backgroundColor: '#eceff1', overflow: 'hidden' }}
					xs={12}
					sm={12}
					md={12}
					lg={10}
					xl={10}
				>
					<Header />
					<Box
						component={'main'}
						sx={{
							padding: '15px',
							minHeight: 'calc(100vh - 100px)',
							marginTop: '100px',
							backgroundColor: 'content.main',
							...props.contentContainerSx,
						}}
					>
						{props.children}
					</Box>
				</Grid>
			</Grid>
		</>
	);
};
