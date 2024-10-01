import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';
import { useTypedSelector } from '../../../../redux/hooks';
import { selectUser, SystemRolesOptions } from '../../../../redux/slices/user';
import OnyxLink from '../../../basics/OnyxLink';
import { OnyxTypography } from '../../../basics/OnyxTypography';

interface MainPageCourseHeader {
	type: string;
	title: string;
	duration?: number | string;
}

const MainPageCourseHeader = (props: MainPageCourseHeader) => {
	const router = useRouter();
	const userData = useTypedSelector(selectUser);

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
				<Stack direction='row' alignItems='center' gap={0.5}>
					{props.title}
					{SystemRolesOptions[userData._systemRole].accessLevel > 1 && (
						<OnyxLink
							href={`/admin-courses/${(router.query.cid as string | undefined) || ''}`}
							style={{ transform: 'translateY(-3px)' }}
						>
							<Tooltip arrow title='Параметры образовательной программы' placement='top'>
								<IconButton size='small' color='warning'>
									<SettingsIcon sx={{ fontSize: '1.5rem' }} />
								</IconButton>
							</Tooltip>
						</OnyxLink>
					)}
				</Stack>

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
