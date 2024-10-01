import { Box, LinearProgress, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import { yellow } from '@mui/material/colors';
import { Stack } from '@mui/system';
import { rtkApi } from '../../../../../../redux/api';
import OnyxImage from '../../../../../basics/OnyxImage';
import ClassicLoader from '../../../../../utils/loaders/ClassicLoader';

const LevelCard = () => {
	const theme = useTheme();
	const isMobileVersion = useMediaQuery(theme.breakpoints.down('sm'));

	const { currentData: userLoyality, isFetching: isUserLoyalityFetching } = rtkApi.useUserLoyalityQuery();

	return (
		<Paper
			sx={{
				width: '100%',
				padding: '20px',
				borderRadius: '20px',
			}}
		>
			<Stack
				width='100%'
				flexDirection='row'
				spacing={5}
				sx={{
					width: '100%',
					alignItems: 'center',
					justifyContent: 'space-around',
					gap: '.5rem',
					// ...(isMobileVersion
					// 	? {
					// 			width: '100%',
					// 			alignItems: 'center',
					// 			justifyContent: 'center',
					// 			gap: '.5rem',
					// 	  }
					// 	: {}),
				}}
			>
				<Stack direction='row' alignItems='center' justifyContent='center' gap={2}>
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
								left: 0,
								right: 0,
								bottom: 0,
							}}
						>
							{!userLoyality || isUserLoyalityFetching ? (
								<ClassicLoader size={30} sx={{ top: '9px' }} />
							) : (
								<Typography variant='h4' fontWeight='bold' color={yellow[600]}>
									{userLoyality.level}
								</Typography>
							)}
						</Box>
					</Box>

					<Box sx={{ marginTop: 'unset !important' }}>
						<Typography variant='body1'>УРОВЕНЬ</Typography>
						<Typography variant='overline'>новичок</Typography>
					</Box>
				</Stack>

				<Stack
					direction='column'
					alignItems='center'
					justifyContent='center'
					sx={{ marginTop: 'unset !important' }}
				>
					<Typography variant='overline'>Следующий уровень</Typography>

					<LinearProgress
						sx={{ width: '100%' }}
						variant='determinate'
						value={userLoyality?.experience || 0}
					/>
				</Stack>
			</Stack>
		</Paper>
	);
};

export default LevelCard;
