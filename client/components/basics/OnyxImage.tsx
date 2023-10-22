import Box from '@mui/material/Box';
import { SxProps } from '@mui/material/styles';
import Image from 'next/image';

export interface OnyxImageI {
    src: string;
    alt: string;
	position?: 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky';
	margin?: string;
	width?: string;
	height?: string;
	align?: 'left' | 'center' | 'right';
    sx?: SxProps;
}

/**
 * @IUnknown404I Corporate Image stylizated component.
 * @param props as wrapper styles and image src and alt attributes.
 * @returns Next Image component wrapped by MUI Box.
 */
const OnyxImage = (props: OnyxImageI) => {
	const validStyles: React.CSSProperties = {
		position: props.position || 'relative',
		margin: props.margin || '',
		height: props.height || '100%',
		width: props.width || '100%',
		display: 'flex',
		justifyContent:
			props.align === 'center'
				? 'center'
				: props.align === 'left'
				? 'flex-start'
				: props.align === 'right'
				? 'flex-end'
				: 'center',
		alignItems:
			props.align === 'center'
				? 'center'
				: props.align === 'left'
				? 'flex-start'
				: props.align === 'right'
				? 'flex-end'
				: 'center',
        minWidth: '50px',
        minHeight: '50px',
	};

	return (
		<Box sx={{...validStyles, ...props.sx}}>
			<Image src={props.src} alt={props.alt} fill style={{ objectFit: 'contain' }} />
		</Box>
	);
};

export default OnyxImage;
