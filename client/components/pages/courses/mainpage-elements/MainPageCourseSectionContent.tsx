import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import SwipeVerticalOutlinedIcon from '@mui/icons-material/SwipeVerticalOutlined';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import { Box, Button, Divider, IconButton, Stack, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';
import React, { SetStateAction } from 'react';
import { useWindowDimensions } from '../../../../hooks/useWindowDimensions';
import { useTypedSelector } from '../../../../redux/hooks';
import { selectUser, SystemRolesOptions } from '../../../../redux/slices/user';
import { convertToRomanNumeral } from '../../../../utils/utilityFunctions';
import OnyxAlertModal from '../../../basics/OnyxAlertModal';
import OnyxLink from '../../../basics/OnyxLink';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import ClassicLoader from '../../../utils/loaders/ClassicLoader';

export interface MainPageCourseContentI {
	disabled?: boolean;
	csid: string;
	active?: boolean;
	setActive: React.Dispatch<SetStateAction<number>>;
	title: string;
	sectionUrl: string;
	sectionUrlDisabled?: boolean;
	sectionOrder: number;
	iconUrl?: string;
	duration: number;
	progress: {
		current: number;
		total: number;
	};
	patternUrl?: string;
	contentTypes: {
		lectures?: boolean;
		videoLectures?: boolean;
		interactivity?: boolean;
		tests?: boolean;
	};
}

const MainPageCourseSectionContent = (props: MainPageCourseContentI) => {
	const router = useRouter();
	const userData = useTypedSelector(selectUser);
	const windowDimensions = useWindowDimensions();

	const [modalState, setModalState] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (!!props.active && !modalState) setModalState(true);
		else if (!props.active && modalState) setModalState(false);
	}, [props.active]);

	const SectionContent = (
		<Box
			sx={{
				width: '100%',
				position: { xs: 'static', lg: 'absolute' },
				inset: '0',
				display: 'flex',
				flexDirection: 'column',
				gap: '2rem',
				top: props.active ? '0%' : '100vh',
				padding: { xs: 'unset', lg: '0 1.5rem !important' },
				opacity: props.active ? '1' : '0',
				transition: 'all .35s ease-out',
			}}
		>
			<Stack
				position='relative'
				direction='row'
				alignItems='center'
				justifyContent='space-evenly'
				gap={1.5}
				sx={{
					width: '100%',
					height: !!windowDimensions && windowDimensions.clientWidth < 750 ? '250px' : '340px',
					backgroundColor: 'rgba(0, 111, 226, .75)',
					backgroundImage: props.patternUrl
						? `url(${props.patternUrl})`
						: (props.sectionOrder / 4) % 1 === 0.25
						? 'url(/images/courses/mainPage/sectionPatterns/section2.svg)'
						: (props.sectionOrder / 4) % 1 === 0.5
						? 'url(/images/courses/mainPage/sectionPatterns/section3.svg)'
						: (props.sectionOrder / 4) % 1 === 0.75
						? 'url(/images/courses/mainPage/sectionPatterns/section4.svg)'
						: 'url(/images/courses/mainPage/sectionPatterns/section1.svg)',
					backgroundSize: 'cover',
					backgroundPositionY: 'center',
					borderRadius: '15px',
					padding: '1rem',
					zIndex: '1',
					'&:before': {
						content: '""',
						position: 'absolute',
						inset: '0',
						backgroundColor: 'inherit',
						zIndex: '-1',
						borderRadius: 'inherit',
					},
				}}
			>
				<Box sx={{ zIndex: '1' }}>
					{!!props.iconUrl ? (
						<img
							src={props.iconUrl}
							alt='section big icon'
							style={{
								minWidth: !!windowDimensions && windowDimensions.clientWidth < 750 ? '125px' : '225px',
								maxHeight: !!windowDimensions && windowDimensions.clientWidth < 750 ? '125px' : '225px',
							}}
						/>
					) : (
						<OnyxTypography
							text={convertToRomanNumeral(props.sectionOrder)}
							tpSize='7rem'
							tpColor='white'
							tpWeight='bold'
						/>
					)}
				</Box>
				<Box>
					<OnyxTypography
						text={`Раздел ${props.sectionOrder}`}
						tpWeight='bold'
						tpColor='white'
						sx={{ textTransform: 'uppercase', fontSize: { xs: '2rem', md: '2.75rem' } }}
					/>
					<OnyxTypography
						text={`Продолжительность ~ ${props.duration} ч.`}
						tpColor='white'
						sx={{ textTransform: 'uppercase', marginTop: '1rem', fontSize: { xs: '1rem', md: '1.25rem' } }}
					/>
				</Box>

				<Stack
					direction='row'
					justifyContent='space-between'
					alignItems='center'
					gap={2}
					width='fit-content'
					sx={{ position: 'absolute', bottom: '10px', right: '20px' }}
				>
					<OnyxTypography
						text={`Изучено: ${props.progress?.current || 0}/${props.progress?.total || 0}`}
						tpColor='white'
						sx={{ textTransform: 'uppercase', fontSize: { xs: '.85rem', md: '1rem' } }}
					/>
					<Box sx={{ color: 'red' }}>
						<ClassicLoader
							disableShrink
							variant='determinate'
							color={{ darkTheme: 'lightgreen', lightTheme: 'lightgreen' }}
							secondaryColor={{ darkTheme: 'grey', lightTheme: 'grey' }}
							value={(props.progress.current / (props.progress?.total || 0)) * 100}
							size={!!windowDimensions && windowDimensions.clientWidth < 750 ? 35 : 50}
						/>
					</Box>
				</Stack>
			</Stack>

			<OnyxTypography
				text={props.title}
				tpWeight='bold'
				tpAlign='center'
				sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
			/>
			<Divider sx={{ width: '100%' }} />

			<Stack direction={{ xs: 'column', md: 'row' }} gap={{ xs: 2, md: 0.5 }}>
				<Box sx={{ width: '100%' }}>
					<OnyxTypography
						text='Раздел содержит:'
						tpSize='.85rem'
						tpColor='secondary'
						sx={{ marginBottom: '1.5rem', textTransform: 'uppercase' }}
					/>

					<Stack direction='row' gap={1} sx={{ svg: { color: theme => theme.palette.primary.main } }}>
						<Stack
							direction={
								Object.values(props.contentTypes).filter(boolean => boolean === true).length > 2
									? 'column'
									: 'row'
							}
							justifyContent='space-between'
							alignItems='center'
							width='100%'
							gap={2.5}
							sx={{ svg: { fontSize: '2rem' } }}
						>
							{Object.entries(props.contentTypes)
								.filter(tuple => tuple[1] === true)
								.slice(0, 2)
								.map(tuple => (
									<ContentTypeElement
										key={tuple[0]}
										type={tuple[0] as keyof MainPageCourseContentI['contentTypes']}
									/>
								))}
						</Stack>

						{Object.values(props.contentTypes).filter(boolean => boolean === true).length > 2 && (
							<Stack
								direction='column'
								justifyContent='space-between'
								alignItems='center'
								width='100%'
								gap={2.5}
								sx={{ svg: { fontSize: '2rem' } }}
							>
								{Object.entries(props.contentTypes)
									.filter(tuple => tuple[1] === true)
									.slice(2)
									.map(tuple => (
										<ContentTypeElement
											key={tuple[0]}
											type={tuple[0] as keyof MainPageCourseContentI['contentTypes']}
										/>
									))}
							</Stack>
						)}
					</Stack>
				</Box>

				<Divider orientation='vertical' sx={{ width: '1px', margin: '0 1rem' }} />
				<Stack width={{ xs: '100%', md: '70%' }} gap={0.5}>
					<Stack direction='row' width='100%' alignItems='center' justifyContent='space-between' gap={1.5}>
						<OnyxTypography
							component='span'
							tpSize='.85rem'
							tpColor='secondary'
							text='Перейти к изучению:'
							sx={{ textTransform: 'uppercase' }}
						/>

						{SystemRolesOptions[userData._systemRole].accessLevel > 1 && (
							<OnyxLink
								href={`/admin-courses/${(router.query.cid as string | undefined) || ''}/sections/${
									props.csid
								}`}
							>
								<Tooltip arrow title='Настройки раздела' placement='left'>
									<IconButton size='small' color='warning'>
										<SettingsIcon />
									</IconButton>
								</Tooltip>
							</OnyxLink>
						)}
					</Stack>

					<Stack
						width='100%'
						alignItems='center'
						justifyContent='space-between'
						sx={{ flexDirection: { xs: 'column', sm: 'row' }, button: { whiteSpace: 'nowrap' } }}
						gap={1.5}
					>
						<OnyxLink
							fullwidth
							title='Перейти к разделу'
							href={`${(router.query.cid as string | undefined) || ''}/${props.sectionUrl}`}
							onClick={event => {
								if (!!props.sectionUrlDisabled) {
									event.preventDefault();
									event.stopPropagation();
								}
							}}
						>
							<Button
								disabled={props.sectionUrlDisabled}
								variant='contained'
								fullWidth
								size='medium'
								sx={{ padding: '1rem 1.75rem' }}
							>
								Перейти к изучению
							</Button>
						</OnyxLink>

						{!!windowDimensions && windowDimensions?.clientWidth < 1200 && (
							<Button
								size='medium'
								variant='outlined'
								sx={{ padding: '1rem 1.75rem' }}
								onClick={() => props.setActive(0)}
							>
								Закрыть окно
							</Button>
						)}
					</Stack>
				</Stack>
			</Stack>
		</Box>
	);

	return !!windowDimensions && windowDimensions?.clientWidth < 1200 ? (
		<OnyxAlertModal
			state={modalState}
			setState={() => props.setActive(0)}
			// title={`Информация по разделу ${props.sectionOrder}`}
			fullWidth
			disableButton
			disableCloseButton
			disableCloseIcon
			sx={{ display: modalState ? '' : 'none' }}
		>
			{SectionContent}
		</OnyxAlertModal>
	) : (
		SectionContent
	);
};

function ContentTypeElement(payload: { type: keyof MainPageCourseContentI['contentTypes'] }) {
	return (
		<Stack width='100%' direction='row' gap={1} alignItems='center' sx={{ fontSize: '1rem' }}>
			{payload.type === 'lectures' ? (
				<>
					<LibraryBooksOutlinedIcon /> Лекции
				</>
			) : payload.type === 'videoLectures' ? (
				<>
					<VideoLibraryOutlinedIcon /> Видеолекции
				</>
			) : payload.type === 'interactivity' ? (
				<>
					<SwipeVerticalOutlinedIcon /> Интерактивность
				</>
			) : (
				<>
					<DesignServicesOutlinedIcon /> Тестирование
				</>
			)}
		</Stack>
	);
}

export default MainPageCourseSectionContent;
