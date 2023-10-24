import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { FormEventHandler } from 'react';
import AuthCopyrights from './AuthCopyrights';

const AuthFormLayout = (props: {
	children: JSX.Element | JSX.Element[];
	submitFunction: FormEventHandler<HTMLFormElement>;
}) => {
	return (
		<Box
			sx={{
				position: 'relative',
				maxWidth: '100%',
				minHeight: {
					xs: 'fit-content',
					lg: 'calc(100vh - 100px)',
				},
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				alignItems: 'center',
				gap: '1.5rem',
				padding: '1rem .25rem',
			}}
		>
			<Box
				sx={{
					form: {
						backgroundColor: theme => (theme.palette.mode === 'light' ? '#ffffff' : '#162433'), //#162433
						width: {
							xs: '100vw',
							sm: '550px',
							md: '550px',
							lg: '550px',
						},
						maxWidth: '95vw',
						padding: {
							xs: '1rem',
							sm: '1.5rem 2.5rem',
						},
						paddingTop: { xs: '', sm: '1.5rem' },
					},
					borderRadius: '20px',
					display: 'flex',
					flexGrow: '2',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Paper elevation={5} sx={{ borderRadius: '20px' }}>
					<form
						onSubmit={props.submitFunction}
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '1rem',
							borderRadius: '20px',
						}}
					>
						{Array.isArray(props.children) ? props.children.map(el => el) : props.children}
					</form>
				</Paper>
			</Box>

			<AuthCopyrights displaySxProps={{ xs: 'none', sm: 'none', md: 'none', lg: 'block' }} />
		</Box>
	);
};

export default AuthFormLayout;
