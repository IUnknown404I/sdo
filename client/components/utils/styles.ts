import { Theme } from '@mui/system';

export const animatedUnderlineStyles = (theme: Theme) => {
	return {
		paddingBottom: '0px',
		textDecoration: 'none',
		backgroundImage:
			theme.palette.mode === 'dark' ? 'linear-gradient(floralwhite, white)' : 'linear-gradient(#006fba, #006fba)',
		// backgroundImage: 'linear-gradient($mrg_lightblue, $mrg_lightblue)',
		// backgroundImage: '-moz-linear-gradient($mrg_lightblue, $mrg_lightblue)',
		backgroundPosition: '0% 100%',
		backgroundRepeat: 'no-repeat',
		backgroundSize: '0% 1px',
	};
};
