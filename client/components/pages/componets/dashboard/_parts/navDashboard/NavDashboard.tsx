import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

export const NavDashboard = () => {
	const [value, setValue] = useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};
	
	return (
		<Box>
			<Tabs
				sx={{ width: '100%', bgcolor: 'background.paper' }}
				value={value}
				onChange={handleChange}
				variant='scrollable'
				scrollButtons
				allowScrollButtonsMobile
				aria-label='scrollable force tabs example'
			>
				<Tab label='Дашборд' />
				<Tab label='Мои курсы' />
				<Tab label='Профиль' />
			</Tabs>
		</Box>
	);
};
