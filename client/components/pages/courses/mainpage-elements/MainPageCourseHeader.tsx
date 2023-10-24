import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { Box } from '@mui/material';
import { OnyxTypography } from '../../../basics/OnyxTypography';

interface MainPageCourseHeader {
	type: string;
	title: string;
	duration?: number | string;
}

const MainPageCourseHeader = (props: MainPageCourseHeader) => {
	return (
		<Box>
			<OnyxTypography
				tpSize='.85rem'
				tpColor='secondary'
				sx={{
					fontSize: { xs: '.75rem', md: '.85rem' },
					textTransform: 'uppercase',
					display: 'flex',
					justifyContent: 'space-between',
					width: '100%',
				}}
			>
				{props.type}
				{!!props.duration && (
					<OnyxTypography text='Длительность' tpSize='.85rem' sx={{ display: { xs: 'none', md: 'flex' } }} />
				)}
			</OnyxTypography>
			<OnyxTypography
				component='h1'
				tpColor='primary'
				tpWeight='bold'
				sx={{
					fontSize: { xs: '1.25rem', md: '1.65rem' },
					textTransform: 'uppercase',
					display: 'flex',
					justifyContent: 'space-between',
					width: '100%',
				}}
			>
				{props.title}
				{!!props.duration && (
					<OnyxTypography
						tpSize='1.25rem'
						tpWeight='bold'
						sx={{
							display: { xs: 'none', md: 'flex' },
							flexWrap: 'nowrap',
							alignItems: 'center',
							wordWrap: 'unset',
							justifyContent: 'center',
							gap: '.25rem',
							textTransform: 'none',
							marginLeft: '1.5rem',
							marginRight: '.6rem',
						}}
					>
						<AccessTimeOutlinedIcon sx={{ color: 'primary', fontSize: '1.75rem' }} />
						<span style={{ minWidth: 'fit-content' }}>{props.duration} ч.</span>
					</OnyxTypography>
				)}
			</OnyxTypography>
		</Box>
	);
};

export default MainPageCourseHeader;
