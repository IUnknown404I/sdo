import SpeakerNotesOffOutlinedIcon from '@mui/icons-material/SpeakerNotesOffOutlined';
import { Stack } from '@mui/material';
import React from 'react';
import { OnyxTypography } from '../basics/OnyxTypography';

export const DialogContainer = ({
	chatDomRef,
	children,
	mode,
	maxHeight,
	minHeight,
}: {
	chatDomRef: React.Ref<HTMLDivElement>;
	id?: string;
	children?: JSX.Element | JSX.Element[];
	mode?: 'full' | 'line';
	maxHeight?: string;
	minHeight?: string;
}) => {
	return (
		<Stack
			ref={chatDomRef}
			gap={1}
			position='relative'
			maxHeight={maxHeight || '100%'}
			minHeight={minHeight || (mode === 'full' ? '450px' : '300px')}
			height={mode === 'full' ? '100%' : ''}
			paddingRight='.2rem'
			sx={{
				overflowY: 'auto',
				'&::-webkit-scrollbar': { width: '3px' },
			}}
		>
			{children === undefined ? (
				mode === 'full' ? (
					<Stack
						width='100%'
						height='100%'
						direction='row'
						gap={2}
						alignItems='center'
						justifyContent='center'
						sx={{ color: theme => theme.palette.primary.main }}
					>
						<SpeakerNotesOffOutlinedIcon sx={{ color: 'primary' }} />
						Ещё никто не писал в чате!
					</Stack>
				) : (
					<OnyxTypography tpSize='1rem' boxWrapper>
						Ещё никто не писал в чате!
					</OnyxTypography>
				)
			) : (
				children
			)}
		</Stack>
	);
};

export default DialogContainer;
