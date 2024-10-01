import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DocumentPreviewPageContent from '../../../../../components/pages/courses/section-elements/SectionContentDocumentItem/DocumentPreviewPageContent';
import CoursesLayout from '../../../../../layout/CoursesLayout';

const CourseSectionDocumentPage = () => {
	const router = useRouter();
	return (
		<>
			<Head>
				<title>Просмотр: Документ</title>
				<meta name='description' content='Просмотр: Файл' />
				<meta name='robots' content='noindex, nofollow' />
			</Head>

			<CoursesLayout
				backButton
				breadcrumbs={[
					{
						href: `/courses/${router.query.cid}/${router.query.csid}`,
						element: 'Раздел',
						icon: <LightbulbIcon />,
					},
					{
						element: 'Файл',
						icon: <DocumentScannerIcon />,
					},
				]}
			>
				<DocumentPreviewPageContent />
			</CoursesLayout>
		</>
	);
};

export const getServerSideProps = async (context: any) => {
	return {
		props: {},
	};
};

export default CourseSectionDocumentPage;
