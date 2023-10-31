import LightbulbIcon from '@mui/icons-material/Lightbulb';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import SecurityIcon from '@mui/icons-material/Security';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { OnyxTypography } from '../../../../../../../components/basics/OnyxTypography';
import CoursesLayout from '../../../../../../../layout/CoursesLayout';
import { rtkApi } from '../../../../../../../redux/api';

const ScormConfigPage = () => {
	const router = useRouter();
	const { data: scormData, fulfilledTimeStamp } = rtkApi.useScormDataQuery((router.query.scid as string) || '');

	return (
		<>
			<Head>
				<title>Безопасность Scorm-пакета</title>
				<meta name='description' content='Безопасность Scorm-пакета' />
				<meta name='robots' content='noindex, nofollow' />
			</Head>

			<CoursesLayout
				backButtonprops={{
					text: 'К презентации',
					href: `/courses/${router.query.cid}/${router.query.csid}/scorm/${router.query.scid}`,
				}}
				progressValue={30}
				breadcrumbsCourseContent={[
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
						element: 'Безопасность Scorm-пакета',
						icon: <SecurityIcon />,
					},
				]}
			>
				<OnyxTypography component='h1' tpWeight='bold' tpColor='primary' tpSize='1.5rem'>
					Страница безопасности Scorm-пакета
				</OnyxTypography>

				<OnyxTypography>Название пакета: {!!fulfilledTimeStamp && scormData?.title}</OnyxTypography>
				<OnyxTypography>Тип Scorm-пакета: {!!fulfilledTimeStamp && scormData?.type}</OnyxTypography>
				<OnyxTypography>
					Категория: {(!!fulfilledTimeStamp && scormData?.category) || 'без категории'}
				</OnyxTypography>
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
