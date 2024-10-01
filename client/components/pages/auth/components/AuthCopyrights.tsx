import React from 'react';
import { Typography } from '@mui/material';

const AuthCopyrights = (props: { displaySxProps?: { [key: string]: string } }) => {
	return (
		<Typography
			variant='h3'
			fontSize='1rem'
			align='center'
			sx={{
				display: props.displaySxProps ? props.displaySxProps : '',
				color: theme => (theme.palette.mode === 'light' ? '#757575' : 'white'),
				padding: {
					xs: '0',
					sm: '0 1.5rem',
				},
				fontSize: {
					xs: '.75rem',
					sm: '1rem',
				},
			}}
		>
			© Система дистанционного образования научно-образовательного центра,&nbsp;
			{/* © Система дистанционного образования научно-образовательного центра ООО «Газпром межрегионгаз инжиниринг»,&nbsp; */}
			{new Date().getFullYear()}
		</Typography>
	);
};

export default AuthCopyrights;
