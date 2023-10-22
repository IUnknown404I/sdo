import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import PhoneForwardedRoundedIcon from '@mui/icons-material/PhoneForwardedRounded';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { SpeedDial, SpeedDialAction, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { LogoGMI } from '../../../layout/logoGMI/LogoGMI';
import { SwitchTheme } from '../../../utils/switchTheme/SwitchTheme';

const MinifiedHeader = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				paddingRight: '1rem',
				width: '100%',
				height: '100px',
				borderRadius: '0',
				paddingInline: {
					md: '0',
					lg: '1.5rem',
				},
				backgroundColor: theme => (theme.palette.mode === 'light' ? '#EFF2F6' : ''),
			}}
		>
			<LogoGMI disableLink width='125px' height='100px' align='left' />

			<Box>
				<SpeedDial
					ariaLabel='Support Contacts'
					direction='down'
					sx={{
						position: 'relative',
						display: 'inline-block',
						'> div': {
							position: 'absolute',
							top: '0',
							left: '0',
							marginTop: 'unset !important',
							paddingTop: '100% !important',
						},
						button: {
							backgroundColor: 'unset',
							boxShadow: 'unset',
							color: 'inherit',
							fontSize: '2rem',
							'&:hover': {
								backgroundColor: theme => (theme.palette.mode === 'light' ? '#e6e9ec' : '#1d2b3a'),
							},
						},
						a: {
							color: 'inherit',
						},
					}}
					icon={<SupportAgentIcon />}
				>
					{[
						{
							icon: (
								<Link href='mailto:u2610272@mrgeng.ru' target='_blank' rel='noreffer' aria-label='send email'>
									<AlternateEmailIcon />
								</Link>
							),
							name: 'Написать письмо',
						},
						{
							icon: (
								<Link href='tel:+78122003162' target='_blank' rel='noreffer' aria-label='phone call'>
									<PhoneForwardedRoundedIcon />
								</Link>
							),
							name: 'Позвонить на телефон',
						},
					].map(action => (
						<SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} />
					))}
				</SpeedDial>
				<SwitchTheme />
				<Link href='https://umcmrg.ru' target='_blank'>
					<Tooltip title='Перейти на сайт НОЦ' sx={{ marginLeft: '.5rem' }}>
						<IconButton>
							<LanguageRoundedIcon
								sx={{ color: theme => (theme.palette.mode === 'light' ? '#424242' : '') }}
							/>
						</IconButton>
					</Tooltip>
				</Link>
			</Box>
		</Box>
	);
};

export default MinifiedHeader;
