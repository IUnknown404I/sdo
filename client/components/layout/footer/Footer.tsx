import { Stack, Typography } from '@mui/material';
import { rtkApi } from '../../../redux/api';

export const Footer = () => {
	const { data: systemTitleCopyright } = rtkApi.useSystemTitleCopyrightQuery(undefined, {
		pollingInterval: 30 * 6e4,
	});

	return (
		<Stack direction='column' justifyContent='flex-end' alignItems='center' flexGrow='1' gap={0.25}>
			<Typography
				sx={{
					fontSize: {
						lg: '14px',
						xl: '16px',
					},
				}}
				variant='body2'
			>
				{systemTitleCopyright?.system_copyright ? '© ' + systemTitleCopyright.system_copyright : ''}
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
				{systemTitleCopyright?.system_version}
				{/* Onyx LMS v1.2.2 Pre-Alpha */}
			</Typography>
		</Stack>
	);
};
