import { Button, Chip, Paper, Stack, Typography } from '@mui/material';
import OnyxImage from '../../../../../basics/OnyxImage';

export const EventCard = () => {
	return (
		<>
			<Stack
				sx={{ width: '100%' }}
				direction={{
					xs: 'column',
					md: 'column',
					lg: 'row',
				}}
				spacing={2}
			>
				<Paper sx={{ width: '100%', borderRadius: '20px', padding: '15px' }}>
					<Stack direction={'column'} spacing={1}>
						<Stack direction={'row'} spacing={3} justifyContent={'space-around'} alignItems={'center'}>
							<Stack direction={'column'}>
								<OnyxImage src='/icons/webinar3.svg' alt='Live webinar' width='60px' height='90px' />
								<Chip component={'span'} variant='filled' color='error' size='small' label={'online'} />
							</Stack>
							<Typography>Прямой эфир</Typography>
							<Button variant='text'>смотреть</Button>
						</Stack>
					</Stack>
				</Paper>

				<Paper sx={{ width: '100%', borderRadius: '20px', padding: '15px' }}>
					<Stack direction={'column'} spacing={1}>
						<Stack direction={'row'} spacing={3} justifyContent={'space-around'} alignItems={'center'}>
							<OnyxImage src='/icons/webinar4.svg' alt='Webinars records' width='60px' height='90px' />
							<Typography>Записи вебинаров</Typography>
							<Stack justifyContent={'center'} alignItems={'center'}>
								<Typography variant='overline'>доступно</Typography>
								<Typography variant='h5'>2</Typography>
								<Button variant='text'>перейти</Button>
							</Stack>
						</Stack>
					</Stack>
				</Paper>
			</Stack>
		</>
	);
};
