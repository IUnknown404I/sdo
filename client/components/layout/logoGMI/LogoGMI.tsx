import Box from '@mui/material/Box';
import Link from 'next/link';
import { OnyxImageI } from '../../basics/OnyxImage';

export const LogoGMI = (props: Omit<OnyxImageI, 'src' | 'alt'> & { disableLink?: boolean }) => {
	const wrapperStyles: React.CSSProperties = {
		position: props.position || 'relative',
		margin: props.margin || `20px ${props.align && props.align !== 'center' ? '0' : 'auto'}`,
		height: props.height || '80px',
		width: props.width || '150px',
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
	};

	function GMILogoElement() {
		return (
			<Box sx={wrapperStyles}>
				<img
					alt='НОЦ Инжиниринг'
					// src='/logo/logo-holder.png'
					src={`${process.env.NEXT_PUBLIC_SERVER}/system/logo`}
					style={{ objectFit: 'contain', width: '100%', height: '100%' }}
				/>
			</Box>
		);
	}

	return (
		<>
			{props.disableLink ? (
				<GMILogoElement />
			) : (
				<Link href='/'>
					<GMILogoElement />
				</Link>
			)}
		</>
	);
};
