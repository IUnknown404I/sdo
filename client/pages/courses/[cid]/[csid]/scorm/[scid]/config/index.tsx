import LightbulbIcon from '@mui/icons-material/Lightbulb';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import SettingsIcon from '@mui/icons-material/Settings';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ScormConfigPageContent from '../../../../../../../components/pages/courses/scorm-elements/ScormConfigPage';
import CoursesLayout from '../../../../../../../layout/CoursesLayout';

const ScormConfigPage = () => {
	const router = useRouter();
	return (
		<>
			<Head>
				<title>Настройки Scorm-пакета</title>
				<meta name='description' content='Настройки Scorm-пакета' />
				<meta name='robots' content='noindex, nofollow' />
			</Head>

			<CoursesLayout
				backButton
				backButtonProps={{
					text: 'К презентации',
					href: `/courses/${router.query.cid}/${router.query.csid}/scorm/${router.query.scid}`,
				}}
				
				breadcrumbs={[
					{
						href: `/courses/${router.query.cid}/${router.query.csid}`,
						element: 'Раздел',
						icon: <LightbulbIcon />,
					},
					{
						href: `/courses/${router.query.cid}/${router.query.csid}/scorm/${router.query.scid}`,
						element: 'Интерактивная презентация',
						icon: <OndemandVideoIcon />,
					},
					{
						element: 'Настройки Scorm-пакета',
						icon: <SettingsIcon />,
					},
				]}
			>
				<ScormConfigPageContent />
			</CoursesLayout>
		</>
	);
};

export const getServerSideProps = async (context: any) => {
	return {
		props: {},
	};
};

export default ScormConfigPage;
