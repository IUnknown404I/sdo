import { Button, Chip, Paper, Stack, SxProps, Theme, Typography } from '@mui/material';
import OnyxImage from '../../../../../basics/OnyxImage';
import { OnyxTypography } from '../../../../../basics/OnyxTypography';

const EventCards = (props: { sx?: SxProps<Theme> }) => {
	return (
		<Stack
			spacing={2}
			direction={{
				xs: 'column',
				md: 'column',
				lg: 'row',
			}}
			sx={{ width: '100%', ...props.sx }}
		>
			<Paper sx={{ width: '100%', borderRadius: '20px', padding: '15px' }}>
				<Stack direction='row' justifyContent='space-around' alignItems='center' spacing={3}>
					<Stack direction='column'>
						<OnyxImage src='/icons/webinar3.svg' alt='Live webinar' width='60px' height='90px' />
						<Chip component='span' variant='filled' color='secondary' size='small' label='offline' />
					</Stack>

					<Typography>Прямой эфир</Typography>
					<Button
						disabled
						variant='text'
						sx={{ cursor: 'not-allowed !important', pointerEvents: 'unset !important' }}
					>
						смотреть
					</Button>
				</Stack>
			</Paper>

			<Paper sx={{ width: '100%', borderRadius: '20px', padding: '15px' }}>
				<Stack direction='row' spacing={3} justifyContent='space-around' alignItems='center'>
					<OnyxImage src='/icons/webinar4.svg' alt='Webinars records' width='60px' height='90px' />
					<Typography>Записи вебинаров</Typography>

					<Stack justifyContent='center' alignItems='center'>
						<OnyxTypography
							text='доступно'
							component='span'
							tpSize='.85rem'
							sx={{ marginTop: '.75rem', textTransform: 'uppercase' }}
						/>
						<OnyxTypography component='span' text='0' tpSize='1.75rem' />
						<Button
							disabled
							variant='text'
							sx={{ cursor: 'not-allowed !important', pointerEvents: 'unset !important' }}
						>
							перейти
						</Button>
					</Stack>
				</Stack>
			</Paper>
		</Stack>
	);
};

export default EventCards;
