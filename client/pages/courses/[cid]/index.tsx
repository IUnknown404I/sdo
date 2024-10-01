import { Stack } from '@mui/material';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { Suspense } from 'react';
import CourseMainPage from '../../../components/pages/courses/CourseMainPage';
import CoursePageComponent from '../../../components/pages/courses/CoursePage';
import ModernLoader from '../../../components/utils/loaders/ModernLoader';
import { notification } from '../../../components/utils/notifications/Notification';
import CoursesLayout from '../../../layout/CoursesLayout';
import { OnyxApiErrorResponseType, rtkApi } from '../../../redux/api';

const CoursePage = (props: { cid: string }) => {
	const router = useRouter();
	const { data: courseData, isLoading: isDataLoading, error } = rtkApi.useCourseDataQuery(props.cid);

	React.useEffect(() => {
		if (!!error) {
			if (!!(error as OnyxApiErrorResponseType).data?.message)
				notification({
					type: 'error',
					message: (error as OnyxApiErrorResponseType).data.message as string,
					autoClose: 7500,
				});
			router.push('/courses');
		}
	}, [error]);
	React.useEffect(() => {}, [router.isFallback]);

	if (router.isFallback)
		return (
			<>
				<Head>
					<title>Загружаем данные...</title>
					<meta
						name='description'
						content='Научно-образовательный центр ООО «Газпром межрегионгаз инжиниринг»'
					/>
					<meta name='robots' content='noindex, nofollow' />
				</Head>

				<CoursesLayout>
					<Stack
						width='100%'
						height='calc(100lvh - 250px)'
						position='relative'
						alignItems='center'
						justifyContent='center'
					>
						<ModernLoader centered tripleLoadersMode loading size={125} />
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
				<CoursesLayout courseIconUrl={courseData.main.previewScreenshot}>
					<Suspense
						fallback={
							<Stack
								width='100%'
								height='60lvh'
								position='relative'
								alignItems='center'
								justifyContent='center'
							>
								<ModernLoader centered tripleLoadersMode loading />
							</Stack>
						}
					>
						{props.cid === 'personal-protective-equipment' ? (
							<CourseMainPage courseData={courseData} />
						) : (
							<CoursePageComponent courseData={courseData} />
						)}
					</Suspense>
				</CoursesLayout>
			) : (
				<CoursesLayout>
					<Stack width='100%' height='calc(100lvh - 300px)'>
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
		},
		revalidate: 30,
	};
}

export default CoursePage;
