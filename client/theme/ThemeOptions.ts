import { blueGrey, green } from '@mui/material/colors';

export const lightThemePalette = {
	primary: {
		main: '#006FBA',
		sub: '#000000',
		invert: '#ffffff',
	},
	secondary: {
		// main: '#C2C5C7',
		main: '#808080', //gray
	},
	content: {
		main: blueGrey[50],
	},
	blackText: {
		main: '#000000',
	},
	success: {
		main: green[500],
		contrastText: '#ffffff',
	},
};

export const darkThemePalette = {
	primary: {
		main: '#66B2FF',
		sub: '#ffffff',
		invert: '#000000',
	},
	secondary: {
		main: '#cecece',
	},
	background: {
		default: '#0A1929',
		paper: '#0A1929',
	},
	content: {
		main: '#102A43',
	},
	blackText: {
		main: '#FFFFFF',
	},
	success: {
		main: green[500],
		contrastText: '#ffffff',
	},
};

export const typographyTheme = {
	fontFamily: 'HeliosCondC',
	fontSize: 16,
	// [`@media screen and (min-width: 1537px)`]: {  },
	// [`@media screen and (min-width: 1201px) and (max-width: 1537px)`]: {  },
	// [`@media screen and (min-width: 901px) and (max-width: 1201px)`]: { fontSize: '14px' },
	// [`@media screen and (min-width: 601px) and (max-width: 901px)`]: { fontSize: '12px' },
	// [`@media screen and (max-width: 600px)`]: {  },
};

export const componentsTheme = {
	// MuiTooltip: {
	// 	styleOverrides: {
	// 		tooltip: {
	// 			color: '#cecece',
	// 			backgroundColor: '#0A1929',
	// 		},
	// 	},
	// },
};

export const getThemePalette = (mode: string) => {
	if (mode === 'ligth') {
		return lightThemePalette;
	} else if (mode === 'dark') {
		return darkThemePalette;
	} else {
		return lightThemePalette;
	}
};
