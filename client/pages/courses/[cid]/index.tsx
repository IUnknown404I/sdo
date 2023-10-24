import { Stack } from '@mui/material';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { Suspense } from 'react';
import CourseMainPage from '../../../components/pages/courses/CourseMainPage';
import CoursePageComponent from '../../../components/pages/courses/CoursePage';
import ModernLoader from '../../../components/utils/loaders/ModernLoader';
import CoursesLayout from '../../../layout/CoursesLayout';
import { rtkApi } from '../../../redux/api';

const CoursePage = (props: { cid: string }) => {
	const router = useRouter();
	const { data: courseData, isLoading: isDataLoading } = rtkApi.useCourseDataQuery(props.cid);

	React.useEffect(() => {
		
	}, [router.isFallback]);

	if (router.isFallback)
		return (
			<>
				<Head>
					<title>Загружаем данные...</title>
					<meta
						name='description'
						content='Научно-образовательный центр ООО «Газпром межрегионгаз инжиниринг»'
					/>
					<meta name='robots' content='index, follow' />
				</Head>
				<CoursesLayout>
					<Stack width='100%' height='100%'>
						<ModernLoader centered tripleLoadersMode loading />
					</Stack>
				</CoursesLayout>
			</>
		);

	return (
		<>
			<Head>
				<title>{courseData?.main?.title || 'Программа обучения'}</title>
				<meta name='description' content={courseData?.main?.title || 'Программа обучения'} />
			</Head>

			{!!courseData && !isDataLoading ? (
				<CoursesLayout courseIconUrl={courseData.main.previewScreenshot} progressValue={30}>
					<Suspense fallback={<ModernLoader centered tripleLoadersMode loading />}>
						{props.cid === 'personal-protective-equipment' ? (
							<CourseMainPage courseData={courseData} />
						) : (
							<CoursePageComponent courseData={courseData} />
						)}
					</Suspense>
				</CoursesLayout>
			) : (
				<CoursesLayout>
					<Stack width='100%'>
						<ModernLoader centered tripleLoadersMode loading />
					</Stack>
				</CoursesLayout>
			)}
		</>
	);
};

export async function getStaticPaths() {
	const cids = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/courses/cids`).then(res => res.data as string[]);
	return {
		paths: cids.map(cid => ({
			params: {
				cid,
			},
		})),
		fallback: true,
	};
}

export async function getStaticProps(props: { params: { cid: string } }) {
	return {
		props: {
			cid: props.params.cid,
			// courseData: (await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/courses/${props.params.cid}`)).data,
		},
		revalidate: 30,
	};
}

export default CoursePage;
