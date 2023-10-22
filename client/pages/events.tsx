import { NextPageWithLayout } from './_app';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Layout } from '../layout/Layout';

const Dashboard1: NextPageWithLayout = () => {
	return (
		<Layout>
			<Box sx={{ padding: '20px' }}>
				<Typography variant='h6'>Events</Typography>
			</Box>
		</Layout>
	);
};

export default Dashboard1;
