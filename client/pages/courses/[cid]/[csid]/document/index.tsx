import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { Stack } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CoursesLayout from '../../../../../layout/CoursesLayout';

const CourseSectionDocumentPage = () => {
	const router = useRouter();
	return (
		<>
			<Head>
				<title>Документ программы</title>
				<meta name='description' content='Документ программы' />
				<meta name='robots' content='noindex, nofollow' />
			</Head>

			<CoursesLayout
				backButton
				progressValue={30}
				breadcrumbsCourseContent={[
					{
						href: `/courses/${router.query.cid}/${router.query.csid}`,
						element: 'Раздел',
						icon: <LightbulbIcon />,
					},
					{
						element: 'Документ',
						icon: <DocumentScannerIcon />,
					},
				]}
			>
				<Stack
					component='section'
					direction='column'
					alignItems='center'
					justifyContent='center'
					sx={{
						'> iframe': {
							width: '100%',
							minHeight: '87vh',
							borderRadius: '10px',
						},
					}}
					gap={1}
				>
					<iframe
						// src='/documents/ppt.pptx'
						src='/documents/document.pdf'
						// style={{ border: 'unset', backgroundColor: '#eceff1' }}
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

export default CourseSectionDocumentPage;
