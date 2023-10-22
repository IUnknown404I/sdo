import { Box, LinearProgress, Paper, Typography } from '@mui/material';
import { yellow } from '@mui/material/colors';
import { Stack } from '@mui/system';
import OnyxImage from '../../../../../basics/OnyxImage';

export const LevelCard = () => {
	return (
		<>
			<Paper
				sx={{
					width: '100%',
					height: '100%',
					borderRadius: '20px',
					padding: '20px',
				}}
			>
				<Stack
					direction={{
						xs: 'column',
						md: 'column',
						lg: 'row',
					}}
					alignItems={'center'}
					spacing={5}
				>
					<Box
						sx={{
							width: '70px',
							height: '70px',
							position: 'relative',
						}}
					>
						<OnyxImage src='/icons/userLevel.svg' alt='1' width='100%' height='100%' />
						<Box
							sx={{
								textAlign: 'center',
								position: 'absolute',
								top: 11,
								right: 0,
								left: 0,
								bottom: 0,
							}}
						>
							<Typography variant={'h4'} fontWeight={'bold'} color={yellow[600]}>
								1
							</Typography>
						</Box>
					</Box>
					<Stack>
						<Typography variant='body1'>УРОВЕНЬ</Typography>
						<Typography variant='overline'>новичок</Typography>
					</Stack>
					<Stack
						sx={{ marginTop: '20px' }}
						direction={'column'}
						alignItems={'center'}
						justifyContent={'center'}
					>
						<Typography variant='overline'>Следующий уровень</Typography>

						<LinearProgress sx={{ width: '100%' }} variant='determinate' value={65} />
					</Stack>
				</Stack>
			</Paper>
		</>
	);
};
