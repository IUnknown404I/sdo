import { Divider, Paper, Stack, Typography } from '@mui/material';
import OnyxImage from '../../../../../basics/OnyxImage';
import { IStatsCardProps } from './StatsCardProps';

export const StatsCard = ({ iconPath, title, value }: IStatsCardProps) => {
	return (
		<>
			<Paper sx={{ padding: '5px', borderRadius: '20px' }}>
				<Stack direction={'row'} justifyContent={'space-around'} alignItems={'center'}>
						<OnyxImage src={iconPath} alt={title} sx={{
							width: {
								xs: '90px',
								md: '90px',
								lg: '70px',
								xl: '90px',
							},
							height: {
								xs: '60px',
								md: '70px',
								lg: '60px',
								xl: '70px',
							},
							padding: '10px',
							borderRadius: '15px',
						}} />
					<Divider sx={{ paddingY: '30px' }} orientation='vertical' />
					<Stack
						direction={'column'}
						justifyContent={'center'}
						alignItems={'center'}
						spacing={1}
						sx={{ padding: '10px' }}
					>
						<Typography variant='overline'>{title}</Typography>
						<Typography variant='h5' fontWeight={'bold'}>
							{value}
						</Typography>
					</Stack>
				</Stack>
			</Paper>
		</>
	);
};
