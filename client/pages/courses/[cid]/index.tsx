import { Stack } from '@mui/material';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import CoursePageComponent from '../../../components/pages/courses/CoursePage';
import ModernLoader from '../../../components/utils/loaders/ModernLoader';
import CoursesLayout from '../../../layout/CoursesLayout';

const CoursePage = (props: { cid: string; courseData?: any }) => {
	const router = useRouter();

	React.useEffect(() => {
		if (!router.isFallback && props.courseData === undefined) router.push('/404');
	}, [router.isFallback]);

	if (router.isFallback || !props.courseData)
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
				<title>Программа обучения</title>
				<meta name='description' content='Программа обучения' />
				<meta name='robots' content='index, follow' />
			</Head>

			<CoursesLayout>
				<CoursePageComponent courseData={props.courseData} />
			</CoursesLayout>
		</>
	);
};

export async function getStaticPaths() {
	const cids = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/courses/cids`).then(res => res.data as string[]);
	return {
		paths: cids.map(cid => ({
			params: {
				// cid: `/courses/${cid}`,
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
			courseData: (await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/courses/${props.params.cid}`)).data,
		},
		revalidate: 30,
	};
}

export default CoursePage;
