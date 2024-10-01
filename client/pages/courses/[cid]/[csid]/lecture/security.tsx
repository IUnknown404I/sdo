import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SecurityIcon from '@mui/icons-material/Security';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { OnyxTypography } from '../../../../../components/basics/OnyxTypography';
import CoursesLayout from '../../../../../layout/CoursesLayout';

const CourseSectionLectureSecurityPage = () => {
	const router = useRouter();
	return (
		<>
			<Head>
				<title>Ограничения лекции</title>
				<meta name='description' content='Ограничения лекции' />
				<meta name='robots' content='noindex, nofollow' />
			</Head>

			<CoursesLayout
				backButton
				
				breadcrumbs={[
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
						element: 'Ограничения лекции',
						icon: <SecurityIcon />,
					},
				]}
			>
				{/* @ts-ignore */}
				<OnyxTypography
					text='Ограничения лекции'
					tpSize='1.5rem'
					tpColor='primary'
					component='h2'
					sx={{ marginBottom: '.75rem' }}
				/>
			</CoursesLayout>
		</>
	);
};

export const getServerSideProps = async (context: any) => {
	return {
		props: {},
	};
};

export default CourseSectionLectureSecurityPage;
