import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NightsStayOutlinedIcon from '@mui/icons-material/NightsStayOutlined';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import { useContext } from 'react';
import { ColorModeContext } from '../../../theme/Theme';

export const SwitchTheme = (props: { arrow?: boolean }) => {
	const theme = useTheme();
	const colorMode = useContext(ColorModeContext);

	return (
		<Tooltip arrow={props.arrow} title={theme.palette.mode === 'light' ? 'Тёмная тема' : 'Светлая тема'}>
			<IconButton sx={{ ml: 1, height: 'fit-content' }} onClick={colorMode.toggleColorMode} color='inherit'>
				{theme.palette.mode === 'light' ? <NightsStayOutlinedIcon /> : <LightModeOutlinedIcon />}
			</IconButton>
		</Tooltip>
	);
};
