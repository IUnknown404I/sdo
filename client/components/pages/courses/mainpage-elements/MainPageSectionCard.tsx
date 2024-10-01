import { Box, Stack } from '@mui/material';
import { useTypedSelector } from '../../../../redux/hooks';
import { selectUser } from '../../../../redux/slices/user';
import { formatDate } from '../../../../utils/date-utils';
import { convertToRomanNumeral } from '../../../../utils/utilityFunctions';
import { OnyxTypography } from '../../../basics/OnyxTypography';

interface MainPageSectionCardI {
	disabled?: boolean;
	orderNumber: number;
	description: string;
	iconUrl?: string;
	patternUrl?: string;
	onClick?: Function;
	from?: number;
	to?: number;
}

function MainPageSectionCard(props: MainPageSectionCardI) {
	const userData = useTypedSelector(selectUser);

	const startWords =
		!!props.from || !!props.to ? `${!!props.to && props.to < +new Date() ? 'Было доступно ' : 'Доступно '}` : '';
	const restrictmentsText =
		startWords +
		(!!props.from || !!props.to
			? `${
					!startWords.includes('Было доступно') && props.from
						? 'c ' + formatDate(new Date(props.from), { mode: 'full_short' })
						: ''
			  }${!startWords.includes('Было доступно') && !!props.from && !!props.to ? ' - ' : ''}${
					props.to ? 'по ' + formatDate(new Date(props.to), { mode: 'full_short' }) : ''
			  }`
			: '');

	return (
		<Stack
			width='100%'
			direction='row'
			flexWrap='nowrap'
			justifyContent='center'
			alignItems='center'
			padding='.5rem'
			zIndex={1}
			gap={2}
			className={`course-section-${props.orderNumber}`}
			sx={{
				borderRadius: '15px',
				transition: 'all .25s ease-out',
				cursor: props.disabled && userData._systemRole === 'user' ? 'not-allowed' : 'pointer',
				backgroundColor: theme => (props.disabled ? theme.palette.secondary.light : 'initial'),
				'&:hover': props.disabled ? {} : { backgroundColor: { xs: 'unset', md: 'rgba(54, 142, 232, .25)' } },
			}}
			onClick={
				!!props.onClick && (!props.disabled || (props.disabled && userData._systemRole !== 'user'))
					? () => (props.onClick as Function)(props.orderNumber)
					: undefined
			}
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
					opacity: props.disabled ? '.65' : '1',
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
				{props.disabled || props.iconUrl ? (
					<img
						alt='Section icon'
						src={props.disabled ? '/images/courses/mainPage/lock.png' : props.iconUrl}
						style={{ width: '90px', maxHeight: '135px' }}
					/>
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
					sx={{
						textTransform: 'uppercase',
						fontSize: { xs: '1rem', xl: '1.15rem' },
						color: theme => theme.palette.secondary[props.disabled ? 'dark' : 'main'],
					}}
				/>
				<OnyxTypography
					text={
						props.description.length > 190
							? props.description.slice(0, props.description.slice(0, 190).lastIndexOf(' ')) + '...'
							: props.description
					}
					sx={{
						marginTop: '.5rem',
						lineHeight: '1.25',
						fontSize: { xs: '1rem', xl: '1.15rem' },
						color: theme => (props.disabled ? theme.palette.secondary.dark : ''),
					}}
				/>

				{!!restrictmentsText && (
					<OnyxTypography
						text={restrictmentsText}
						sx={{
							marginTop: '.5rem',
							lineHeight: '1',
							fontSize: { xs: '.85rem', xl: '1rem' },
							color: theme => (props.disabled ? 'whitesmoke' : theme.palette.secondary.dark),
						}}
					/>
				)}
			</Box>
		</Stack>
	);
}

export default MainPageSectionCard;
