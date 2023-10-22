import Box from '@mui/material/Box';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
import { SxProps, Theme } from '@mui/system';

export interface ClassicLoaderI {
	iconVariant?: boolean;
	size?: number;
	disableShrink?: boolean;
	animationDuration?: string;
	thickness?: number;
	value?: number;
	sx?: SxProps<Theme>;
	color?: {
		lightTheme: string;
		darkTheme: string;
	};
	secondaryColor?: {
		lightTheme: string;
		darkTheme: string;
	};
}

const ClassicLoader = (props: ClassicLoaderI): JSX.Element => {
	return props.iconVariant ? (
		<CircularProgress
			variant='indeterminate'
			disableShrink={props.disableShrink === undefined ? true : props.disableShrink}
			size={props.size || 24}
			thickness={props.thickness || 8}
			sx={{
				...props.sx,
				color: props.secondaryColor
					? theme =>
							theme.palette.mode === 'light'
								? props.secondaryColor!.lightTheme
								: props.secondaryColor!.darkTheme
					: theme => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
				animationDuration: props.animationDuration || '600ms',
				position: 'absolute',
				// zIndex: '1',
				top: '50%',
				left: '50%',
				marginTop: '-12px',
				marginLeft: '-12px',
				[`& .${circularProgressClasses.circle}`]: {
					strokeLinecap: 'round',
				},
			}}
		/>
	) : (
		<Box
			sx={{
				...props.sx,
				position: 'relative',
				display: 'inline',
				width: 'fit-content',
				height: 'fit-content',
			}}
		>
			<CircularProgress
				variant='determinate'
				size={props.size || 24}
				thickness={props.thickness || 4}
				value={100}
				sx={{
					color: props.secondaryColor
						? theme =>
								theme.palette.mode === 'light'
									? props.secondaryColor!.lightTheme
									: props.secondaryColor!.darkTheme
						: theme => theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
				}}
			/>
			<CircularProgress
				variant='indeterminate'
				size={props.size || 24}
				disableShrink={props.disableShrink === undefined ? true : props.disableShrink}
				thickness={props.thickness || 4}
				// value={props.value || 80}
				sx={{
					color: props.color
						? theme => (theme.palette.mode === 'light' ? props.color!.lightTheme : props.color!.darkTheme)
						: theme => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
					animationDuration: props.animationDuration || '600ms',
					position: 'absolute',
					left: 0,
					[`& .${circularProgressClasses.circle}`]: {
						strokeLinecap: 'round',
					},
				}}
			/>
		</Box>
	);
};

export default ClassicLoader;
