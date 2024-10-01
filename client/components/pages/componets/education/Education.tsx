import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Box, Fade, Grid, Stack } from '@mui/material';
import React from 'react';
import { rtkApi } from '../../../../redux/api';
import { CourseProgressWithRestrictmentsI } from '../../../../redux/endpoints/courseProgressEnd';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import ModernLoader from '../../../utils/loaders/ModernLoader';
import EducationPanelContent from './EducationPanelContent';

const Education = () => {
	const {
		data: myProgresses,
		isFetching: isMyProgressesFetching,
		isError: isMyProgressesError,
	} = rtkApi.useMyProgressesQuery('');
	const myParsedProgresses = React.useMemo<CourseProgressWithRestrictmentsI[]>(
		() =>
			myProgresses?.filter(
				progress =>
					progress.status === 'active' &&
					(progress.role === 'student' || (progress.role === 'teacher' && !!progress.lgid)),
			) || [],
		[myProgresses],
	);

	return (
		<Grid container spacing={3}>
			{isMyProgressesFetching || isMyProgressesError || !myParsedProgresses ? (
				<Stack width='100%' minHeight='calc(100lvh - 300px)' sx={{ position: 'relative' }}>
					<ModernLoader
						loading
						centered
						size={125}
						tripleLoadersMode
						containerSx={{ top: '50%', transform: 'translateY(-50%)' }}
					/>
				</Stack>
			) : !myParsedProgresses?.length ? (
				<Fade in timeout={2500}>
					<Stack
						width='100%'
						alignItems='center'
						justifyContent='space-around'
						sx={{
							flexDirection: { xs: 'column-reverse', md: 'row' },
							padding: '1rem',
							paddingLeft: '2rem',
							marginTop: { xs: '1.5rem', md: '.5rem' },
							'> img': { display: { xs: 'none', md: 'initial' } },
						}}
						gap={2}
					>
						<Box
							sx={{
								width: { xs: '100%', md: '60%' },
								'> ul > span, a': { width: 'fit-content', display: 'block' },
							}}
						>
							<OnyxTypography
								tpSize='1.35rem'
								tpWeight='bold'
								tpColor='primary'
								text='Вы ещё не записаны на обучение, поэтому данный раздел сейчас пустует'
								sx={{ marginBottom: '2rem', textTransform: 'uppercase' }}
							/>
							<Box
								component='ul'
								sx={{
									'> span': { marginBottom: '1rem' },
									'> span:last-child': { marginTop: '2rem', marginBottom: 'unset' },
								}}
							>
								<OnyxTypography
									component='li'
									lkHref='/courses'
									tpSize='1.25rem'
									ttPlacement='top'
									ttNode='Перейти к списку курсов в текущей системе'
									ttFollow
									centeredFlex
								>
									<LocalLibraryOutlinedIcon />
									Посмотрите, какие образовательные программы доступны на нашей платформе
								</OnyxTypography>
								<OnyxTypography
									component='li'
									lkHref='/courses'
									lkProps={{ rel: 'referrer', target: '_blank' }}
									tpSize='1.25rem'
									ttPlacement='top'
									ttNode='Титульные страницы программ на сайте НОЦ'
									ttFollow
									centeredFlex
								>
									<LanguageOutlinedIcon />
									Ознакомьтесь с титульными страницами курсов на нашем сайте
									<OpenInNewOutlinedIcon sx={{ fontSize: '.85rem' }} />
								</OnyxTypography>
								<OnyxTypography
									component='li'
									lkHref='/courses'
									lkProps={{ rel: 'referrer', target: '_blank' }}
									tpSize='1.25rem'
									ttPlacement='top'
									ttNode='График обучения на сайте НОЦ'
									ttFollow
									centeredFlex
								>
									<EventAvailableOutlinedIcon />
									Взгляните на график планового обучения на текущий год
									<OpenInNewOutlinedIcon sx={{ fontSize: '.85rem' }} />
								</OnyxTypography>
								<OnyxTypography
									component='li'
									lkHref='/support'
									tpSize='1.25rem'
									ttPlacement='top'
									ttNode='Контакты научно-образовательного центра'
									ttFollow
									centeredFlex
								>
									<ContactsOutlinedIcon />
									Свяжитесь с нами удобным для вас способом, если возникли вопросы
								</OnyxTypography>
							</Box>
						</Box>
						<img
							loading='lazy'
							alt='Empty courses image'
							src='/images/courses/Education-empty.png'
							style={{
								maxWidth: 'min(1250px, 40vw)',
								minWidth: '350px',
								maxHeight: 'min(750px, 75lvh)',
								minHeight: '300px',
								userSelect: 'none',
							}}
						/>
					</Stack>
				</Fade>
			) : (
				<EducationPanelContent progresses={myParsedProgresses} />
			)}
		</Grid>
	);
};

export default Education;
