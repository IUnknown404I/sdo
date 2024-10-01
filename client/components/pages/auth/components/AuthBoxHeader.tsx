import React from 'react';
import Box from '@mui/material/Box';

const AuthBoxHeader = (props: { children: JSX.Element | JSX.Element[] }) => {
	return (
		<Box
			sx={{
				position: 'relative',
				display: 'flex',
				gap: '.75rem',
				paddingBottom: '.5rem',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
				img: {
					filter: 'grayscale(.35)',
					maxWidth: '75px',
					maxHeight: '75px',
				},
				svg: {
					maxWidth: '50px',
					maxHeight: '50px',
					userSelect: 'none',
					marginRight: '-5px',
					fill: '#757575',
					transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
					flexShrink: '0',
				},
			}}
		>
			{props.children}
		</Box>
	);
};

export default AuthBoxHeader;
