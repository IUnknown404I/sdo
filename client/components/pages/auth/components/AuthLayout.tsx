import { Grid } from '@mui/material';
import AuthCopyrights from './AuthCopyrights';
import MinifiedHeader from './MinifiedHeader';
import RightGridComponent from './RightGridComponent';

/**
 * @IUnknown404I This is outer-auth layout component, designed to use for the pages with two columns out of the authenticate-true-state paths.
 * @param props pass children and sideImgUrl (right side), fully adaptive.
 * @returns [Component] with adaptivity, minified outer-header, bottom-copyrights and main content: passed children on the left side and image on the right.
 */
const AuthLayout = (props: { children: JSX.Element | JSX.Element[]; sideImgUrl: string }): React.ReactElement => {
	return (
		<Grid
			sx={{
				minWidth: '100%',
				minHeight: 'calc(100vh - 100px)',
				bgcolor: 'background.default',
				color: 'text.primary',
			}}
			container
		>
			<Grid
				item
				xs={12}
				sm={12}
				md={12}
				lg={7}
				xl={7}
				sx={{
					display: { xs: 'flex', lg: '' },
					flexDirection: { xs: 'column', lg: '' },
					justifyContent: { xs: 'space-between', lg: '' },
					alignItems: { xs: 'center', lg: '' },
					borderRight: theme => (theme.palette.mode === 'light' ? '' : '1px solid #202e3c'),
					backgroundColor: theme => (theme.palette.mode === 'light' ? '#EFF2F6' : ''),
					minHeight: '100vh',
					padding: {
						xs: '1rem',
						lg: '0',
					},
				}}
			>
				<MinifiedHeader />
				{props.children}
				<AuthCopyrights displaySxProps={{ sx: 'block', lg: 'none' }} />
			</Grid>

			<Grid item xs={0} sm={0} md={0} lg={5} xl={5}>
				<RightGridComponent imgUrl={props.sideImgUrl} />
			</Grid>
		</Grid>
	);
};

export default AuthLayout;
