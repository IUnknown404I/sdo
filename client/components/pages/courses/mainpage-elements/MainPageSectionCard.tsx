import { Box, Stack } from '@mui/material';
import { convertToRomanNumeral } from '../../../../utils/utilityFunctions';
import { OnyxTypography } from '../../../basics/OnyxTypography';

interface MainPageSectionCardI {
	orderNumber: number;
	description: string;
	iconUrl?: string;
	patternUrl?: string;
	onClick?: Function;
}

function MainPageSectionCard(props: MainPageSectionCardI) {
	return (
		<Stack
			className={`course-section-${props.orderNumber}`}
			direction='row'
			flexWrap='nowrap'
			justifyContent='center'
			alignItems='center'
			padding='.5rem'
			gap={2}
			width='100%'
			zIndex={1}
			onClick={!!props.onClick ? () => (props.onClick as Function)(props.orderNumber) : undefined}
			sx={{
				cursor: 'pointer',
				borderRadius: '15px',
				transition: 'all .25s ease-out',
				'&:hover': { backgroundColor: { xs: 'unset', md: 'rgba(54, 142, 232, .25)' } },
			}}
		>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minWidth: '140px',
					height: '140px',
					backgroundColor: 'white',
					overflow: 'hidden',
					borderRadius: '15px',
					backgroundImage: props.patternUrl
						? `url(${props.patternUrl})`
						: (props.orderNumber / 4) % 1 === 0.25
						? 'url(/images/courses/mainPage/sectionPatterns/section2.svg)'
						: (props.orderNumber / 4) % 1 === 0.5
						? 'url(/images/courses/mainPage/sectionPatterns/section3.svg)'
						: (props.orderNumber / 4) % 1 === 0.75
						? 'url(/images/courses/mainPage/sectionPatterns/section4.svg)'
						: 'url(/images/courses/mainPage/sectionPatterns/section1.svg)',
					backgroundSize: 'cover',
				}}
			>
				{props.iconUrl ? (
					<img src={props.iconUrl} alt='Section icon' style={{ width: '90px', maxHeight: '135px' }} />
				) : (
					<OnyxTypography
						text={convertToRomanNumeral(props.orderNumber)}
						tpSize='4rem'
						tpColor='primary'
						tpWeight='bold'
					/>
				)}
			</Box>
			<Box sx={{ width: '100%' }}>
				<OnyxTypography
					text={`Раздел ${props.orderNumber}`}
					tpColor='secondary'
					sx={{ textTransform: 'uppercase', fontSize: { xs: '1rem', md: '1.15rem' } }}
				/>
				<OnyxTypography
					text={
						props.description.length > 190
							? props.description.slice(0, props.description.slice(0, 190).lastIndexOf(' ')) + '...'
							: props.description
					}
					sx={{ marginTop: '.5rem', lineHeight: '1.25', fontSize: { xs: '1rem', md: '1.15rem' } }}
				/>
			</Box>
		</Stack>
	);
}

export default MainPageSectionCard;
