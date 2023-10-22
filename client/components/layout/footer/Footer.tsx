import { Stack, Typography } from '@mui/material';

export const Footer = () => {
	return (
		<>
			<Stack direction={'column'} justifyContent={'space-around'} alignItems={'center'}>
				<Typography
					sx={{
						fontSize: {
							lg: '14px',
							xl: '16px',
						},
					}}
					variant='body2'
				>
					© НОЦ ГМИ {new Date().getFullYear()}
				</Typography>
				<Typography
					sx={{
						fontSize: {
							lg: '12px',
							xl: '14px',
						},
					}}
					color='secondary'
					variant='overline'
				>
					Onyx LMS v0.3.3 Pre-Alpha
				</Typography>
			</Stack>
		</>
	);
};
