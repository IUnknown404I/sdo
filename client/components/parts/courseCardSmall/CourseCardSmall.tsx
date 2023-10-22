import { Box, Button, Card, CardContent, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import OnyxImage from '../../basics/OnyxImage';

export const CourseCardSmall = () => {
	return (
		<>
			<Card sx={{ borderRadius: '20px' }}>
				<Stack
					sx={{ padding: '15px', bgcolor: red[700] }}
					direction={'row'}
					spacing={3}
					justifyContent={'center'}
					alignItems={'center'}
				>
					<Box sx={{ minWidth: '64px' }}>
						<OnyxImage src='/icons/fire-extinguisher.svg' alt='НОЦ Инжиниринг' width='100%' height='100%' />
					</Box>
					<Typography variant='body1' color='white'>
						Обеспечение пожарной безопасности взрывопожароопасных объектов защиты
					</Typography>
					<Box>
						<Paper
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								padding: '10px',
								borderRadius: '15px',
							}}
						>
							<Typography variant='h6'>1</Typography>
						</Paper>
					</Box>
				</Stack>
				
				<CardContent>
					<Stack direction={'row'} spacing={2} alignItems={'center'}>
						<Box sx={{ width: '100%' }}>
							<LinearProgress color='info' variant='determinate' value={50} />
						</Box>
						<Button size='small' variant='text' color='primary'>
							перейти
						</Button>
					</Stack>
				</CardContent>
			</Card>
		</>
	);
};
