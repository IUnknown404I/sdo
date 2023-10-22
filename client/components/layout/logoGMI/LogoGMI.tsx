import Box from '@mui/material/Box';
import Image from 'next/image';
import Link from 'next/link';
import { OnyxImageI } from '../../basics/OnyxImage';

export const LogoGMI = (props: Omit<OnyxImageI, 'src' | 'alt'> & { disableLink?: boolean }) => {
	const wrapperStyles: React.CSSProperties = {
		position: props.position || 'relative',
		margin: props.margin || `20px ${props.align && props.align !== 'center' ? '0' : 'auto'}`,
		height: props.height || '80px',
		width: props.width || '150px',
		display: 'flex',
		justifyContent: props.align === 'center' ? 'center' : 
			props.align === 'left' ? 'flex-start' :
			props.align === 'right' ? 'flex-end' : 'center',
		alignItems: props.align === 'center' ? 'center' : 
			props.align === 'left' ? 'flex-start' :
			props.align === 'right' ? 'flex-end' : 'center',
	};

	return (
		<>
			{props.disableLink ? (
				<Box sx={wrapperStyles}>
					<Image priority src={'/logo/logo-gmi.svg'} alt='НОЦ Инжиниринг' fill style={{ objectFit: 'contain' }} />
				</Box>
			) : (
				<Link href='/'>
					<Box sx={wrapperStyles}>
						<Image priority src={'/logo/logo-gmi.svg'} alt='НОЦ Инжиниринг' fill style={{ objectFit: 'contain' }} />
					</Box>
				</Link>
			)}
		</>
	);
};
