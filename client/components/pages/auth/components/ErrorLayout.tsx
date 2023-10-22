import React from 'react';
import MinifiedHeader from './MinifiedHeader';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import AuthCopyrights from './AuthCopyrights';

const ErrorLayout = (props: { children: JSX.Element | JSX.Element[]; footer: JSX.Element | JSX.Element[] }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				gap: '1rem',
				minWidth: '100%',
				minHeight: '100vh',
				padding: '1rem',
				paddingBottom: '1.5rem',
				backgroundColor: theme => (theme.palette.mode === 'light' ? '#eff2f6' : '#0a1929'),
				color: 'text.primary',
			}}
		>
			<MinifiedHeader />

			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: {
						xs: '1.25rem',
						sm: '.75rem',
					},
					flexGrow: '2',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Paper
					elevation={5}
					sx={{
						width: {
							xs: '90vw',
							sm: '550px',
							md: '550px',
							lg: '550px',
						},
						padding: {
							xs: '1rem',
							sm: '1.5rem 2.5rem',
						},
						paddingBottom: '2rem',
						borderRadius: '10px',
						marginInline: 'auto',
						backgroundColor: theme => (theme.palette.mode === 'light' ? '#ffffff' : '#162433'),
					}}
				>
					{Array.isArray(props.children) ? props.children.map(el => <>{el}</>) : props.children}
				</Paper>

				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: {
							xs: '90vw',
							sm: '550px',
							md: '550px',
							lg: '550px',
						},
						marginInline: 'auto',
						gap: '1rem',
					}}
				>
					{Array.isArray(props.footer) ? props.footer.map(el => <>{el}</>) : props.footer}
				</Box>
			</Box>

			<AuthCopyrights />
		</Box>
	);
};

export default ErrorLayout;
