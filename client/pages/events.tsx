import { Paper, Stack } from '@mui/material';
import { OnyxTypography } from '../components/basics/OnyxTypography';
import Layout from '../layout/Layout';
import { NextPageWithLayout } from './_app';

const EventsPage: NextPageWithLayout = () => {
	return (
		<Layout>
			<Stack alignItems='center' justifyContent='center' sx={{ minHeight: 'calc(100lvh - 250px)' }}>
				<Paper
					elevation={2}
					sx={{
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column',
						justifyContent: 'center',
						borderRadius: '15px',
						padding: '3rem',
						gap: 1,
					}}
				>
					<OnyxTypography
						tpWeight='bold'
						tpSize='1.5rem'
						tpColor='primary'
						text='Вы перешли на страницу встреч и событий'
						sx={{ marginBottom: '1.5rem' }}
					/>
					<OnyxTypography
						tpSize='1.25rem'
						text='Данный модуль является заказным и опционально подключаемым к итоговой сборке'
					/>
					<OnyxTypography
						tpSize='1.25rem'
						text='В текущую версию образовательной платформы модуль событий не включен'
					/>
				</Paper>
			</Stack>
		</Layout>
	);
};

export default EventsPage;
