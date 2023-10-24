import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import { Stack } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { OnyxTypography } from '../../../../../../components/basics/OnyxTypography';
import CoursesLayout from '../../../../../../layout/CoursesLayout';

const ScormPage = () => {
	const router = useRouter();
	return (
		<>
			<Head>
				<title>Ограничения раздела</title>
				<meta name='description' content='Ограничения раздела' />
				<meta name='robots' content='noindex, nofollow' />
			</Head>

			<CoursesLayout
				backButton
				breadcrumbsCourseContent={[
					{
						href: `/courses/${router.query.cid}/${router.query.csid}`,
						element: 'Раздел',
						icon: <LightbulbIcon />,
					},
					{
						element: 'Настройки раздела',
						icon: <SettingsIcon />,
					},
					{
						element: 'Ограничения раздела',
						icon: <SecurityIcon />,
					},
				]}
			>
				<Stack
					width='100%'
					component='section'
					direction='column'
					alignItems='flex-start'
					justifyContent='flex-start'
					gap={1}
				>
					<OnyxTypography
						text='Настройки безопасности раздела'
						tpColor='primary'
						tpWeight='bold'
						tpSize='1.5rem'
					/>
				</Stack>
			</CoursesLayout>
		</>
	);
};

export const getServerSideProps = async (context: any) => {
	return {
		props: {},
	};
};

export default ScormPage;
