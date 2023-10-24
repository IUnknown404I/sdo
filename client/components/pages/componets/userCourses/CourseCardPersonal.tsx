import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Chip,
	CircularProgress,
	CircularProgressProps,
	Paper,
	Stack,
} from '@mui/material';
import OnyxLink from '../../../basics/OnyxLink';
import { OnyxTypography } from '../../../basics/OnyxTypography';

export interface CourseCardPersonalI {
	href: string;
	date: string;
	typeCourse: string;
	title: string;
	status: string;
	colorBadge: string;
	textBadge: string;
	progress: number;
	imagePath: string;
	colorCourse: string;
}

const CourseCardPersonal = (props: CourseCardPersonalI) => {
	return (
		<Card sx={{ borderRadius: '20px' }}>
			<OnyxLink href={props.href} blockElement>
				<CardActionArea>
					<Stack
						direction={'row'}
						justifyContent={'space-between'}
						alignItems={'center'}
						sx={{ display: { xs: 'flex', md: 'none' }, padding: '30px' }}
					>
						<Box>
							<Chip
								component={'div'}
								variant='filled'
								color={
									props.colorBadge as
										| 'default'
										| 'success'
										| 'primary'
										| 'secondary'
										| 'error'
										| 'info'
										| 'warning'
										| undefined
								}
								size='small'
								label={props.textBadge}
							/>
						</Box>
						<Box>
							<CircularProgressWithLabel value={props.progress} />
						</Box>
					</Stack>

					<Stack
						sx={{ width: '100%' }}
						direction={{ xs: 'column', md: 'row' }}
						spacing={2}
						justifyContent='center'
						alignItems='center'
					>
						<CardMedia
							component='img'
							sx={{
								width: { xs: '40%', md: '15%', display: 'block' },
								bgcolor: props.colorCourse,
								margin: '20px',
								padding: '30px',
								borderRadius: '20px',
							}}
							image={props.imagePath}
							alt='preview'
						/>

						<CardContent sx={{ width: '100%' }}>
							<Stack
								direction={{ xs: 'column', md: 'row' }}
								justifyContent='space-between'
								alignItems='center'
								spacing={3}
							>
								<Stack direction='column' justifyContent='space-between' spacing={3}>
									<Stack direction='row' spacing={2} alignItems='center'>
										<CalendarMonthOutlinedIcon color='primary' />
										<OnyxTypography
											text={props.date}
											tpSize='1.1rem'
											tpColor='primary'
											tpVariant='subtitle2'
										/>
									</Stack>
									<Box>
										<OnyxTypography
											text={props.typeCourse}
											tpVariant='overline'
											tpColor='secondary'
										/>
										<OnyxTypography text={props.title} tpVariant='h6' tpSize='1.25rem' />
									</Box>
									<Box>
										<Button
											size='small'
											component='span'
											sx={{
												borderRadius: '30px',
												width: { xs: '100%', md: '200px' },
											}}
											variant='contained'
										>
											Перейти
										</Button>
									</Box>
								</Stack>

								<CardActions>
									<Stack
										sx={{
											width: '200px',
											height: '100%',
											display: {
												xs: 'none',
												md: 'flex',
											},
										}}
										spacing={4}
										direction={{ xs: 'row', md: 'column' }}
										justifyContent='space-around'
										alignItems='center'
									>
										<Chip
											component='div'
											variant='filled'
											color={
												props.colorBadge as
													| 'default'
													| 'success'
													| 'primary'
													| 'secondary'
													| 'error'
													| 'info'
													| 'warning'
													| undefined
											}
											size='small'
											label={props.textBadge}
											sx={{ width: '200px' }}
										/>

										<Box>
											<CircularProgressWithLabel value={props.progress} />
										</Box>
									</Stack>
								</CardActions>
							</Stack>
						</CardContent>
					</Stack>
				</CardActionArea>
			</OnyxLink>
		</Card>
	);
};

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
	return (
		<Box sx={{ position: 'relative', display: 'inline-flex' }}>
			<CircularProgress size={'80px'} variant='determinate' {...props} />
			<Paper
				sx={{
					inset: '0',
					position: 'absolute',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: '50px',
					margin: '5px',
				}}
			>
				<OnyxTypography
					tpVariant='body1'
					component='div'
					tpColor='secondary'
					text={`${Math.round(props.value)}%`}
				/>
			</Paper>
		</Box>
	);
}

export default CourseCardPersonal;
