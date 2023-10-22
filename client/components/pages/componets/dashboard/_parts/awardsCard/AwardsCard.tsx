import { Paper, Stack, Tooltip, Typography } from '@mui/material';
import OnyxImage from '../../../../../basics/OnyxImage';

export const AwardsCard = () => {
	return (
		<Paper sx={{ padding: '20px', borderRadius: '20px' }}>
			<Stack direction={'row'} alignItems={'center'} justifyContent={'space-around'}>
				<Stack>
					<Typography variant='overline'>Последняя полученная награда</Typography>
					<Typography variant='body1'>НОЧНОЙ ОБИТАТЕЛЬ</Typography>
				</Stack>
				<Tooltip title={'Завершить обучающий элемент ночью'}>
					<div>
						<OnyxImage src='/icons/nightAward.svg' alt='Owl picture' width='70px' height='70px' />
					</div>
				</Tooltip>
			</Stack>
		</Paper>
	);
};
