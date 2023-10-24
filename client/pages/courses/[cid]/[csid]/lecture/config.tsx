import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SettingsIcon from '@mui/icons-material/Settings';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { OnyxTypography } from '../../../../../components/basics/OnyxTypography';
import { getTestLectureText } from '../../../../../components/pages/courses/section-elements/EditFieldsetTextBlock/EditFieldsetTextBlock';
import CoursesLayout from '../../../../../layout/CoursesLayout';

// @ts-ignore
const CustomTextEditor = dynamic(() => import('../../../../../components/editors/TextEditor'), {
	ssr: false,
});

const CourseSectionLectureConfigPage = () => {
	const router = useRouter();
	return (
		<>
			<Head>
				<title>Настройки лекции</title>
				<meta name='description' content='Настройки лекции' />
				<meta name='robots' content='noindex, nofollow' />
			</Head>

			<CoursesLayout
				backButton
				progressValue={30}
				breadcrumbsCourseContent={[
					{
						element: `Раздел программы`,
						href: `/courses/${router.query.cid as string}/${router.query.csid as string}`,
						icon: <LightbulbIcon />,
					},
					{
						element: 'Лекция',
						href: `/courses/${router.query.cid as string}/${
							router.query.csid as string
						}/lecture?cslid=HksoBFnsklapfIUShyhfap`,
						icon: <StickyNote2Icon />,
					},
					{
						element: 'Настройки лекции',
						icon: <SettingsIcon />,
					},
				]}
			>
				<OnyxTypography
					text='Контент лекции'
					tpSize='1.5rem'
					tpColor='primary'
					component='h2'
					sx={{ marginBottom: '.75rem' }}
				/>
				{/* @ts-ignore */}
				<CustomTextEditor content={getTestLectureText()} />
			</CoursesLayout>
		</>
	);
};

export const getServerSideProps = async (context: any) => {
	return {
		props: {},
	};
};

export default CourseSectionLectureConfigPage;
